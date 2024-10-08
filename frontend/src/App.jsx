import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import OtpVerification from "./components/OTPVerification";
import UserProfile from "./components/UserProfile";
import TwoFactorSetup from "./components/TwoFactorSetup";
import PrivateRoute from "./components/PrivateRoute";

const App = () => {
  return (
    <Router>
      <div className='min-h-screen bg-gray-100'>
        <Routes>
          <Route path='/login' element={<Login />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/otp-verification' element={<OtpVerification />} />
          {/* <Route path="/profile" element={<PrivateRoute element={<UserProfile />} />} />
          <Route path="/2fa-setup" element={<PrivateRoute element={<TwoFactorSetup />} />} /> */}
          <Route path='/profile' element={<UserProfile />} />
          <Route path='/2fa-setup' element={<TwoFactorSetup />} />
          <Route path='*' element={<Navigate to='/login' />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
