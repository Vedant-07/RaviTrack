import { Types } from 'mongoose';

export interface IServiceLog {
  assetId: Types.ObjectId;
  logDate: Date;
  technicianName: string;
  issueDescription: string;
  actionTaken: string;
}
