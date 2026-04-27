import { Response } from 'express';
import Company from '../models/Company';
import Asset from '../models/Asset';
import { AuthRequest } from '../middleware/authMiddleware';
import generateToken from '../utils/generateToken';

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

export const getAllCompanies = async (req: AuthRequest, res: Response) => {
  try {
    const companies = await Company.find({});
    res.json(companies);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const resetSecretKey = async (req: AuthRequest, res: Response) => {
  const { email, currentSecretKey } = req.body;

  try {
    const company = await Company.findOne({ email, secretKey: currentSecretKey });

    if (!company) {
      res.status(401).json({ message: 'Invalid email or current secret key' });
      return;
    }

    // Force the pre-save hook to regenerate the key
    company.secretKey = undefined; 
    await company.save();

    res.json({ message: 'Secret key updated successfully', newSecretKey: company.secretKey });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteCompany = async (req: AuthRequest, res: Response) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    // Delete all assets associated with this company
    await Asset.deleteMany({ companyId: company._id });

    // Delete the company itself
    await Company.findByIdAndDelete(company._id);

    res.json({ message: 'Company and all associated assets removed' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getCompanyById = async (req: AuthRequest, res: Response) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateCompany = async (req: AuthRequest, res: Response) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }

    company.name = req.body.name || company.name;
    company.email = req.body.email || company.email;
    company.phone = req.body.phone || company.phone;
    company.address = req.body.address || company.address;
    if (req.body.isIndividual !== undefined) {
      company.isIndividual = req.body.isIndividual;
    }

    const updatedCompany = await company.save();
    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const authCompanyPortal = async (req: AuthRequest, res: Response) => {
  const { email, secretKey } = req.body;

  try {
    const company = await Company.findOne({ email, secretKey });

    if (!company) {
      res.status(401).json({ message: 'Invalid email or secret key' });
      return;
    }

    res.json({
      _id: company._id,
      name: company.name,
      email: company.email,
      phone: company.phone,
      address: company.address,
      isIndividual: company.isIndividual,
      secretKey:company.secretKey,
      token: generateToken((company._id as any).toString()),
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getCompanyPortalMe = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.company) {
      res.status(404).json({ message: 'Company not found' });
      return;
    }
    // Return company without secret key
    const company = await Company.findById(req.company._id);//.select('-secretKey')
    res.json(company);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
