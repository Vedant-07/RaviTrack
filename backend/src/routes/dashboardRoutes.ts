import express from 'express';
import { getAdminDashboardStats, getStaffDashboardStats } from '../controllers/dashboardController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

// Staff (and Admin) route
router.get('/staff', protect, getStaffDashboardStats);

// Admin only route
router.get('/admin', protect, admin, getAdminDashboardStats);

export default router;