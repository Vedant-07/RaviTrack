// import { Navigate } from 'react-router-dom';
// import { useAuthStore } from '../store/useAuthStore';

// const PublicRoute = ({ children }) => {
//   const { isAuthenticated, user } = useAuthStore();

//   if (isAuthenticated) {
//     // If logged in, kick them to their specific dashboard
//     return <Navigate to={user?.role === 'client' ? '/client-dashboard' : '/admin-dashboard'} replace />;
//   }

//   return children;
// };

// export default PublicRoute;
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, userType } = useAuthStore();

  if (isAuthenticated) {
    // Rely on userType (staff/company) which is persisted in localStorage
    const dashboardPath = userType === 'company' ? '/company-dashboard' : '/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return children;
};

export default PublicRoute;