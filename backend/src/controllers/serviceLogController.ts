import { Response } from 'express';
import ServiceLog from '../models/ServiceLog';
import Asset from '../models/Asset';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Add a service log for an asset
// @route   POST /service-logs
// @access  Protected (Admin & Staff)
export const addLog = async (req: AuthRequest, res: Response) => {
  const { assetId, logDate, technicianName, issueDescription, actionTaken } = req.body;

  try {
    const assetExists = await Asset.findById(assetId);
    if (!assetExists) {
      res.status(404).json({ message: 'Asset not found' });
      return;
    }

    const log = await ServiceLog.create({
      assetId,
      logDate,
      technicianName,
      issueDescription,
      actionTaken
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Get all service logs for a specific asset
// @route   GET /service-logs/asset/:assetId
// @access  Protected (Admin & Staff)
export const getLogsByAsset = async (req: AuthRequest, res: Response) => {
  try {
    const assetExists = await Asset.findById(req.params.assetId);
    if (!assetExists) {
      res.status(404).json({ message: 'Asset not found' });
      return;
    }

    const logs = await ServiceLog.find({ assetId: req.params.assetId }).sort({ logDate: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Update a service log
// @route   PUT /service-logs/:id
// @access  Protected (Admin & Staff)
export const updateLog = async (req: AuthRequest, res: Response) => {
  try {
    const log = await ServiceLog.findById(req.params.id);

    if (!log) {
      res.status(404).json({ message: 'Service log not found' });
      return;
    }

    log.logDate = req.body.logDate || log.logDate;
    log.technicianName = req.body.technicianName || log.technicianName;
    log.issueDescription = req.body.issueDescription || log.issueDescription;
    log.actionTaken = req.body.actionTaken || log.actionTaken;

    const updatedLog = await log.save();
    res.json(updatedLog);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Delete a service log
// @route   DELETE /service-logs/:id
// @access  Protected (Admin & Staff)
export const deleteLog = async (req: AuthRequest, res: Response) => {
  try {
    const log = await ServiceLog.findById(req.params.id);

    if (!log) {
      res.status(404).json({ message: 'Service log not found' });
      return;
    }

    await ServiceLog.findByIdAndDelete(log._id);
    res.json({ message: 'Service log removed' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
