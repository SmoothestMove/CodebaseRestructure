
import React, { useState, useEffect, useCallback, useContext, createContext, ReactNode } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { firestore as db } from '../index';
import { useMove } from '../contexts/MoveContext';
import { Box, NewBoxData, ItemStatus } from '../types';
import * as boxService from '../services/boxService';

interface BoxesContextType {
  boxes: Box[];
  isLoading: boolean;
  error: Error | null;
  addBox: (boxData: NewBoxData) => Promise<Box>;
  getBox: (id: string) => Box | undefined;
  updateBox: (boxId: string, updatedData: Partial<Omit<Box, 'id'>>) => Promise<void>;
  addScanEntryToBox: (boxId: string, scanData: { location: string; notes?: string; newStatus: ItemStatus }) => Promise<void>;
  deleteBoxById: (boxId: string) => Promise<void>;
  addPreppedBoxes: (ownerUid: string, count: number) => Promise<Box[]>;
}

const BoxesContext = createContext<BoxesContextType | undefined>(undefined);

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

export const useBoxes = (): BoxesContextType => {
  const context = useContext(BoxesContext);
  if (context === undefined) {
    throw new Error('useBoxes must be used within a BoxesProvider');
  }
  return context;
};
