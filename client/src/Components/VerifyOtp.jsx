import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const email = localStorage.getItem('resetEmail');
  const navigate = useNavigate();

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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleVerify}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Verify OTP</h2>
        <p className="text-sm text-gray-600 mb-4 text-center">
          OTP has been sent to <strong className="text-blue-600">{email}</strong>
        </p>

        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition mb-4"
        >
          Verify
        </button>

        {canResend ? (
          <button
            type="button"
            onClick={handleResendOtp}
            className="w-full bg-gray-200 text-gray-700 py-2 rounded-md hover:bg-gray-300 transition"
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-sm text-gray-500 text-center">
            Resend available in {resendTimer} seconds
          </p>
        )}
      </form>
    </div>
  );
};

export default VerifyOtp;
