// Ambient app-wide types to satisfy references in components

declare interface PersonalOwner {
  uid: string;
  id?: string;
  name?: string;
  color?: string;
  [key: string]: any;
}

declare interface CommunalSpace {
  uid: string;
  id?: string;
  name?: string;
  color?: string;
  [key: string]: any;
}

declare type OwnerOrSpace = PersonalOwner | CommunalSpace;

declare interface Box {
  id?: string;
  ownerUid?: string;
  ownerId?: string;
  spaceUid?: string;
  spaceId?: string;
  status?: string;
  [key: string]: any;
}

declare type TruckZone = string;
declare type BoxCountByEntity = Record<string, number>;

