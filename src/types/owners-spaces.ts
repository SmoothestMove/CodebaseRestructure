/**
 * FOUNDATIONAL SEPARATION: Owners vs Spaces
 * 
 * This file establishes the type-level separation between Owners (people) and Spaces (communal rooms)
 * while maintaining backward compatibility with existing code.
 */

// Base interface for common properties
interface BaseEntity {
  uid: string;
  color: string;
  createdAt: number;
}

// SEPARATED TYPES
export interface PersonalOwner extends BaseEntity {
  type: 'person';
  firstName: string;
  lastName: string;
  initials?: string; // Derived from firstName + lastName
}

export interface CommunalSpace extends BaseEntity {
  type: 'space';
  name: string; // Room name (e.g., "Kitchen", "Living Room")
  category?: 'room' | 'storage' | 'utility'; // Optional categorization
}

// Union type for when we need either
export type OwnerOrSpace = PersonalOwner | CommunalSpace;

// Backward compatibility: Legacy Owner interface (DEPRECATED - for migration)
export interface LegacyOwner {
  uid: string;
  firstName: string; // Person's first name OR room name
  lastName: string;  // Person's last name OR "(Communal)"
  color: string;
  createdAt: number;
}

// TYPE GUARDS for runtime identification
export function isPersonalOwner(entity: OwnerOrSpace): entity is PersonalOwner {
  return entity.type === 'person';
}

export function isCommunalSpace(entity: OwnerOrSpace): entity is CommunalSpace {
  return entity.type === 'space';
}

export function isLegacyOwner(entity: any): entity is LegacyOwner {
  return entity && 
         typeof entity.firstName === 'string' && 
         typeof entity.lastName === 'string' && 
         !('type' in entity);
}

// MIGRATION UTILITIES
export function legacyOwnerToModern(legacyOwner: LegacyOwner): OwnerOrSpace {
  if (legacyOwner.lastName.includes('(Communal)')) {
    return {
      type: 'space',
      uid: legacyOwner.uid,
      name: legacyOwner.firstName,
      color: legacyOwner.color,
      createdAt: legacyOwner.createdAt,
      category: 'room' // Default categorization
    } as CommunalSpace;
  } else {
    return {
      type: 'person',
      uid: legacyOwner.uid,
      firstName: legacyOwner.firstName,
      lastName: legacyOwner.lastName,
      color: legacyOwner.color,
      createdAt: legacyOwner.createdAt,
      initials: (legacyOwner.firstName.charAt(0) + legacyOwner.lastName.charAt(0)).toUpperCase()
    } as PersonalOwner;
  }
}

export function modernToLegacyOwner(entity: OwnerOrSpace): LegacyOwner {
  if (isPersonalOwner(entity)) {
    return {
      uid: entity.uid,
      firstName: entity.firstName,
      lastName: entity.lastName,
      color: entity.color,
      createdAt: entity.createdAt
    };
  } else {
    return {
      uid: entity.uid,
      firstName: entity.name,
      lastName: '(Communal)',
      color: entity.color,
      createdAt: entity.createdAt
    };
  }
}

// UTILITY FUNCTIONS
export function getDisplayName(entity: OwnerOrSpace): string {
  if (isPersonalOwner(entity)) {
    return `${entity.firstName} ${entity.lastName}`;
  } else {
    return entity.name;
  }
}

export function getShortName(entity: OwnerOrSpace): string {
  if (isPersonalOwner(entity)) {
    return entity.initials || `${entity.firstName.charAt(0)}${entity.lastName.charAt(0)}`.toUpperCase();
  } else {
    return entity.uid; // Spaces use their UID as short name
  }
}

export function getEntityType(entity: OwnerOrSpace): 'Personal' | 'Communal' {
  return isPersonalOwner(entity) ? 'Personal' : 'Communal';
}

// COLLECTION UTILITIES
export function separateOwnersAndSpaces(entities: OwnerOrSpace[]): {
  owners: PersonalOwner[];
  spaces: CommunalSpace[];
} {
  const owners: PersonalOwner[] = [];
  const spaces: CommunalSpace[] = [];
  
  entities.forEach(entity => {
    if (isPersonalOwner(entity)) {
      owners.push(entity);
    } else {
      spaces.push(entity);
    }
  });
  
  return { owners, spaces };
}

export function combineOwnersAndSpaces(owners: PersonalOwner[], spaces: CommunalSpace[]): OwnerOrSpace[] {
  return [...owners, ...spaces];
}

// BOX ASSIGNMENT UTILITIES
export function canAssignBoxTo(entity: OwnerOrSpace, boxType: 'personal' | 'communal' | 'any' = 'any'): boolean {
  if (boxType === 'any') return true;
  if (boxType === 'personal') return isPersonalOwner(entity);
  if (boxType === 'communal') return isCommunalSpace(entity);
  return false;
}

export function getAssignmentContext(entity: OwnerOrSpace): {
  type: 'person' | 'space';
  displayName: string;
  shortName: string;
  category: string;
} {
  return {
    type: entity.type,
    displayName: getDisplayName(entity),
    shortName: getShortName(entity),
    category: isPersonalOwner(entity) ? 'Personal Owner' : `Communal Space`
  };
}