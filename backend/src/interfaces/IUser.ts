export interface IUser {
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'admin' | 'staff';
}

export interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
}
