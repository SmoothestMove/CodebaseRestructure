
import { collection, getDocs, doc, getDoc, updateDoc, deleteDoc, serverTimestamp, runTransaction, query, where } from 'firebase/firestore';
import { firestore as db } from '@/main';
import { Owner, NewOwnerData } from '@/types';
import { PREDEFINED_COMMUNAL_ROOMS } from '@/lib/config/constants';

/**
 * A helper function to get the owners subcollection for a given move.
 * @param {string} moveId - The ID of the move.
 * @returns {import('firebase/firestore').CollectionReference} The owners collection.
 */
const getOwnersCollection = (moveId: string) => collection(db, 'moves', moveId, 'owners');

/**
 * Fetches all personal owners from Firestore and merges them with predefined communal rooms.
 * @param {string} moveId - The ID of the move.
 * @returns {Promise<Owner[]>} A list of owners.
 */
export async function getOwners(moveId: string): Promise<Owner[]> {
  const ownersSnapshot = await getDocs(getOwnersCollection(moveId));
  const personalOwners = ownersSnapshot.docs.map(doc => ({ uid: doc.id, ...doc.data() } as Owner));

  const communalRoomUids = PREDEFINED_COMMUNAL_ROOMS.map(cr => cr.uid);
  const uniquePersonalOwners = personalOwners.filter(po => !communalRoomUids.includes(po.uid));

  return [...uniquePersonalOwners, ...PREDEFINED_COMMUNAL_ROOMS];
}

/**
 * Fetches a single owner by UID, checking predefined rooms first, then Firestore.
 * @param {string} moveId - The ID of the move.
 * @param {string} uid - The UID of the owner.
 * @returns {Promise<Owner | undefined>} The owner, or undefined if not found.
 */
export async function getOwnerByUid(moveId: string, uid: string): Promise<Owner | undefined> {
  const communalRoom = PREDEFINED_COMMUNAL_ROOMS.find(room => room.uid === uid);
  if (communalRoom) return communalRoom;

  const ownerDocRef = doc(db, 'moves', moveId, 'owners', uid);
  const ownerDoc = await getDoc(ownerDocRef);

  return ownerDoc.exists() ? { uid: ownerDoc.id, ...ownerDoc.data() } as Owner : undefined;
}

/**
 * Generates a unique UID within the context of a move, avoiding collisions.
 * @param {string} moveId - The ID of the move.
 * @param {string} firstName - The first name of the owner.
 * @param {string} lastName - The last name of the owner.
 * @returns {Promise<string>} A unique UID.
 */
async function generateUniqueUid(moveId: string, firstName: string, lastName: string): Promise<string> {
  let initials = ((firstName?.[0] || '') + (lastName?.[0] || '')).toUpperCase();
  if (!initials) { 
    initials = (firstName?.[0] || lastName?.[0] || 'X').toUpperCase();
    if (lastName && firstName && firstName.length > 1 && initials === lastName[0].toUpperCase()) {
        initials = (firstName.substring(0,2)).toUpperCase();
    } else if (firstName && firstName.length > 1 && initials === firstName[0].toUpperCase()) {
        initials = (firstName.substring(0,2)).toUpperCase();
    }
  }
  if (initials.length === 1 && firstName && firstName.length > 1) initials = firstName.substring(0,2).toUpperCase();
  if (initials.length === 1 && lastName && lastName.length > 1) initials = lastName.substring(0,2).toUpperCase();
  if (!initials) initials = "NA";

  const ownersCollection = getOwnersCollection(moveId);
  const allReservedUids = PREDEFINED_COMMUNAL_ROOMS.map(r => r.uid);

  let uid = initials;
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    if (allReservedUids.includes(uid)) {
      uid = `${initials}${++counter}`;
      continue;
    }
    const q = query(ownersCollection, where('uid', '==', uid));
    const snapshot = await getDocs(q);
    if (snapshot.empty) {
      isUnique = true;
    } else {
      uid = `${initials}${++counter}`;
    }
  }
  return uid;
}

/**
 * Adds a new personal owner to Firestore within a transaction for safe UID generation.
 * @param {string} moveId - The ID of the move.
 * @param {NewOwnerData} ownerData - The data for the new owner.
 * @returns {Promise<Owner>} The new owner.
 */
export async function addOwner(moveId: string, ownerData: NewOwnerData): Promise<Owner> {
  // First verify the move exists and user has access
  const moveDoc = await getDoc(doc(db, 'moves', moveId));
  if (!moveDoc.exists()) {
    throw new Error('Move not found');
  }

  const newOwnerWithTimestamp = {
    ...ownerData,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    return await runTransaction(db, async (transaction) => {
      // Get the move document to verify user is a participant
      const moveSnapshot = await transaction.get(doc(db, 'moves', moveId));
      if (!moveSnapshot.exists()) {
        throw new Error('Move not found');
      }

      const uid = await generateUniqueUid(moveId, ownerData.firstName, ownerData.lastName);
      const newOwnerRef = doc(db, 'moves', moveId, 'owners', uid);
      
      // Set the new owner document
      transaction.set(newOwnerRef, { ...newOwnerWithTimestamp, uid });
      
      // Return the new owner with timestamps
      return { 
        ...newOwnerWithTimestamp, 
        uid, 
        createdAt: Date.now(), 
        updatedAt: Date.now() 
      } as Owner;
    });
  } catch (error: unknown) {
    console.error('Error adding owner:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to add owner: ${errorMessage}`);
  }
}

/**
 * Updates an existing personal owner in Firestore.
 * @param {string} moveId - The ID of the move.
 * @param {string} uid - The UID of the owner to update.
 * @param {Partial<Omit<Owner, 'uid'>>} updatedData - The data to update.
 * @returns {Promise<void>}
 */
export async function updateOwner(moveId: string, uid: string, updatedData: Partial<Omit<Owner, 'uid'>>): Promise<void> {
  if (PREDEFINED_COMMUNAL_ROOMS.some(room => room.uid === uid)) {
    throw new Error('Communal rooms are predefined and cannot be updated.');
  }
  const ownerDocRef = doc(db, 'moves', moveId, 'owners', uid);
  await updateDoc(ownerDocRef, { ...updatedData, updatedAt: serverTimestamp() });
}

/**
 * Deletes a personal owner from Firestore.
 * @param {string} moveId - The ID of the move.
 * @param {string} uid - The UID of the owner to delete.
 * @returns {Promise<void>}
 */
export async function deleteOwner(moveId: string, uid: string): Promise<void> {
  if (PREDEFINED_COMMUNAL_ROOMS.some(room => room.uid === uid)) {
    console.warn('Attempted to delete a predefined communal room. This action is not allowed.');
    return;
  }
  const ownerDocRef = doc(db, 'moves', moveId, 'owners', uid);
  await deleteDoc(ownerDocRef);
}
