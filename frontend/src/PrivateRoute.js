import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const PrivateRoute = ({ children }) => {
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsAuthenticated(!!token);
    setIsCheckingAuth(false);
  }, []);

  if (isCheckingAuth) {
    return <div>Loading...</div>; // Or a proper loading spinner
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;