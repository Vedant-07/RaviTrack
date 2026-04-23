import express from 'express';
import { createCompany } from '../controllers/companyController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// Only logged in admins can create companies
router.post('/', protect, admin, createCompany);

export default router;
