import express from 'express';
import { 
  createAsset, 
  getAssets, 
  getAssetById,
  updateAsset,
  deleteAsset,
  getCompanyPortalAssets,
  getAssetsByCompany
} from '../controllers/assetController';
import { protect, admin, protectCompany } from '../middleware/authMiddleware';

const router = express.Router();

// Company Portal Route
router.get('/portal/my-assets', protectCompany, getCompanyPortalAssets);

// Standard Admin/Staff Routes
router.route('/')
  .post(protect, createAsset)
  .get(protect, getAssets);

// Get all assets for a specific company (must be before /:id)
router.get('/company/:companyId', protect, getAssetsByCompany);

router.route('/:id')
  .get(protect, getAssetById)
  .put(protect, updateAsset)
  .delete(protect, deleteAsset); // Staff and Admins can delete as per user request

export default router;
