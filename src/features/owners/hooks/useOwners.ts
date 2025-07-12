
import React, { useState, useEffect, useCallback, useContext, createContext, ReactNode } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { firestore as db } from '../index';
import { useMove } from '../contexts/MoveContext';
import { Owner, NewOwnerData } from '../types';
import * as ownerService from '../services/ownerService';
import { PREDEFINED_COMMUNAL_ROOMS } from '../constants';

interface OwnersContextType {
  owners: Owner[];
  isLoading: boolean;
  error: Error | null;
  addOwner: (ownerData: NewOwnerData) => Promise<Owner>;
  getOwnerByUid: (uid: string) => Owner | undefined;
  updateOwner: (uid: string, updatedData: Partial<Omit<Owner, 'uid'>>) => Promise<void>;
  deleteOwnerByUid: (uid: string) => Promise<void>;
}

const OwnersContext = createContext<OwnersContextType | undefined>(undefined);

export const OwnersProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { move } = useMove();
  const moveId = move?.id;
  const [owners, setOwners] = useState<Owner[]>(PREDEFINED_COMMUNAL_ROOMS);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!moveId) {
      setOwners(PREDEFINED_COMMUNAL_ROOMS);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const ownersCollection = collection(db, 'moves', moveId, 'owners');
    const ownersQuery = query(ownersCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      ownersQuery,
      (snapshot) => {
        const personalOwners = snapshot.docs.map(doc => ({ ...doc.data(), uid: doc.id } as Owner));
        const communalRoomUids = PREDEFINED_COMMUNAL_ROOMS.map(cr => cr.uid);
        const uniquePersonalOwners = personalOwners.filter(po => !communalRoomUids.includes(po.uid));
        setOwners([...uniquePersonalOwners, ...PREDEFINED_COMMUNAL_ROOMS]);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching owners:", err);
        setError(err);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [moveId]);

  const getOwnerByUid = useCallback((uid: string): Owner | undefined => {
    return owners.find(owner => owner.uid === uid);
  }, [owners]);

  const addOwner = useCallback(async (ownerData: NewOwnerData): Promise<Owner> => {
    if (!moveId) throw new Error('No active move to add an owner to.');
    return await ownerService.addOwner(moveId, ownerData);
  }, [moveId]);

  const updateOwner = useCallback(async (uid: string, updatedData: Partial<Omit<Owner, 'uid'>>) => {
    if (!moveId) throw new Error('No active move to update an owner in.');
    await ownerService.updateOwner(moveId, uid, updatedData);
  }, [moveId]);

  const deleteOwnerByUid = useCallback(async (uid: string) => {
    if (!moveId) throw new Error('No active move to delete an owner from.');
    await ownerService.deleteOwner(moveId, uid);
  }, [moveId]);

  const value = {
    owners,
    isLoading,
    error,
    getOwnerByUid,
    addOwner,
    updateOwner,
    deleteOwnerByUid,
  };

  return React.createElement(OwnersContext.Provider, { value: value }, children);
};

export const useOwners = (): OwnersContextType => {
  const context = useContext(OwnersContext);
  if (context === undefined) {
    throw new Error('useOwners must be used within an OwnersProvider');
  }
  return context;
};
