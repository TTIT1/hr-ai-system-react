import { Navigate, Outlet } from 'react-router-dom';
import { canAccess, type Permission } from '../../auth/permissions';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  permission?: Permission;
}

export function ProtectedRoute({ permission }: ProtectedRouteProps) {
  const { user, isAuthenticated, meQuery } = useAuth();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!user && meQuery.isLoading) return <div className="p-6 text-sm text-muted">Loading...</div>;
  if (!user && meQuery.isError) return <Navigate to="/login" replace />;
  if (permission && !canAccess(user?.role, permission)) return <Navigate to="/403" replace />;

  return <Outlet />;
}
