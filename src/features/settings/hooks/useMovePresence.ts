import { useEffect, useState, useCallback, useRef } from 'react';
import { 
  doc, 
  onSnapshot, 
  setDoc, 
  serverTimestamp, 
  updateDoc, 
  getDoc,
  query,
  collection,
  where,
  DocumentData,
  QuerySnapshot,
  DocumentSnapshot,
  FirestoreError
} from 'firebase/firestore';
import { auth, firestore } from '../index';
import { toast } from 'react-toastify';

export interface PresenceState {
  lastSeen: any;
  online: boolean;
  userId: string;
  moveId: string;
  displayName?: string;
  photoURL?: string;
}

/**
 * Custom hook to manage user presence in a move instance using Firestore
 * @param moveId - The ID of the move to track presence for
 */
export function useMovePresence(moveId: string | null) {
  const [presence, setPresence] = useState<Record<string, PresenceState>>({});
  const [myStatus, setMyStatus] = useState<PresenceState | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Keep track of the current move ID to handle cleanup properly
  const currentMoveId = useRef<string | null>(null);
  const unsubscribeRef = useRef<() => void>(() => {});

  useEffect(() => {
    console.group('useMovePresence Effect');
    console.log('Initializing with moveId:', moveId);
    console.log('Current user:', auth.currentUser?.uid || 'No user');
    
    // Skip if already initialized with the same moveId
    if (isInitialized && moveId === currentMoveId.current) {
      console.log('Already initialized with moveId:', moveId);
      console.groupEnd();
      return;
    }
    
    // Reset state when moveId changes to null
    if (moveId === null) {
      console.log('❌ Move ID is null, resetting presence');
      setPresence({});
      setMyStatus(null);
      setIsOnline(false);
      setIsInitialized(false);
      currentMoveId.current = null;
      console.groupEnd();
      return;
    }
    
    // Early return if no moveId or invalid format
    if (!moveId || typeof moveId !== 'string' || moveId.trim() === '') {
      console.log('❌ Invalid Move ID, skipping presence setup');
      setPresence({});
      setMyStatus(null);
      setIsOnline(false);
      setIsInitialized(false);
      console.groupEnd();
      return;
    }
    
    // Early return if user is not authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      console.log('🔒 User not authenticated, skipping presence setup');
      setPresence({});
      setMyStatus(null);
      setIsOnline(false);
      setIsInitialized(false);
      console.groupEnd();
      return;
    }
    
    const userId = currentUser.uid;
    console.log('Setting up presence for user:', userId, 'in move:', moveId);
    
    // Update the current move ID
    currentMoveId.current = moveId;
    setIsInitialized(true);
    setError(null);

    const userPresenceRef = doc(firestore, 'presence', `${moveId}_${userId}`);
    const moveRef = doc(firestore, 'moves', moveId);

    const updatePresence = async () => {
      try {
        // Get user profile data
        const userDoc = await getDoc(doc(firestore, 'users', userId));
        const userData = userDoc.data();
        
        // Update presence with user data
        const userStatus: PresenceState = {
          userId,
          moveId,
          displayName: userData?.displayName || currentUser?.displayName || 'Anonymous',
          photoURL: userData?.photoURL || currentUser?.photoURL || '',
          online: true,
          lastSeen: serverTimestamp(),
        };

        // Set user's online status with complete data
        await setDoc(userPresenceRef, userStatus, { merge: true });
        
        // Add user to the move's participants if not already present
        try {
          const moveDoc = await getDoc(moveRef);
          if (moveDoc.exists()) {
            const moveData = moveDoc.data();
            const participants = moveData.participants || {};
            if (!(userId in participants)) {
              const updateData = {
                participants: {
                  ...participants,
                  [userId]: true
                },
                updatedAt: serverTimestamp()
              };
              await updateDoc(moveRef, updateData);
            }
          }
        } catch (moveErr) {
          console.error('Error updating move participants:', moveErr);
          // Don't fail the entire presence update if this fails
        }
        
        setMyStatus(userStatus);
        setIsOnline(true);
      } catch (err: any) {
        console.error('Error updating presence:', err);
        setError(err);
        toast.error('Failed to update presence: ' + (err.message || 'Unknown error'));
      }
    };

    // Set up Firestore listener for all presence data in this move
    const presenceQuery = query(
      collection(firestore, 'presence'),
      where('moveId', '==', moveId)
    );

    // Store the unsubscribe function
    const unsubscribe = onSnapshot(
      presenceQuery, 
      (snapshot: QuerySnapshot<DocumentData>) => {
        try {
          const presenceData: Record<string, PresenceState> = {};
          snapshot.forEach((doc: DocumentSnapshot<DocumentData>) => {
            const data = doc.data();
            if (data) {
              presenceData[doc.id] = data as PresenceState;
            }
          });
          setPresence(presenceData);
        } catch (err) {
          console.error('Error processing presence snapshot:', err);
        }
      },
      (err: FirestoreError) => {
        console.error('Error in presence listener:', err);
        setError(err);
        toast.error('Error in presence updates: ' + (err.message || 'Unknown error'));
      }
    );

    // Store the unsubscribe function
    unsubscribeRef.current = unsubscribe;

    // Set up window unload handler
    const handleBeforeUnload = async () => {
      try {
        await setDoc(userPresenceRef, {
          online: false,
          lastSeen: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.error('Error setting offline status on unload:', err);
      }
    };

    // Initialize presence
    updatePresence();
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup function
    return () => {
      console.log('Cleaning up presence for move:', moveId);
      // Remove event listener
      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      // Set offline status on cleanup if we have a valid move ID and user
      if (currentMoveId.current && auth.currentUser) {
        const cleanupPresenceRef = doc(firestore, 'presence', `${currentMoveId.current}_${auth.currentUser.uid}`);
        setDoc(cleanupPresenceRef, {
          online: false,
          lastSeen: serverTimestamp()
        }, { merge: true }).catch(console.error);
      }
      
      // Unsubscribe from presence updates
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = () => {}; // Reset the ref
      }
      
      // Reset state
      setIsOnline(false);
      setPresence({});
      setMyStatus(null);
      currentMoveId.current = null;
    };
  }, [moveId]);

  const onlineUsers = Object.values(presence).filter((p) => p?.online);

  const onlineCount = onlineUsers.length;

  const isUserOnline = useCallback(
    (userId: string) => {
      return presence[userId]?.online || false;
    },
    [presence]
  );

  return {
    myStatus,
    isOnline,
    presence,
    onlineUsers,
    onlineCount,
    isUserOnline,
    error,
  };
}
