import express from 'express';
import { registerUser, authUser, getUserProfile, deleteUser, getAllUsers } from '../controllers/userController';
import { protect, protectOptional, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(protect, admin, getAllUsers);

router.post('/register', protectOptional, registerUser);
router.post('/login', authUser);
router.get('/profile', protect, getUserProfile);

router.route('/:id')
  .delete(protect, admin, deleteUser);

export default router;
