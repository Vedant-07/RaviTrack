export interface ICompany {
  name: string;
  email: string;
  phone: string;
  address: string;
  secretKey?: string; // Optional during creation, generated if missing
  isIndividual: boolean;
}
