import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'client' | 'partner' | 'admin';
  allowedRoles?: Array<'client' | 'partner' | 'admin'>;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole,
  allowedRoles 
}) => {
  const { user, profile, loading } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Redirect to auth if profile not found
  if (!profile) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole && profile.user_role !== requiredRole) {
    // Redirect to appropriate dashboard based on user's role
    const dashboardMap = {
      client: '/client-dashboard',
      partner: '/partners-dashboard',
      admin: '/admin-dashboard',
    };
    return <Navigate to={dashboardMap[profile.user_role]} replace />;
  }

  // Check if user has one of the allowed roles
  if (allowedRoles && !allowedRoles.includes(profile.user_role)) {
    const dashboardMap = {
      client: '/client-dashboard',
      partner: '/partners-dashboard',
      admin: '/admin-dashboard',
    };
    return <Navigate to={dashboardMap[profile.user_role]} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

