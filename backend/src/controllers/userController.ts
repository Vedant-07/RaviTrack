import { Request, Response } from 'express';
import User from '../models/User';
import generateToken from '../utils/generateToken';
import { AuthRequest } from '../middleware/authMiddleware';

export const registerUser = async (req: AuthRequest, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const userCount = await User.countDocuments({});
    const isFirstUser = userCount === 0;

    // If not the first user, ensure the requester is an admin
    if (!isFirstUser && (!req.user || req.user.role !== 'admin')) {
      res.status(403).json({ message: 'Only admins can register new users' });
      return;
    }

    // First user is automatically admin, otherwise respect requested role or default to staff
    const userRole = isFirstUser ? 'admin' : (role || 'staff');

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken((user._id as any).toString()),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken((user._id as any).toString()),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getUserProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const user = await User.findById((req.user as any)._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
