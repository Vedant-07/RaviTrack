import { Response } from 'express';
import Company from '../models/Company';
import Asset from '../models/Asset';
import { AuthRequest } from '../middleware/authMiddleware';
import { AssetStatus } from '../interfaces/IAsset';

// Admin Dashboard
export const getAdminDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    // 1. Total Revenue Estimate: Total number of active AMCs.
    const activeAmcCount = await Asset.countDocuments({ status: AssetStatus.Active });

    // 2. Company Growth: A count of new companies added this month.
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const newCompaniesCount = await Company.countDocuments({ createdAt: { $gte: startOfMonth } });

    // 3. Critical Alerts: A list of companies where more than 50% of assets have expired AMCs.
    const criticalAlertsRaw = await Asset.aggregate([
      {
        $group: {
          _id: '$companyId',
          totalAssets: { $sum: 1 },
          expiredAssets: {
            $sum: {
              $cond: [{ $eq: ['$status', AssetStatus.Expired] }, 1, 0]
            }
          }
        }
      },
      {
        $project: {
          _id: 1,
          totalAssets: 1,
          expiredAssets: 1,
          ratio: { $divide: ['$expiredAssets', { $cond: [{ $eq: ['$totalAssets', 0] }, 1, '$totalAssets'] }] }
        }
      },
      {
        $match: { ratio: { $gt: 0.5 } }
      }
    ]);

    // Populate company details for critical alerts
    const criticalAlerts = await Company.populate(criticalAlertsRaw, { path: '_id', select: 'name email phone' });
    
    // Map the populated result to a cleaner structure
    const formattedCriticalAlerts = criticalAlerts.map((alert: any) => ({
      company: alert._id,
      totalAssets: alert.totalAssets,
      expiredAssets: alert.expiredAssets,
      ratio: alert.ratio
    }));

    res.json({
      activeAmcCount,
      newCompaniesCount,
      criticalAlerts: formattedCriticalAlerts
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Staff and Admin Dashboard
export const getStaffDashboardStats = async (req: AuthRequest, res: Response) => {
  try {
    // 1. Assigned Callbacks: List of companies requesting a callback
    const assignedCallbacks = await Company.find({ callbackRequested: true }).select('name email phone address');

    // 2. Expiring Soon (30 Days): A focused list of assets whose AMC or Antivirus is about to hit the 30-day mark.
    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const expiringSoon = await Asset.find({
      $or: [
        { amcExpiryDate: { $gte: now, $lte: thirtyDaysFromNow } },
        { avExpiryDate: { $gte: now, $lte: thirtyDaysFromNow } }
      ],
      status: AssetStatus.Active // Only care about currently active ones
    }).populate('companyId', 'name email phone');

    res.json({
      assignedCallbacks,
      expiringSoon
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
