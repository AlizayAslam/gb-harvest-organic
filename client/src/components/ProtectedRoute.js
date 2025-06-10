import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token || (role !== 'admin' && role !== 'headAdmin')) {
    return <Navigate to="/auth" replace />;
  }
  return children;
};

export default ProtectedRoute;