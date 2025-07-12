import React, { createContext, useContext, ReactNode, useCallback } from 'react';

import { useMoveSync } from '../hooks/useMoveSync';
import { useMovePresence, PresenceState } from '../hooks/useMovePresence';
import { Move } from '../services/moveService';

interface MoveContextType {
  move: Move | null;
  loading: boolean;
  error: Error | null;
  presence: Record<string, PresenceState> | null;
  updateMove: (data: Partial<Omit<Move, 'id' | 'createdAt' | 'updatedAt'>>) => Promise<void>;
  addParticipant: (userId: string) => Promise<void>;
  removeParticipant: (userId: string) => Promise<void>;
}

const MoveContext = createContext<MoveContextType | undefined>(undefined);

type MoveProviderProps = {
  children: ReactNode;
  moveId: string | null;
};

export const MoveProvider: React.FC<MoveProviderProps> = ({ children, moveId }) => {
  console.group('MoveProvider');
  console.log('moveId:', moveId);
  
  // Only initialize move sync and presence when we have a valid moveId
  const { 
    move, 
    loading, 
    error: syncError, 
    updateMove, 
    addParticipant, 
    removeParticipant 
  } = useMoveSync(moveId || '');
  
  const { 
    presence, 
    error: presenceError 
  } = useMovePresence(moveId || null);

  // Only include presence data if we have a valid moveId
  const safePresence = moveId ? presence : null;
  const error = syncError || presenceError;
  
  // If moveId is not available, return a minimal context
  if (!moveId) {
    console.log('No moveId provided, using minimal context');
    console.groupEnd();
    
    return (
      <MoveContext.Provider
        value={{
          move: null,
          loading: false,
          error: null,
          presence: null,
          updateMove: async () => { 
            console.warn('Attempted to update move without a moveId');
            throw new Error('No move ID available'); 
          },
          addParticipant: async () => { 
            console.warn('Attempted to add participant without a moveId');
            throw new Error('No move ID available'); 
          },
          removeParticipant: async () => { 
            console.warn('Attempted to remove participant without a moveId');
            throw new Error('No move ID available'); 
          },
        }}
      >
        {children}
      </MoveContext.Provider>
    );
  }
  
  console.log('MoveProvider initialized with moveId:', moveId);
  console.groupEnd();

  const safeUpdateMove = useCallback(async (updates: Parameters<typeof updateMove>[0]) => {
    if (!moveId) {
      throw new Error('No move ID provided');
    }
    return updateMove(updates);
  }, [moveId, updateMove]);

  const safeAddParticipant = useCallback(async (userId: string) => {
    if (!moveId) {
      throw new Error('No move ID provided');
    }
    return addParticipant(userId);
  }, [moveId, addParticipant]);

  const safeRemoveParticipant = useCallback(async (userId: string) => {
    if (!moveId) {
      throw new Error('No move ID provided');
    }
    return removeParticipant(userId);
  }, [moveId, removeParticipant]);

  const contextValue = {
    move,
    loading,
    error,
    presence: safePresence,
    updateMove: safeUpdateMove,
    addParticipant: safeAddParticipant,
    removeParticipant: safeRemoveParticipant,
  };

  return (
    <MoveContext.Provider value={contextValue}>
      {children}
    </MoveContext.Provider>
  );
};

export const useMove = (): MoveContextType => {
  const context = useContext(MoveContext);
  if (context === undefined) {
    throw new Error('useMove must be used within a MoveProvider');
  }
  return context;
};
