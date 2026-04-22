import { Types } from 'mongoose';

export enum AssetCategory {
  Server = 'Server',
  CCTV = 'CCTV',
  Laptop = 'Laptop',
  UPS = 'UPS',
  Desktop = 'Desktop'
}

export enum AssetStatus {
  Active = 'Active',
  Expired = 'Expired',
  UnderRepair = 'UnderRepair'
}

export interface IAsset {
  clientId: Types.ObjectId;
  category: AssetCategory;
  brand: string;
  model: string;
  serialNumber: string;
  amcExpiryDate: Date;
  avExpiryDate: Date;
  status: AssetStatus;
}
