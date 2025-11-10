
/**
 * @enum {string}
 */
export enum ItemStatus {
  PREPARED = 'Prepared', // Box identified, label printed, ready for packing contents
  PACKED = 'Packed', // Box filled with contents, sealed, QR label applied
  LOADED = 'Loaded', // Box loaded onto moving truck/vehicle
  UNLOADED = 'Unloaded', // Box unloaded at new destination (e.g., garage, entryway)
  DELIVERED = 'Delivered', // Box delivered to intended room/area in new home
  UNPACKED = 'Unpacked', // Box unpacked, contents put away
  UNKNOWN = 'Unknown',
}

/**
 * @interface ScanEntry
 * @property {number} timestamp - The timestamp of the scan.
 * @property {string} location - The location of the scan.
 * @property {string} [notes] - Any notes for the scan.
 * @property {ItemStatus} [statusChange] - The new status of the box after this scan.
 */
export interface ScanEntry {
  timestamp: number;
  location: string;
  notes?: string;
  statusChange?: ItemStatus; // Box's new status after this scan
}

/**
 * @interface Owner
 * @property {string} uid - The unique ID of the owner.
 * @property {string} firstName - The first name of the owner, or the room name for a communal space.
 * @property {string} lastName - The last name of the owner, or "(Communal)" for a communal space.
 * @property {string} color - The hex color code for the owner.
 * @property {number} createdAt - The timestamp of when the owner was created.
 */
export interface Owner {
  uid: string; // Initials, e.g., JD, JD2, or communal room ID like KTCHN
  firstName: string; // Or Room Name for communal
  lastName: string; // Or "(Communal)" or similar for type distinction
  color: string; // Hex color code
  createdAt: number;
}

/**
 * @typedef {Omit<Owner, 'uid' | 'createdAt'>} NewOwnerData
 */
export type NewOwnerData = Omit<Owner, 'uid' | 'createdAt'>;

/**
 * @typedef {('Bottom' | 'Middle' | 'Top')} VerticalPosition
 */
export type VerticalPosition = 'Bottom' | 'Middle' | 'Top';

/**
 * @const {string[]} TRUCK_ZONES
 */
export const TRUCK_ZONES = [
  "Cab", "Overhead",
  "Front Left", "Front Center", "Front Right",
  "Middle Left", "Middle Center", "Middle Right",
  "Back Left", "Back Center", "Back Right"
] as const;

/**
 * @typedef {typeof TRUCK_ZONES[number]} TruckZone
 */
export type TruckZone = typeof TRUCK_ZONES[number];


/**
 * @interface Box
 * @property {string} id - The unique ID of the box.
 * @property {string} name - The name of the box.
 * @property {string} [contents] - A description of the contents of the box.
 * @property {string} qrCodeValue - The QR code value for the box.
 * @property {ItemStatus} currentStatus - The current status of the box.
 * @property {string} [currentLocation] - The current location of the box.
 * @property {string} [destinationRoom] - The destination room for the box.
 * @property {string} [imageUrl] - An optional photo of the box or its contents.
 * @property {string} [ownerUid] - The UID of the owner or communal room.
 * @property {ScanEntry[]} history - A history of scans for the box.
 * @property {number} createdAt - The timestamp of when the box was created.
 * @property {number} updatedAt - The timestamp of when the box was last updated.
 * @property {TruckZone} [truckZone] - The zone in the truck where the box is loaded.
 * @property {VerticalPosition} [truckVerticalPosition] - The vertical position in the truck where the box is loaded.
 */
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

/**
 * @typedef {object} NewBoxData
 * @property {string} name - The name of the box.
 * @property {string} [contents] - A description of the contents of the box.
 * @property {string} [initialLocation] - The initial location of the box.
 * @property {string} [destinationRoom] - The destination room for the box.
 * @property {string} [imageUrl] - An optional photo of the box or its contents.
 * @property {string} [ownerUid] - The UID of the owner or communal room.
 */
export type NewBoxData = { // Renamed from NewItemData
  name: string;
  contents?: string; // Formerly description
  initialLocation?: string; // Initial location when packed
  destinationRoom?: string; // Intended room
  imageUrl?: string;
  ownerUid?: string; // UID of the Owner or Communal Room
};

/**
 * @interface AppSettings
 * @property {number} defaultBatchPrintCount - The default number of labels to print in a batch.
 * @property {string} [currentMoveId] - The ID of the current move.
 */
export interface AppSettings {
  defaultBatchPrintCount: number;
  currentMoveId?: string; // Unique ID for the current move session
  // Add other settings here as needed
}