import mongoose, { Schema } from 'mongoose';
import { IAsset, AssetCategory, AssetStatus } from '../interfaces/IAsset';

const assetSchema = new Schema<IAsset>({
  companyId: { type: Schema.Types.ObjectId, ref: 'Company', required: true },
  category: { 
    type: String, 
    enum: Object.values(AssetCategory), 
    required: true 
  },
  brand: { type: String, required: true },
  model: { type: String, required: true },
  serialNumber: { type: String, required: true, unique: true },
  amcExpiryDate: { type: Date, required: true },
  avExpiryDate: { type: Date, required: true },
  status: { 
    type: String, 
    enum: Object.values(AssetStatus), 
    default: AssetStatus.Active,
    required: true 
  }
}, {
  timestamps: true
});

export default mongoose.model<IAsset>('Asset', assetSchema);
