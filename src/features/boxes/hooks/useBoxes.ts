
import React, { useState, useEffect, useCallback, useContext, createContext, ReactNode } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { firestore as db } from '@/main';
import { useMove } from '@/features/settings/hooks/MoveContext';
import { Box, NewBoxData, ItemStatus } from '@/types';
import * as boxService from '@/features/boxes/services/boxService';

/**
 * @interface BoxesContextType
 * @description Defines the shape of the boxes context.
 */
interface BoxesContextType {
  /** An array of boxes for the current move. */
  boxes: Box[];
  /** Whether the boxes are currently being loaded. */
  isLoading: boolean;
  /** An error object if an error occurred while fetching the boxes. */
  error: Error | null;
  /** A function to add a new box. */
  addBox: (boxData: NewBoxData) => Promise<Box>;
  /** A function to get a box by its ID. */
  getBox: (id: string) => Box | undefined;
  /** A function to update a box. */
  updateBox: (boxId: string, updatedData: Partial<Omit<Box, 'id'>>) => Promise<void>;
  /** A function to add a scan entry to a box. */
  addScanEntryToBox: (boxId: string, scanData: { location: string; notes?: string; newStatus: ItemStatus }) => Promise<void>;
  /** A function to delete a box by its ID. */
  deleteBoxById: (boxId: string) => Promise<void>;
  /** A function to add prepped boxes for printing. */
  addPreppedBoxes: (ownerUid: string, count: number) => Promise<Box[]>;
}

const BoxesContext = createContext<BoxesContextType | undefined>(undefined);

/**
 * A component that provides boxes context to its children.
 * @param {object} props - The properties for the BoxesProvider component.
 * @param {ReactNode} props.children - The child components to be rendered within the provider.
 * @returns {JSX.Element} The rendered BoxesProvider component.
 */
export const BoxesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { move } = useMove();
  const moveId = move?.id;
  const [boxes, setBoxes] = useState<Box[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!moveId) {
      setBoxes([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
  }, [moveId]);

  useEffect(() => {
    if (!moveId) return;

    const q = query(
      collection(db, 'moves', moveId, 'boxes'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const boxesData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Box[];
        setBoxes(boxesData);
        setIsLoading(false);
      },
      (error) => {
        console.error('Error fetching boxes:', error);
        setError(error);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [moveId]);

  const getBox = useCallback((id: string): Box | undefined => {
    return boxes.find(box => box.id === id);
  }, [boxes]);

  const addBox = useCallback(async (boxData: NewBoxData): Promise<Box> => {
    if (!moveId) throw new Error('No active move to add a box to.');
    return await boxService.addBox(moveId, boxData);
  }, [moveId]);

  const updateBox = useCallback(async (boxId: string, updatedData: Partial<Omit<Box, 'id'>>) => {
    if (!moveId) throw new Error('No active move to update a box in.');
    await boxService.updateBox(moveId, boxId, updatedData);
  }, [moveId]);

  const addScanEntryToBox = useCallback(async (boxId: string, scanData: { location: string; notes?: string; newStatus: ItemStatus }) => {
    if (!moveId) throw new Error('No active move to add a scan entry to.');
    await boxService.addScanEntryToBox(moveId, boxId, scanData);
  }, [moveId]);

  const deleteBoxById = useCallback(async (boxId: string) => {
    if (!moveId) throw new Error('No active move to delete a box from.');
    await boxService.deleteBox(moveId, boxId);
  }, [moveId]);

  const addPreppedBoxes = useCallback(async (ownerUid: string, count: number): Promise<Box[]> => {
    if (!moveId) throw new Error('No active move to add prepped boxes to.');
    return await boxService.addPreppedBoxesForPrint(moveId, ownerUid, count);
  }, [moveId]);

  const value = {
    boxes,
    isLoading,
    error,
    getBox,
    addBox,
    updateBox,
    addScanEntryToBox,
    deleteBoxById,
    addPreppedBoxes
  };

  return React.createElement(BoxesContext.Provider, { value: value }, children);
};

/**
 * A custom hook that provides access to the boxes context.
 * @returns {BoxesContextType} The boxes context.
 * @throws {Error} If used outside of a BoxesProvider.
 */
export const useBoxes = (): BoxesContextType => {
  const context = useContext(BoxesContext);
  if (context === undefined) {
    throw new Error('useBoxes must be used within a BoxesProvider');
  }
  return context;
};
