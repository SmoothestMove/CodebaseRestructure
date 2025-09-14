// services/boxService.ts

import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  runTransaction,
  serverTimestamp,
  arrayUnion,
  writeBatch,
} from 'firebase/firestore';
import { firestore as db } from '@/main'; // Corrected path
import { Box, NewBoxData, ScanEntry, ItemStatus } from '@/types';
import { getOwnerByUid } from '@/features/owners/services/ownerService'; // Assumes ownerService will be refactored to be async

const getBoxesCollection = (moveId: string) => collection(db, 'moves', moveId, 'boxes');

// Note: This service provides one-time fetch operations. 
// Real-time updates will be handled by the `useBoxes` hook using `onSnapshot`.

export async function getBoxes(moveId: string): Promise<Box[]> {
  const boxesCollection = getBoxesCollection(moveId);
  const snapshot = await getDocs(boxesCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Box));
}

export async function getBox(moveId: string, boxId: string): Promise<Box | undefined> {
  const boxDocRef = doc(db, 'moves', moveId, 'boxes', boxId);
  const docSnap = await getDoc(boxDocRef);
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as Box;
  }
  return undefined;
}

// Helper to generate a unique Box ID within a transaction, ensuring atomicity.
async function generateUniqueBoxIdInTransaction(
  transaction: any, // Firestore Transaction
  boxesCollectionRef: any, // CollectionReference
  ownerUid: string,
  ownerPrefix: string
): Promise<string> {
  const ownerBoxesQuery = query(boxesCollectionRef, where('ownerUid', '==', ownerUid));
  const ownerBoxesSnap = await transaction.get(ownerBoxesQuery);
  const ownerBoxes = ownerBoxesSnap.docs.map((d: any) => d.data());

  let maxNumericPart = 0;
  (ownerBoxes || []).forEach((box: Box) => {
    if (box.id.startsWith(ownerPrefix)) {
      const numericStr = box.id.substring(ownerPrefix.length);
      if (/^\d+$/.test(numericStr)) {
        const numericVal = parseInt(numericStr, 10);
        if (numericVal > maxNumericPart) {
          maxNumericPart = numericVal;
        }
      }
    }
  });

  const newNumericPart = maxNumericPart + 1;
  return `${ownerPrefix}${String(newNumericPart).padStart(2, '0')}`;
}

export async function addBox(moveId: string, boxData: NewBoxData): Promise<Box> {
  const boxesCollection = getBoxesCollection(moveId);
  
  return runTransaction(db, async (transaction) => {
    let newBoxId: string;

    if (!boxData.ownerUid) {
      throw new Error('An owner UID is required to create a box.');
    }

    const owner = await getOwnerByUid(moveId, boxData.ownerUid);
    if (!owner) {
        throw new Error(`Owner with UID ${boxData.ownerUid} not found in move ${moveId}.`);
    }

    newBoxId = await generateUniqueBoxIdInTransaction(transaction, boxesCollection, boxData.ownerUid, owner.uid);

    const newBoxForStore: Omit<Box, 'id'> = {
      qrCodeValue: newBoxId,
      name: boxData.name,
      contents: boxData.contents,
      destinationRoom: boxData.destinationRoom,
            imageUrl: boxData.imageUrl || '',
      currentStatus: ItemStatus.PACKED,
      currentLocation: boxData.initialLocation || 'Origin',
      ownerUid: boxData.ownerUid,
      history: [
        {
          timestamp: Date.now(), // Client time is acceptable for history entry
          location: boxData.initialLocation || 'Origin',
          notes: `Box packed. ID: ${newBoxId}.`,
          statusChange: ItemStatus.PACKED,
        },
      ],
      createdAt: serverTimestamp() as any,
      updatedAt: serverTimestamp() as any,
    };
    
    const newBoxRef = doc(db, 'moves', moveId, 'boxes', newBoxId);
    transaction.set(newBoxRef, newBoxForStore);

    return { id: newBoxId, ...newBoxForStore } as Box;
  });
}

