import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/main';

export interface Move {
  id: string;
  moveCode: string;
  createdBy: string; // Changed from ownerId to match Firestore rules
  createdAt: Date;
  updatedAt: Date;
  participants: Record<string, boolean>;
  moveDate?: Date; // Optional move date for timeline planning
}

const generateMoveCode = (): string => {
  // Generate a random 6-character alphanumeric code
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export const getUserMoves = async (userId: string): Promise<Move[]> => {
  const movesRef = collection(firestore, 'moves');
  const q = query(movesRef, where(`participants.${userId}`, '==', true));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Move));
};

export const createMove = async (userId: string): Promise<Move> => {
  try {
    // Check if user already has an active move
    const existingMoves = await getUserMoves(userId);
    if (existingMoves.length > 0) {
      throw new Error('You are already part of a move. Please complete or leave your current move before creating a new one.');
    }

    const movesRef = collection(firestore, 'moves');
    const moveCode = generateMoveCode();
    const newMove = {
      moveCode,
      createdBy: userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      participants: { [userId]: true },
    };
    // Debug: verify payload matches Firestore rules expectations
    console.debug('[createMove] payload to create', {
      ...newMove,
      createdAt: '<serverTimestamp>',
      updatedAt: '<serverTimestamp>'
    });

    const moveDoc = await addDoc(movesRef, newMove);
    
    return {
      id: moveDoc.id,
      ...newMove,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  } catch (error: any) {
    console.error('Create move error:', {
      code: error?.code,
      message: error?.message,
      stack: error?.stack
    });
    
    // Handle specific Firebase permission errors
    if (error.code === 'permission-denied') {
      throw new Error('Unable to create move due to permissions. Please try again or contact support.');
    } else if (error.code === 'unavailable') {
      throw new Error('Service temporarily unavailable. Please try again in a moment.');
    } else if (error.message.includes('Missing or insufficient permissions')) {
      throw new Error('Unable to create move at this time. You can try again from your dashboard.');
    }
    
    // Re-throw the original error if it's not a permission issue
    throw error;
  }
};

export const joinMove = async (moveCode: string, userId: string): Promise<Move | null> => {
  try {
    // Check if user already has an active move
    const existingMoves = await getUserMoves(userId);
    if (existingMoves.length > 0) {
      throw new Error('You are already part of a move. Please complete or leave your current move before joining another one.');
    }

    // Find the move by code
    const movesRef = collection(firestore, 'moves');
    const q = query(movesRef, where('moveCode', '==', moveCode));
    const querySnapshot = await getDocs(q);
    console.debug('[joinMove] query by code', moveCode, 'found', querySnapshot.size);
    if (querySnapshot.empty) {
      throw new Error('Invalid move code');
    }
    
    const moveDoc = querySnapshot.docs[0];
    const moveData = moveDoc.data() as Omit<Move, 'id'>;
    
    // Add user to participants if not already a participant
    if (!moveData.participants[userId]) {
      await updateDoc(doc(firestore, 'moves', moveDoc.id), {
        [`participants.${userId}`]: true,
        updatedAt: serverTimestamp(),
      });
    }
    
    // Return the updated move
    const updatedMove = await getMoveById(moveDoc.id);
    return updatedMove;
  } catch (error: any) {
    console.error('Join move error:', {
      code: error?.code,
      message: error?.message,
      stack: error?.stack
    });
    
    // Handle specific Firebase permission errors
    if (error.code === 'permission-denied') {
      throw new Error('Unable to join move due to permissions. Please try again or contact support.');
    } else if (error.code === 'unavailable') {
      throw new Error('Service temporarily unavailable. Please try again in a moment.');
    } else if (error.message.includes('Missing or insufficient permissions')) {
      throw new Error('Unable to join move at this time. You can try again from your dashboard.');
    }
    
    // Re-throw the original error if it's not a permission issue
    throw error;
  }
};

export const getMoveById = async (moveId: string): Promise<Move | null> => {
  const moveDoc = await getDoc(doc(firestore, 'moves', moveId));
  if (!moveDoc.exists()) {
    return null;
  }
  return { id: moveDoc.id, ...moveDoc.data() } as Move;
};

export const getMoveByCode = async (moveCode: string): Promise<Move | null> => {
  const movesRef = collection(firestore, 'moves');
  const q = query(movesRef, where('moveCode', '==', moveCode));
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const moveDoc = querySnapshot.docs[0];
  return { id: moveDoc.id, ...moveDoc.data() } as Move;
};
