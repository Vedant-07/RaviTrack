import { Types } from 'mongoose';

export interface ICompany {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  phone: string;
  address: string;
  secretKey?: string; // Optional during creation, generated if missing
  isIndividual: boolean;
}
