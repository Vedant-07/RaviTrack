import mongoose, { Schema } from 'mongoose';
import { IServiceLog } from '../interfaces/IServiceLog';

const serviceLogSchema = new Schema<IServiceLog>({
  assetId: { type: Schema.Types.ObjectId, ref: 'Asset', required: true },
  logDate: { type: Date, default: Date.now },
  technicianName: { type: String, required: true },
  issueDescription: { type: String, required: true },
  actionTaken: { type: String, required: true }
}, {
  timestamps: true
});

// Index on assetId for efficient lookups of all logs for a given asset
serviceLogSchema.index({ assetId: 1 });

export default mongoose.model<IServiceLog>('ServiceLog', serviceLogSchema);
