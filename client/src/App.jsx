import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './Components/HomePage';
import { LoginPage } from './Components/LoginPage';
import { Admin } from './Components/dashboard/Admin';
import { Customer } from './Components/dashboard/Customer';
import { Register } from './Components/RegisterPage';
import ProtectedRoute from './ProtectedRoute'; 
import { Navbar } from './Components/Navbar'; 

// OTP Flow Pages
import ForgotPassword from './Components/ForgetPassword';
import VerifyOtp from './Components/VerifyOtp';
import ResetPassword from './Components/ResetPassword';

import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />

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
            path="/customer"
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
