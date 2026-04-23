import mongoose, { Schema, Model } from 'mongoose';
import { ICompany } from '../interfaces/ICompany';

const companySchema = new Schema<ICompany>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  secretKey: { type: String, unique: true },
  isIndividual: { type: Boolean, default: false }
}, {
  timestamps: true
});

const generateRandomKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Hook to auto-generate a 6-character uppercase unique secretKey
companySchema.pre('save', async function() {
  if (!this.secretKey) {
    let isUnique = false;
    let newKey = '';
    const CompanyModel = this.constructor as Model<ICompany>;
    
    // Ensure the key is truly unique across the database
    while (!isUnique) {
      newKey = generateRandomKey();
      const existing = await CompanyModel.findOne({ secretKey: newKey });
      if (!existing) {
        isUnique = true;
      }
    }
    this.secretKey = newKey;
  }
});

export default mongoose.model<ICompany>('Company', companySchema);
