import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useAuthStore } from '../stores/authStore';
import AdminAccessDenied from './admin/AdminAccessDenied';

const getDecodedToken = (rawToken) => {
  if (!rawToken) return null;
  try {
    return jwtDecode(rawToken);
  } catch {
    return null;
  }
};

const ProtectedRoute = () => {
  const { isAuthenticated, user, token, logout } = useAuthStore();
  const location = useLocation();
  const isRemembered = localStorage.getItem('admin_remember_me') === 'true';
  const currentToken = token || (isRemembered ? localStorage.getItem('token') : null) || sessionStorage.getItem('token') || localStorage.getItem('token');

  const decoded = getDecodedToken(currentToken);

  useEffect(() => {
    if (!currentToken || !decoded) {
      return;
    }
    if (decoded.exp && decoded.exp * 1000 < Date.now()) {
      logout();
    }
  }, [currentToken, decoded, logout]);

  if (!isAuthenticated || !currentToken || !decoded) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Verify ADMIN role
  const userRole = decoded.role || user?.role;
  if (userRole !== 'ADMIN') {
    return (
      <AdminAccessDenied
        user={{
          username: user?.username || decoded.sub,
          role: userRole,
        }}
      />
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
