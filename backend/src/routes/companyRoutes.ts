import express from 'express';
import { 
  createCompany, 
  getAllCompanies, 
  getCompanyById,
  updateCompany,
  resetSecretKey, 
  deleteCompany,
  getCompanyPortalInfo
} from '../controllers/companyController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, admin, createCompany)
  .get(protect, getAllCompanies); // Staff and Admins can view

router.post('/portal-info', getCompanyPortalInfo);
router.put('/reset-key', resetSecretKey);

router.route('/:id')
  .get(protect, getCompanyById) // Staff and Admins can view specific
  .put(protect, admin, updateCompany) // Only Admins can edit
  .delete(protect, admin, deleteCompany); // Only Admins can delete

export default router;
