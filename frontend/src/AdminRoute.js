import { Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

const AdminRoute = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        setIsAdmin(userData?.role === 'admin');
      } catch (error) {
        setIsAdmin(false);
      }
      setIsLoading(false);
    };

    checkAdminStatus();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAdmin ? children : <Navigate to="/dashboard" replace />;
};

export default AdminRoute;