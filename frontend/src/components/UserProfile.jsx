import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { BASE_URL } from "../utils/constants";

const UserProfile = () => {
  const navigate = useNavigate();
  const { currentUser, logout, terminateSession } = useAuth();

  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const response = await fetch(`${BASE_URL}/api/v1/users/get-sessions`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      const data = await response.json();
      if (data.status === "success") {
        setSessions(data.sessions);
      }
    };

    fetchSessions();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const handleTerminateSession = async (sessionId) => {
    try {
      await terminateSession(sessionId);
      setSessions(sessions.filter((session) => session._id !== sessionId));
    } catch (error) {
      console.error("Failed to terminate session", error);
    }
  };

  return (
    <div className='min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12'>
      <div className='relative py-3 sm:max-w-xl sm:mx-auto'>
        <div className='absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl'></div>
        <div className='relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20'>
          <div className='max-w-md mx-auto'>
            <div>
              <h1 className='text-2xl font-semibold'>User Profile</h1>
            </div>
            <div className='divide-y divide-gray-200'>
              <div className='py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7'>
                <p>Email: {currentUser?.email}</p>
                <p>
                  2FA Status:{" "}
                  {currentUser?.twoFactorEnabled ? "Enabled" : "Disabled"}
                </p>
                <Link
                  to='/2fa-setup'
                  className='text-indigo-600 hover:text-indigo-500'
                >
                  {currentUser?.twoFactorEnabled ? "Disable 2FA" : "Enable 2FA"}
                </Link>
              </div>
              <div className='pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7'>
                <p>Active Sessions:</p>
                {sessions.length === 0 && (
                  <p className='font-thin'>No active sessions</p>
                )}
                <ul className='list-disc space-y-2 mt-2'>
                  {sessions.map(
                    (session) =>
                      session.isActive && (
                        <li
                          key={session._id}
                          className='flex items-center justify-between'
                        >
                          <span>
                            {session.deviceType} - {session.browser} (
                            {session.location})
                          </span>
                          <button
                            onClick={() => handleTerminateSession(session._id)}
                            className='text-red-600 hover:text-red-500'
                          >
                            Terminate
                          </button>
                        </li>
                      )
                  )}
                </ul>
              </div>
              <div className='pt-6 text-base leading-6 font-bold sm:text-lg sm:leading-7'>
                <button
                  onClick={handleLogout}
                  className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