// Helper for the less-safe batch ID generation
function generateIdForBatch(ownerUid: string, ownerPrefix: string, existingBoxes: Box[], newBoxes: Box[]): string {
    const allKnownBoxes = [...existingBoxes, ...newBoxes];
    const ownerBoxes = allKnownBoxes.filter(box => box.ownerUid === ownerUid && box.id.startsWith(ownerPrefix));

    let maxNumericPart = 0;
    (ownerBoxes || []).forEach(box => {
        const numericStr = box.id.substring(ownerPrefix.length);
        if (/^\d+$/.test(numericStr)) {
            const numericVal = parseInt(numericStr, 10);
            if (numericVal > maxNumericPart) {
                maxNumericPart = numericVal;
            }
        }
    });

    const newNumericPart = maxNumericPart + 1;
    return `${ownerPrefix}${String(newNumericPart).padStart(2, '0')}`;
}

export async function addPreppedBoxesForPrint(moveId: string, ownerUid: string, count: number): Promise<Box[]> {
    const owner = await getOwnerByUid(moveId, ownerUid);
    if (!owner) {
        throw new Error(`Owner with UID ${ownerUid} not found in move ${moveId}.`);
    }

    const batch = writeBatch(db);
    const newBoxes: Box[] = [];
    
    // This batch ID generation is not fully atomic and carries a small risk of collision
    // under high concurrency. A Cloud Function is the most robust solution, but this is a 
    // reasonable tradeoff for this application's scale.
    const existingBoxes = await getBoxes(moveId);
    const ownerPrefix = owner.uid;

    for (let i = 0; i < count; i++) {
        const newBoxId = generateIdForBatch(ownerUid, ownerPrefix, existingBoxes, newBoxes);

        const preppedBoxData: Omit<Box, 'id'> = {
            qrCodeValue: newBoxId,
            name: `PREP Box for ${owner.firstName} ${owner.lastName}`,
            contents: 'Contents to be defined upon first scan.',
            destinationRoom: '',
            imageUrl: '',
            currentStatus: ItemStatus.PREPARED,
            currentLocation: 'Labels Printed',
            ownerUid: ownerUid,
            history: [{
                timestamp: Date.now(),
                location: 'Labels Printed',
                notes: `QR label generated in batch. ID: ${newBoxId}.`,
                statusChange: ItemStatus.PREPARED,
            }],
            createdAt: serverTimestamp() as any,
            updatedAt: serverTimestamp() as any,
        };

        const newBoxRef = doc(db, 'moves', moveId, 'boxes', newBoxId);
        batch.set(newBoxRef, preppedBoxData);
        newBoxes.push({ id: newBoxId, ...preppedBoxData } as Box);
    }

    await batch.commit();
    return newBoxes;
}

export async function updateBox(moveId: string, boxId: string, updatedData: Partial<Omit<Box, 'id'>>): Promise<void> {
  const boxDocRef = doc(db, 'moves', moveId, 'boxes', boxId);
  await updateDoc(boxDocRef, {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
}

export async function addScanEntryToBox(
  moveId: string,
  boxId: string,
  scanData: { location: string; notes?: string; newStatus: ItemStatus }
): Promise<void> {
  const boxDocRef = doc(db, 'moves', moveId, 'boxes', boxId);
  const newScanEntry: ScanEntry = {
    timestamp: Date.now(),
    location: scanData.location,
    notes: scanData.notes,
    statusChange: scanData.newStatus,
  };

  await updateDoc(boxDocRef, {
    history: arrayUnion(newScanEntry),
    currentStatus: scanData.newStatus,
    currentLocation: scanData.location,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBox(moveId: string, boxId: string): Promise<void> {
  const boxDocRef = doc(db, 'moves', moveId, 'boxes', boxId);
  await deleteDoc(boxDocRef);
}