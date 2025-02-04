import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireAdmin = false 
}) => {
  const user = useSelector((state: RootState) => state.user.currentUser);
  const location = useLocation();

  if (!user) {
    // Redirect them to the home page, but save the attempted location
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (requireAdmin && !user.isAdmin) {
    // If admin access is required but user is not admin, redirect to profile
    return <Navigate to="/profile" replace />;
  }

  return <>{children}</>;
};
