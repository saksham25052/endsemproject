import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutComponent= () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Clear all items from localStorage
    localStorage.clear();
    // Or clear specific item:
    // localStorage.removeItem('authToken');
    
    // Redirect to login page
    navigate('/login');
  }, [navigate]);

  return null;
};

export default LogoutComponent;