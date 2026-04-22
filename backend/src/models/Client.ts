import mongoose, { Schema } from 'mongoose';
import { IClient } from '../interfaces/IClient';

const clientSchema = new Schema<IClient>({
  companyName: { type: String, required: true },
  contactPerson: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true }
}, {
  timestamps: true
});

export default mongoose.model<IClient>('Client', clientSchema);
