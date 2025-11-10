import { useEffect, useState, useCallback } from 'react';
import { doc, onSnapshot, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/main';
import { Move } from '@/features/settings/services/moveService';

type MoveUpdate = Partial<Omit<Move, 'id' | 'createdAt' | 'updatedAt'>>;

/**
 * A custom hook for real-time move instance synchronization.
 * @param {string | null} moveId - The ID of the move to sync.
 * @returns {object} The current move state and functions to update it.
 */
export function useMoveSync(moveId: string | null) {
  const [move, setMove] = useState<Move | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Subscribe to move updates
  useEffect(() => {
    if (!moveId) {
      setLoading(false);
      return () => {};
    }

    setLoading(true);
    const moveRef = doc(firestore, 'moves', moveId);
    
    const unsubscribe = onSnapshot(
      moveRef,
      (doc) => {
        if (doc.exists()) {
          setMove({ id: doc.id, ...doc.data() } as Move);
        } else {
          setMove(null);
          setError(new Error('Move not found'));
        }
        setLoading(false);
      },
      (err) => {
        console.error('Error listening to move updates:', err);
        setError(err);
        setLoading(false);
      }
    );

    // Clean up the listener on unmount
    return () => unsubscribe();
  }, [moveId]);

  /**
   * Updates the move with new data.
   * @param {MoveUpdate} updates - The data to update.
   * @returns {Promise<void>}
   */
  const updateMove = useCallback(async (updates: MoveUpdate) => {
    if (!moveId) {
      throw new Error('No move ID provided');
    }

    try {
      const moveRef = doc(firestore, 'moves', moveId);
      await updateDoc(moveRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error('Error updating move:', err);
      throw err;
    }
  }, [moveId]);

  /**
   * Adds a participant to the move.
   * @param {string} userId - The ID of the user to add.
   * @returns {Promise<void>}
   */
  const addParticipant = useCallback(async (userId: string) => {
    if (!moveId) { return; }
    
    const moveRef = doc(firestore, 'moves', moveId);
    const currentParticipants = move?.participants || {};
    
    // Only update if the user isn't already a participant
    if (!(userId in currentParticipants)) {
      await updateDoc(moveRef, {
        [`participants.${userId}`]: true,
        updatedAt: serverTimestamp(),
      });
    }
  }, [move, moveId]);

  /**
   * Removes a participant from the move.
   * @param {string} userId - The ID of the user to remove.
   * @returns {Promise<void>}
   */
  const removeParticipant = useCallback(async (userId: string) => {
    if (!moveId || !move?.participants) { return; }
    
    const moveRef = doc(firestore, 'moves', moveId);
    const updatedParticipants = { ...move.participants };
    
    // Only update if the user is actually a participant
    if (userId in updatedParticipants) {
      delete updatedParticipants[userId];
      await updateDoc(moveRef, {
        participants: updatedParticipants,
        updatedAt: serverTimestamp(),
      });
    }
  }, [move, moveId]);

  return {
    move,
    loading,
    error,
    updateMove,
    addParticipant,
    removeParticipant,
  };
}
