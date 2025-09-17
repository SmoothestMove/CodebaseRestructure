
export enum ItemStatus {
  PREPARED = 'Prepared', // Box identified, label printed, ready for packing contents
  PACKED = 'Packed', // Box filled with contents, sealed, QR label applied
  LOADED = 'Loaded', // Box loaded onto moving truck/vehicle
  UNLOADED = 'Unloaded', // Box unloaded at new destination (e.g., garage, entryway)
  DELIVERED = 'Delivered', // Box delivered to intended room/area in new home
  UNPACKED = 'Unpacked', // Box unpacked, contents put away
  UNKNOWN = 'Unknown',
}

export interface ScanEntry {
  timestamp: number;
  location: string;
  notes?: string;
  statusChange?: ItemStatus; // Box's new status after this scan
}

export interface Owner {
  uid: string; // Initials, e.g., JD, JD2, or communal room ID like KTCHN
  firstName: string; // Or Room Name for communal
  lastName: string; // Or "(Communal)" or similar for type distinction
  color: string; // Hex color code
  createdAt: number;
}

// NEW: Enhanced separation types - re-export from owners-spaces module
export type { 
  PersonalOwner, 
  CommunalSpace, 
  OwnerOrSpace,
  LegacyOwner
} from './owners-spaces';

export {
  isPersonalOwner,
  isCommunalSpace,
  isCustomCommunalSpace,
  isLegacyOwner,
  legacyOwnerToModern,
  modernToLegacyOwner,
  getDisplayName,
  getShortName,
  getEntityType,
  separateOwnersAndSpaces,
  combineOwnersAndSpaces
} from './owners-spaces';

export type NewOwnerData = Omit<Owner, 'uid' | 'createdAt'>;

export type VerticalPosition = 'Bottom' | 'Middle' | 'Top';

export const TRUCK_ZONES = [
  "Cab", "Overhead",
  "Front Left", "Front Center", "Front Right",
  "Middle Left", "Middle Center", "Middle Right",
  "Back Left", "Back Center", "Back Right"
] as const;

export type TruckZone = typeof TRUCK_ZONES[number];


export interface Box { // Renamed from Item
  id: string; // Will be the QR code value, e.g., OwnerUID01, OwnerUID02
  name: string; // Name of the box, e.g., "Kitchen Box #1", "Living Room Books"
  contents?: string; // Formerly description, textual list of what's inside the box
  qrCodeValue: string; // Same as id
  currentStatus: ItemStatus;
  currentLocation?: string; // Current physical location of the box
  destinationRoom?: string; // Intended room in the new location, e.g., "New Office"
  imageUrl?: string; // Optional photo of the box or its contents
  ownerUid?: string; // UID of the Owner or Communal Room
  history: ScanEntry[];
  createdAt: number;
  updatedAt: number;
  truckZone?: TruckZone; // Where in the truck the box is loaded
  truckVerticalPosition?: VerticalPosition; // Stacking position in the truck
}

export type NewBoxData = { // Renamed from NewItemData
  name: string;
  contents?: string; // Formerly description
  initialLocation?: string; // Initial location when packed
  destinationRoom?: string; // Intended room
  imageUrl?: string;
  ownerUid?: string; // UID of the Owner or Communal Room
};

export interface AppSettings {
  defaultBatchPrintCount: number;
  currentMoveId?: string; // Unique ID for the current move session
  // Add other settings here as needed
}

