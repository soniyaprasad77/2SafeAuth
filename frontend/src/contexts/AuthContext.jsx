import React, { createContext, useState, useContext, useEffect } from "react";
import { BASE_URL } from "../utils/constants";

const AuthContext = createContext(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      fetch(`${BASE_URL}/api/v1/users/current-user`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.success) {
            setCurrentUser(res.data);
          }
        })
        .catch((err) => console.log(err));
    };

    checkLoggedIn();
  }, []);

  const login = (username, email, password) => {
    fetch(`${BASE_URL}/api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCurrentUser(data.data.user);

          localStorage.setItem("accessToken", data.data.accessToken);
          localStorage.setItem("refreshToken", data.data.refreshToken);
        }
      })
      .catch((err) => console.log(err));
  };

  const signup = (username, fullName, email, password) => {
    fetch(`${BASE_URL}/api/v1/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, fullName, email, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.status === "success") {
          setCurrentUser(data.data.user);
        }
      })
      .catch((err) => console.log(err));
  };

  const logout = async () => {
    fetch(`${BASE_URL}/api/v1/users/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    }).then((res) => {
      if (res.status === 200) {
        setCurrentUser(null);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    });
  };

  const verifyOtp = async (username, token) => {
    fetch(`${BASE_URL}/api/v1/users/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ username, token }),
    });
  }

  const setup2FA = (username, token) => {
    fetch(`${BASE_URL}/api/v1/users/verify-otp`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ username, token }),
    }).then(() => {
      fetch(`${BASE_URL}/api/v1/users/toggle-2fa`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ username }),
      });
    });
  };

  const disable2FA = (username) => {
    fetch(`${BASE_URL}/api/v1/users/toggle-2fa`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
      body: JSON.stringify({ username }),
    });
  };

  const terminateSession = async (sessionId) => {
    fetch(`${BASE_URL}/api/v1/users/sessions/${sessionId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
  };

  const value = {
    currentUser,
    login,
    signup,
    logout,
    verifyOtp,
    setup2FA,
    disable2FA,
    terminateSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
