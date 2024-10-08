import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { BASE_URL } from "../utils/constants";
import { useNavigate } from "react-router-dom";

const TwoFactorSetup = () => {
  const [qrCode, setQrCode] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { currentUser, setup2FA, disable2FA } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQrCode = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/v1/users/enable-2fa`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            username: currentUser?.username,
          }),
        });
        const data = await response.json();
        setQrCode(data.qrCode);
      } catch (error) {
        // setError("Failed to fetch QR code");
      }
    };

    if (!currentUser?.twoFactorEnabled) {
      fetchQrCode();
    }
  }, [currentUser?.twoFactorEnabled]);

  const handleSetup = async (e) => {
    e.preventDefault();
    try {
      await setup2FA(currentUser.username, verificationCode);
      setSuccess(
        "Two-factor authentication enabled successfully. Redirecting to user profile..."
      );
      setTimeout(() => {
        navigate("/profile");
      }, 5000);
    } catch (error) {
      setError("Failed to enable two-factor authentication");
    }
  };

  const handleDisable = async () => {
    try {
      await disable2FA(currentUser.username);
      setSuccess("Two-factor authentication disabled successfully");
      setTimeout(() => {
        navigate("/profile");
      }, 5000);
    } catch (error) {
      setError("Failed to disable two-factor authentication");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
            {currentUser?.twoFactorEnabled ? "Disable 2FA" : "Setup 2FA"}
          </h2>
        </div>
        {!currentUser?.twoFactorEnabled ? (
          <div>
            <div className='mb-4'>
              <p className='text-sm text-gray-600'>
                Scan this QR code with your authenticator app:
              </p>
              <img src={qrCode} alt='QR Code' className='mx-auto' />
            </div>
            <form onSubmit={handleSetup}>
              <div>
                <label htmlFor='verification-code' className='sr-only'>
                  Verification Code
                </label>
                <input
                  id='verification-code'
                  name='verification-code'
                  type='text'
                  required
                  className='appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
                  placeholder='Enter verification code'
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                />
              </div>
              <div>
                <button
                  type='submit'
                  className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mt-4'
                >
                  Enable 2FA
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <p className='text-sm text-gray-600 mb-4'>
              Two-factor authentication is currently enabled for your account.
            </p>
            <button
              onClick={handleDisable}
              className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'
            >
              Disable 2FA
            </button>
          </div>
        )}
        {error && (
          <p className='mt-2 text-center text-sm text-red-600'>{error}</p>
        )}
        {success && (
          <p className='mt-2 text-center text-sm text-green-600'>{success}</p>
        )}
      </div>
    </div>
  );
};

export default TwoFactorSetup;
