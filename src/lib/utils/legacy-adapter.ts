// @ts-nocheck
import type { Owner } from '@/types';
import type { EnhancedRandomizedData } from './randomization-enhanced';
import { modernToLegacyOwner } from '@/types/owners-spaces';
import type { RandomizedData } from './randomization';

/**
 * Converts enhanced randomized data back to legacy format for backward compatibility
 */
export function convertEnhancedToLegacyRandomized(enhancedData: EnhancedRandomizedData): RandomizedData {
  // Combine personal owners and communal spaces back into legacy Owner format
  const legacyOwners: Owner[] = [
    ...enhancedData.personalOwners.map(owner => modernToLegacyOwner(owner) as Owner),
    ...enhancedData.communalSpaces.map(space => modernToLegacyOwner(space) as Owner)
  ];

  return {
    boxes: enhancedData.boxes,
    budget: enhancedData.budget,
    planner: enhancedData.planner
  };
}
