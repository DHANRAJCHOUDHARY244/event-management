import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const ProtectedRoute = () => {
  const token = useAuthStore((state) => state.token);
  return token ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;