import { Response } from 'express';
import Company from '../models/Company';
import { AuthRequest } from '../middleware/authMiddleware';

export const createCompany = async (req: AuthRequest, res: Response) => {
  const { name, email, phone, address, secretKey, isIndividual } = req.body;

  try {
    const companyExists = await Company.findOne({ email });

    if (companyExists) {
      res.status(400).json({ message: 'Company with this email already exists' });
      return;
    }

    const company = await Company.create({
      name,
      email,
      phone,
      address,
      secretKey, // If omitted, the Mongoose pre-save hook will automatically generate a 6-char key
      isIndividual: isIndividual || false
    });

    res.status(201).json(company);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
