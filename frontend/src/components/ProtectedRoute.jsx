import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const ProtectedRoute = ({ children, allowedType }) => {
  const { isAuthenticated, userType } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (allowedType && userType !== allowedType) return <Navigate to="/" replace />;

  return children;
};