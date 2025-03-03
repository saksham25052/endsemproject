import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import VerifyUser from './VerifyUser';
import CreateEvent from './CreateEvent';
import PrivateRoute from './PrivateRoute';
import { LogOut } from 'lucide-react';
import LogoutComponent from './LogoutComponent';
import AdminDashboard from './AdminDashboard';
import AdminRoute from './AdminRoute';
import AdminLogin from './AdminLogin';
import BookingPage from './BookingPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify" element={<VerifyUser />} />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/create" 
          element={
            <PrivateRoute>
              <CreateEvent />
            </PrivateRoute>
          } 
        />

        {/* Redirect root to dashboard */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/logout" 
          element={
            <PrivateRoute>
              <LogoutComponent/>
            </PrivateRoute>
          } 
        />

        {/* Admin Route */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route 
          path="/admin" 
          element={
            <PrivateRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </PrivateRoute>
          } 
        />
        <Route 
          path="/book/:eventId" 
          element={
            <PrivateRoute>
              <BookingPage />
            </PrivateRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
