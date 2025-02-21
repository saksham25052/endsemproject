import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import VerifyUser from './VerifyUser';
import CreateEvent from './CreateEvent';

function App() {
  //const role = localStorage.getItem('role');
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify" element={<VerifyUser />} />
        <Route path="/create" element={<CreateEvent />} /> 


      </Routes>
    </Router>
  );
}

export default App;
