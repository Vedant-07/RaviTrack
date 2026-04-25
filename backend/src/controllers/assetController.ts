import { Response } from 'express';
import Asset from '../models/Asset';
import Company from '../models/Company';
import { AuthRequest } from '../middleware/authMiddleware';

export const createAsset = async (req: AuthRequest, res: Response) => {
  const { companyId, category, brand, model, serialNumber, amcExpiryDate, avExpiryDate, status } = req.body;

  try {
    const companyExists = await Company.findById(companyId);
    if (!companyExists) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    const assetExists = await Asset.findOne({ serialNumber });
    if (assetExists) {
      res.status(400).json({ message: 'Asset with this serial number already exists' });
      return;
    }

    const asset = await Asset.create({
      companyId,
      category,
      brand,
      model,
      serialNumber,
      amcExpiryDate,
      avExpiryDate,
      status,
      lastModifiedBy: req.user!.name // req.user is guaranteed to exist because of protect middleware
    });

    res.status(201).json(asset);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAssets = async (req: AuthRequest, res: Response) => {
  try {
    const assets = await Asset.find({}).populate('companyId', 'name email');
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getAssetById = async (req: AuthRequest, res: Response) => {
  try {
    const asset = await Asset.findById(req.params.id).populate('companyId', 'name email');
    if (!asset) {
      res.status(404).json({ message: 'Asset not found' });
      return;
    }
    res.json(asset);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateAsset = async (req: AuthRequest, res: Response) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      res.status(404).json({ message: 'Asset not found' });
      return;
    }

    asset.companyId = req.body.companyId || asset.companyId;
    asset.category = req.body.category || asset.category;
    asset.brand = req.body.brand || asset.brand;
    asset.model = req.body.model || asset.model;
    asset.serialNumber = req.body.serialNumber || asset.serialNumber;
    asset.amcExpiryDate = req.body.amcExpiryDate || asset.amcExpiryDate;
    asset.avExpiryDate = req.body.avExpiryDate || asset.avExpiryDate;
    asset.status = req.body.status || asset.status;
    asset.lastModifiedBy = req.user!.name;

    const updatedAsset = await asset.save();
    res.json(updatedAsset);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// @desc    Get all assets for a specific company
// @route   GET /assets/company/:companyId
// @access  Protected (Admin & Staff)
export const getAssetsByCompany = async (req: AuthRequest, res: Response) => {
  try {
    const company = await Company.findById(req.params.companyId);
    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    const assets = await Asset.find({ companyId: req.params.companyId }).populate('companyId', 'name email');
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteAsset = async (req: AuthRequest, res: Response) => {
  try {
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      res.status(404).json({ message: 'Asset not found' });
      return;
    }

    await Asset.findByIdAndDelete(asset._id);
    res.json({ message: 'Asset removed' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getCompanyPortalAssets = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.company) {
      res.status(401).json({ message: 'Company not found in request' });
      return;
    }

    // Fetch assets belonging strictly to this authenticated company
    const assets = await Asset.find({ companyId: req.company._id });
    res.json(assets);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
