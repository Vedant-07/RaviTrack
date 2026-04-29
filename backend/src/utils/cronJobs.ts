import cron from 'node-cron';
import Asset from '../models/Asset';
import { AssetStatus } from '../interfaces/IAsset';

export const initCronJobs = () => {
  // Run every day at midnight
  cron.schedule('0 * * * *', async () => {
    console.log('Running cron job for asset status update...');
    try {
      const now = new Date();
      // Find all assets where AMC has expired and status is not already Inactive
      const result = await Asset.updateMany(
        {
          $or: [
            { amcExpiryDate: { $lt: now } },
            { avExpiryDate: { $lt: now } }
          ],
          status: { $ne: AssetStatus.Expired }
        },
        {
          $set: { status: AssetStatus.Expired, lastModifiedBy: 'System (Cron)' }
        }
      );
      
      console.log(`Cron job finished. Updated ${result.modifiedCount} assets to Expired status.`);
    } catch (error) {
      console.error('Error in asset status cron job:', error);
    }
  });
};
