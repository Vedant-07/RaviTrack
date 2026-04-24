import express from 'express';
import { 
  createCompany, 
  getAllCompanies, 
  getCompanyById,
  updateCompany,
  resetSecretKey, 
  deleteCompany,
  authCompanyPortal,
  getCompanyPortalMe
} from '../controllers/companyController';
import { protect, admin, protectCompany } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .post(protect, admin, createCompany)
  .get(protect, getAllCompanies); // Staff and Admins can view

router.post('/portal-login', authCompanyPortal);
router.get('/portal/me', protectCompany, getCompanyPortalMe);
router.put('/reset-key', resetSecretKey);

router.route('/:id')
  .get(protect, getCompanyById) // Staff and Admins can view specific
  .put(protect, admin, updateCompany) // Only Admins can edit
  .delete(protect, admin, deleteCompany); // Only Admins can delete

export default router;
