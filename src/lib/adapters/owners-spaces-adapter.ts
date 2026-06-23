// @ts-nocheck
/**
 * ADAPTER LAYER: Gradual Migration Strategy
 * 
 * This adapter provides a compatibility layer that allows the existing codebase
 * to continue working with the new separated types while enabling gradual migration.
 */

import type { Owner } from '@/types';
import type { 
  OwnerOrSpace, 
  PersonalOwner, 
  CommunalSpace, 
  LegacyOwner
} from '@/types/owners-spaces';
import {
  legacyOwnerToModern,
  modernToLegacyOwner,
  separateOwnersAndSpaces,
  combineOwnersAndSpaces,
  isPersonalOwner,
  isCommunalSpace,
  getDisplayName,
  getShortName,
  getEntityType,
  isCustomCommunalSpace
} from '@/types/owners-spaces';

/**
 * ADAPTER CONTEXT
 * Provides a unified interface for working with owners and spaces
 * while abstracting the underlying separation logic.
 */
export class OwnersSpacesAdapter {
  private entities: OwnerOrSpace[] = [];

  constructor(legacyOwners: Owner[] = []) {
    // Convert legacy owners to modern separated types
    this.entities = legacyOwners.map(owner => 
      legacyOwnerToModern(owner as LegacyOwner)
    );
  }

  // COMPATIBILITY METHODS - Return legacy format for existing code
  toLegacyOwners(): Owner[] {
    return this.entities.map(entity => 
      modernToLegacyOwner(entity) as Owner
    );
  }

  // NEW SEPARATED METHODS - Use these for new development
  getOwners(): PersonalOwner[] {
    return this.entities.filter(isPersonalOwner);
  }

  getSpaces(): CommunalSpace[] {
    return this.entities.filter(isCommunalSpace);
  }

  getPredefinedSpaces(): CommunalSpace[] {
    return this.entities.filter(entity => isCommunalSpace(entity) && !isCustomCommunalSpace(entity));
  }

  getCustomSpaces(): CommunalSpace[] {
    return this.entities.filter(entity => isCustomCommunalSpace(entity));
  }

  getAllEntities(): OwnerOrSpace[] {
    return [...this.entities];
  }

  // UTILITY METHODS
  findById(uid: string): OwnerOrSpace | undefined {
    return this.entities.find(entity => entity.uid === uid);
  }

  findOwnerById(uid: string): PersonalOwner | undefined {
    const entity = this.findById(uid);
    return entity && isPersonalOwner(entity) ? entity : undefined;
  }

  findSpaceById(uid: string): CommunalSpace | undefined {
    const entity = this.findById(uid);
    return entity && isCommunalSpace(entity) ? entity : undefined;
  }

  addOwner(owner: PersonalOwner): void {
    this.entities.push(owner);
  }

  addSpace(space: CommunalSpace): void {
    this.entities.push(space);
  }

  removeById(uid: string): boolean {
    const index = this.entities.findIndex(entity => entity.uid === uid);
    if (index >= 0) {
      this.entities.splice(index, 1);
      return true;
    }
    return false;
  }

  // DISPLAY UTILITIES
  getDisplayName(uid: string): string {
    const entity = this.findById(uid);
    return entity ? getDisplayName(entity) : 'Unknown';
  }

  getShortName(uid: string): string {
    const entity = this.findById(uid);
    return entity ? getShortName(entity) : uid;
  }

  getEntityType(uid: string): 'Personal' | 'Communal' | 'Unknown' {
    const entity = this.findById(uid);
    return entity ? getEntityType(entity) : 'Unknown';
  }

  isOwner(uid: string): boolean {
    const entity = this.findById(uid);
    return entity ? isPersonalOwner(entity) : false;
  }

  isSpace(uid: string): boolean {
    const entity = this.findById(uid);
    return entity ? isCommunalSpace(entity) : false;
  }

  // FILTERING UTILITIES
  getPersonalBoxes(boxes: Array<{ ownerUid?: string }>): Array<{ ownerUid?: string }> {
    return boxes.filter(box => {
      if (!box.ownerUid) return false;
      return this.isOwner(box.ownerUid);
    });
  }

  getCommunalBoxes(boxes: Array<{ ownerUid?: string }>): Array<{ ownerUid?: string }> {
    return boxes.filter(box => {
      if (!box.ownerUid) return false;
      return this.isSpace(box.ownerUid);
    });
  }

  // STATISTICS
  getStats() {
    const { owners, spaces } = separateOwnersAndSpaces(this.entities);
    const customSpaces = spaces.filter(space => isCustomCommunalSpace(space));
    const predefinedSpaces = spaces.length - customSpaces.length;
    const total = this.entities.length || 1;

    return {
      totalEntities: this.entities.length,
      personalOwners: owners.length,
      communalSpaces: spaces.length,
      predefinedSpaces,
      customSpaces: customSpaces.length,
      ownerPercentage: (owners.length / total) * 100,
      spacePercentage: (spaces.length / total) * 100,
      customSpacePercentage: (customSpaces.length / total) * 100
    };
  }

  // MIGRATION HELPER - Gradually replace legacy patterns
  replaceFilter(
    filterFn: (owner: Owner) => boolean,
    legacyOwners: Owner[]
  ): {
    matchingOwners: PersonalOwner[];
    matchingSpaces: CommunalSpace[];
    legacyMatches: Owner[];
  } {
    const legacyMatches = legacyOwners.filter(filterFn);
    const modernEntities = legacyMatches.map(owner => 
      legacyOwnerToModern(owner as LegacyOwner)
    );
    
    const { owners, spaces } = separateOwnersAndSpaces(modernEntities);
    
    return {
      matchingOwners: owners,
      matchingSpaces: spaces,
      legacyMatches
    };
  }
}

/**
 * FACTORY FUNCTIONS for common use cases
 */
export function createAdapterFromLegacy(legacyOwners: Owner[]): OwnersSpacesAdapter {
  return new OwnersSpacesAdapter(legacyOwners);
}

export function createEmptyAdapter(): OwnersSpacesAdapter {
  return new OwnersSpacesAdapter([]);
}

/**
 * HOOK REPLACEMENT UTILITY
 * Provides a drop-in replacement pattern for existing hooks
 */
export function useOwnersSpacesSeparation(legacyOwners: Owner[]) {
  const adapter = createAdapterFromLegacy(legacyOwners);
  
  return {
    // Legacy compatibility
    owners: adapter.toLegacyOwners(),
    
    // New separated data
    personalOwners: adapter.getOwners(),
    communalSpaces: adapter.getSpaces(),
    
    // Utility functions
    adapter,
    getDisplayName: (uid: string) => adapter.getDisplayName(uid),
    getEntityType: (uid: string) => adapter.getEntityType(uid),
    isOwner: (uid: string) => adapter.isOwner(uid),
    isSpace: (uid: string) => adapter.isSpace(uid),
    
    // Statistics
    stats: adapter.getStats()
  };
}




