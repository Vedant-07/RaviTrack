import express from 'express';
import { registerUser, authUser, getUserProfile } from '../controllers/userController';
import { protect, protectOptional } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', protectOptional, registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

export default router;
