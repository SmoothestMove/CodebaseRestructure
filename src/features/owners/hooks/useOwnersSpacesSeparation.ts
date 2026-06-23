import { useMemo } from 'react';
import { useOwners } from './useOwners';
import { createAdapterFromLegacy } from '@/lib/adapters/owners-spaces-adapter';
import type { PersonalOwner, CommunalSpace } from '@/types';

/**
 * Enhanced hook that provides clear separation between Personal Owners and Communal Spaces
 * while maintaining backward compatibility with existing useOwners hook.
 */
export function useOwnersSpacesSeparation() {
  const { owners: legacyOwners, isLoading, error, addOwner, getOwnerByUid, updateOwner, deleteOwnerByUid } = useOwners();

  const separatedData = useMemo(() => {
    const adapter = createAdapterFromLegacy(legacyOwners);
    
    return {
      // Legacy compatibility
      owners: legacyOwners,
      
      // New separated data
      personalOwners: adapter.getOwners(),
      communalSpaces: adapter.getSpaces(),
      predefinedSpaces: adapter.getPredefinedSpaces(),
      customSpaces: adapter.getCustomSpaces(),
      
      // Utility functions
      adapter,
      getDisplayName: (uid: string) => adapter.getDisplayName(uid),
      getEntityType: (uid: string) => adapter.getEntityType(uid),
      isOwner: (uid: string) => adapter.isOwner(uid),
      isSpace: (uid: string) => adapter.isSpace(uid),
      
      // Enhanced getters
      getPersonalOwnerById: (uid: string) => adapter.findOwnerById(uid),
      getCommunalSpaceById: (uid: string) => adapter.findSpaceById(uid),
      getEntityById: (uid: string) => adapter.findById(uid),
      
      // Statistics
      stats: adapter.getStats()
    };
  }, [legacyOwners]);

  return {
    ...separatedData,
    isLoading,
    error,
    addOwner,
    getOwnerByUid,
    updateOwner,
    deleteOwnerByUid
  };
}

/**
 * Simpler hook that just returns the separated arrays
 */
export function usePersonalOwnersAndSpaces(): {
  personalOwners: PersonalOwner[];
  communalSpaces: CommunalSpace[];
  isLoading: boolean;
} {
  const { personalOwners, communalSpaces, isLoading } = useOwnersSpacesSeparation();
  
  return {
    personalOwners,
    communalSpaces,
    isLoading
  };
}
