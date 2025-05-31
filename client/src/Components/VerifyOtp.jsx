import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const email = localStorage.getItem('resetEmail');
  const navigate = useNavigate();

  // Countdown timer for Resend button
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/api/verify-otp', { email, otp });
      alert('OTP verified!');
      navigate('/reset-password');
    } catch (err) {
      console.error(err);
      alert('Invalid OTP');
    }
  };

  const handleResendOtp = async () => {
    try {
      await axios.post('http://localhost:3001/api/forgot-password', { email });
      alert('OTP resent to your email');
      setResendTimer(60);
      setCanResend(false);
    } catch (err) {
      console.error(err);
      alert('Failed to resend OTP');
    }
  };

  return (
    <form onSubmit={handleVerify} style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
      <h2>Verify OTP</h2>
      <p>OTP has been sent to <strong>{email}</strong></p>
      <input
        type="text"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
        required
      />
      <button type="submit" style={{ marginTop: '10px' }}>Verify</button>

      {canResend ? (
        <button
          type="button"
          onClick={handleResendOtp}
          style={{ marginTop: '10px', display: 'block' }}
        >
          Resend OTP
        </button>
      ) : (
        <p style={{ marginTop: '10px' }}>Resend available in {resendTimer} seconds</p>
      )}
    </form>
  );
};

export default VerifyOtp;
