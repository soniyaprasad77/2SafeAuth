# 2SafeAuth

This project is a 2FA-enabled authentication system. Below is a detailed description of the backend API endpoints and frontend routes.

## Backend API Endpoints

All backend API routes are prefixed with `/api`. The following endpoints are available:

### Auth and User Management:

1. **POST `/api/register`**  
   Registers a new user.  
   **Body Parameters:**
   - `fullName`: Full name of the user (required)
   - `email`: Email of the user (required)
   - `username`: Username (required)
   - `password`: Password (min 6 characters)

2. **POST `/api/login`**  
   Logs in the user and returns a JWT token.  
   **Body Parameters:**
   - `username`: Username (required)
   - `password`: Password (required)

3. **POST `/api/enable-2fa`**  
   Enables two-factor authentication (2FA) for the logged-in user.  
   Requires JWT authentication.

4. **POST `/api/verify-otp`**  
   Verifies the OTP for 2FA during login.  
   Requires JWT authentication.

5. **POST `/api/validate-otp`**  
   Validates the OTP during 2FA setup or verification.

6. **POST `/api/toggle-2fa`**  
   Toggles 2FA on or off for the current user.  
   Requires JWT authentication.

7. **POST `/api/logout`**  
   Logs out the current user and invalidates the session.  
   Requires JWT authentication.

8. **GET `/api/get-sessions`**  
   Fetches the active sessions for the current user.  
   Requires JWT authentication.

9. **DELETE `/api/sessions/:sessionId`**  
   Logs out a specific session identified by `sessionId`.  
   Requires JWT authentication.

10. **POST `/api/refresh-token`**  
    Refreshes the access token.

11. **POST `/api/change-password`**  
    Allows the current user to change their password.  
    Requires JWT authentication.

12. **GET `/api/current-user`**  
    Fetches the current user's profile details.  
    Requires JWT authentication.

13. **PATCH `/api/update-account`**  
    Updates the user’s account details (e.g., email, username).  
    Requires JWT authentication.

## Frontend Routes

These are the main routes available in the frontend application:

1. **`/login`**  
   Route for the login page where users can enter their credentials.

2. **`/signup`**  
   Route for the signup page where new users can register.

3. **`/otp-verification`**  
   Route for OTP verification after login or 2FA setup.

4. **`/profile`**  
   Route for displaying the user profile. Protected by authentication.

5. **`/2fa-setup`**  
   Route for setting up 2FA for the logged-in user.

6. **`*`**  
   Any unmatched route redirects to the login page.

