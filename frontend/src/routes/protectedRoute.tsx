import { Outlet } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;