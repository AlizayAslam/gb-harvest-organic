import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext.js';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || !user || (role !== 'admin' && role !== 'headAdmin')) {
    return <Navigate to="/auth" />;
  }

  return children;
}

export default ProtectedRoute;