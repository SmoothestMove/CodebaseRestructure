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
  category?: 'room' | 'storage' | 'utility' | 'custom'; // Optional categorization
}

// Union type for when we need either
export type OwnerOrSpace = PersonalOwner | CommunalSpace;

// Backward compatibility: Legacy Owner interface (DEPRECATED - for migration)
export interface LegacyOwner {
  uid: string;
  firstName: string; // Person's first name OR room name
  lastName: string;  // Person's last name OR "(Communal)" / "(Custom Space)"
  color: string;
  createdAt: number;
}

const COMMUNAL_LAST_NAME_FLAG = '(Communal)';
const CUSTOM_SPACE_LAST_NAME_FLAG = '(Custom Space)';
const NORMALIZED_COMMUNAL_FLAG = COMMUNAL_LAST_NAME_FLAG.toLowerCase();
const NORMALIZED_CUSTOM_FLAG = CUSTOM_SPACE_LAST_NAME_FLAG.toLowerCase();

const normalize = (value: string | undefined | null): string => (value || '').toLowerCase();

const legacyRepresentsSpace = (legacyOwner: LegacyOwner): boolean => {
  const lastName = normalize(legacyOwner.lastName);
  return lastName.includes(NORMALIZED_COMMUNAL_FLAG) || lastName.includes(NORMALIZED_CUSTOM_FLAG);
};

const resolveSpaceCategory = (legacyOwner: LegacyOwner): CommunalSpace['category'] => {
  const lastName = normalize(legacyOwner.lastName);
  if (lastName.includes(NORMALIZED_CUSTOM_FLAG)) {
    return 'custom';
  }
  return 'room';
};

const buildInitials = (first: string, last: string): string => {
  const firstInitial = first?.trim().charAt(0) ?? '';
  const lastInitial = last?.trim().charAt(0) ?? '';
  return `${firstInitial}${lastInitial}`.toUpperCase();
};

// TYPE GUARDS for runtime identification
export function isPersonalOwner(entity: OwnerOrSpace): entity is PersonalOwner {
  return entity.type === 'person';
}

export function isCommunalSpace(entity: OwnerOrSpace): entity is CommunalSpace {
  return entity.type === 'space';
}

export function isCustomCommunalSpace(entity: OwnerOrSpace): entity is CommunalSpace {
  return isCommunalSpace(entity) && entity.category === 'custom';
}

export function isLegacyOwner(entity: any): entity is LegacyOwner {
  return entity && 
         typeof entity.firstName === 'string' && 
         typeof entity.lastName === 'string' && 
         !('type' in entity);
}

// MIGRATION UTILITIES
export function legacyOwnerToModern(legacyOwner: LegacyOwner): OwnerOrSpace {
  if (legacyRepresentsSpace(legacyOwner)) {
    return {
      type: 'space',
      uid: legacyOwner.uid,
      name: legacyOwner.firstName,
      color: legacyOwner.color,
      createdAt: legacyOwner.createdAt,
      category: resolveSpaceCategory(legacyOwner)
    } as CommunalSpace;
  }

  return {
    type: 'person',
    uid: legacyOwner.uid,
    firstName: legacyOwner.firstName,
    lastName: legacyOwner.lastName,
    color: legacyOwner.color,
    createdAt: legacyOwner.createdAt,
    initials: buildInitials(legacyOwner.firstName, legacyOwner.lastName)
  } as PersonalOwner;
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
  }

  const category = entity.category === 'custom' ? CUSTOM_SPACE_LAST_NAME_FLAG : COMMUNAL_LAST_NAME_FLAG;

  return {
    uid: entity.uid,
    firstName: entity.name,
    lastName: category,
    color: entity.color,
    createdAt: entity.createdAt
  };
}

// UTILITY FUNCTIONS
export function getDisplayName(entity: OwnerOrSpace): string {
  if (isPersonalOwner(entity)) {
    return `${entity.firstName} ${entity.lastName}`.trim();
  }
  return entity.name;
}

export function getShortName(entity: OwnerOrSpace): string {
  if (isPersonalOwner(entity)) {
    return entity.initials || buildInitials(entity.firstName, entity.lastName);
  }
  return entity.uid; // Spaces use their UID as short name
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
  if (isPersonalOwner(entity)) {
    return {
      type: 'person',
      displayName: getDisplayName(entity),
      shortName: getShortName(entity),
      category: 'Personal Owner'
    };
  }

  const categoryLabel = entity.category === 'custom' ? 'Custom Space' : 'Communal Space';

  return {
    type: 'space',
    displayName: getDisplayName(entity),
    shortName: getShortName(entity),
    category: categoryLabel
  };
}
