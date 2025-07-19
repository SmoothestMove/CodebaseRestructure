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

export type NewOwnerData = Omit<Owner, 'uid' | 'createdAt'>;

export type VerticalPosition = 'Bottom' | 'Middle' | 'Top';

export const TRUCK_ZONES = [
  "Cab", "Overhead",
  "Front Left", "Front Center", "Front Right",
  "Middle Left", "Middle Center", "Middle Right",
  "Back Left", "Back Center", "Back Right"
] as const;

export type TruckZone = typeof TRUCK_ZONES[number];

export interface Box {
  id: string; // Will be the QR code value, e.g., OwnerUID01
  name: string;
  contents?: string;
  qrCodeValue: string;
  currentStatus: ItemStatus;
  currentLocation?: string;
  destinationRoom?: string;
  imageUrl?: string;
  ownerUid?: string;
  history: ScanEntry[];
  createdAt: number;
  updatedAt: number;
  truckZone?: TruckZone;
  truckVerticalPosition?: VerticalPosition;
}

export type NewBoxData = {
  name: string;
  contents?: string;
  initialLocation?: string;
  destinationRoom?: string;
  imageUrl?: string;
  ownerUid?: string;
};

export interface AppSettings {
  defaultBatchPrintCount: number;
  currentMoveId?: string;
}

export interface Expense {
  id: string;
  categoryId: string;
  amount: number;
  date: string; // YYYY-MM-DD format
  merchantName: string;
  description: string;
  receiptImageBase64?: string;
}

export interface Category {
  id: string;
  name: string;
  estimatedAmount: number;
  color: string;
  icon: string; // Changed from React.ReactNode to string for serialization
  deletable?: boolean;
}

export enum MoveType {
  LOCAL = 'local',
  CROSS_STATE = 'cross_state'
}

export interface Budget {
  totalEstimatedAmount: number;
  moveType: MoveType;
}
