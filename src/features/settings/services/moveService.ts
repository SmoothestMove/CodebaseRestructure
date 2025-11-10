import { collection, doc, getDoc, getDocs, query, where, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/main';

/**
 * @interface Move
 * @property {string} id - The ID of the move.
 * @property {string} moveCode - The code for the move.
 * @property {string} createdBy - The ID of the user who created the move.
 * @property {Date} createdAt - The timestamp of when the move was created.
 * @property {Date} updatedAt - The timestamp of when the move was last updated.
 * @property {Record<string, boolean>} participants - A map of participant IDs.
 * @property {Date} [moveDate] - The date of the move.
 */
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

/**
 * Gets all moves for a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Move[]>} A list of moves.
 */
export const getUserMoves = async (userId: string): Promise<Move[]> => {
  const movesRef = collection(firestore, 'moves');
  const q = query(movesRef, where(`participants.${userId}`, '==', true));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
  } as Move));
};

/**
 * Creates a new move.
 * @param {string} userId - The ID of the user creating the move.
 * @returns {Promise<Move>} The new move.
 */
export const createMove = async (userId: string): Promise<Move> => {
  // Check if user already has an active move
  const existingMoves = await getUserMoves(userId);
  if (existingMoves.length > 0) {
    throw new Error('You are already part of a move. Please complete or leave your current move before creating a new one.');
  }

  const movesRef = collection(firestore, 'moves');
  const moveCode = generateMoveCode();
  const newMove = {
    moveCode,
    createdBy: userId, // Changed from ownerId to match Firestore rules
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    participants: { [userId]: true },
  };
  
  const moveDoc = await addDoc(movesRef, newMove);
  
  return {
    id: moveDoc.id,
    ...newMove,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

/**
 * Joins a move.
 * @param {string} moveCode - The code for the move to join.
 * @param {string} userId - The ID of the user joining the move.
 * @returns {Promise<Move | null>} The joined move, or null if it failed.
 */
export const joinMove = async (moveCode: string, userId: string): Promise<Move | null> => {
  // Check if user already has an active move
  const existingMoves = await getUserMoves(userId);
  if (existingMoves.length > 0) {
    throw new Error('You are already part of a move. Please complete or leave your current move before joining another one.');
  }

  // Find the move by code
  const movesRef = collection(firestore, 'moves');
  const q = query(movesRef, where('moveCode', '==', moveCode));
  const querySnapshot = await getDocs(q);
  
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
};

/**
 * Gets a move by its ID.
 * @param {string} moveId - The ID of the move.
 * @returns {Promise<Move | null>} The move, or null if not found.
 */
export const getMoveById = async (moveId: string): Promise<Move | null> => {
  const moveDoc = await getDoc(doc(firestore, 'moves', moveId));
  if (!moveDoc.exists()) {
    return null;
  }
  return { id: moveDoc.id, ...moveDoc.data() } as Move;
};

/**
 * Gets a move by its code.
 * @param {string} moveCode - The code of the move.
 * @returns {Promise<Move | null>} The move, or null if not found.
 */
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
