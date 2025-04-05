import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './Components/HomePage';
import { LoginPage } from './Components/LoginPage';
import { Admin } from './Components/dashboard/Admin';
import { Customer } from './Components/dashboard/Customer';
import { Register } from './Components/RegisterPage';
import ProtectedRoute from './Components/ProtectedRoute'; 
import {Navbar }from './Components/Navbar'; 

import './App.css';

function App() {
  return (
    <Router>
       <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Admin Route */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute roleRequired="admin">
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* Protected Customer Route */}
          <Route
            path="/Customer"
            element={
              <ProtectedRoute roleRequired="user">
                <Customer />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
