# 2SafeAuth Backend

This backend provides authentication and two-factor authentication (2FA) functionality using JWT. The backend is built with Node.js, Express, and MongoDB.

## Table of Contents

- [Installation](#installation)
- [API Endpoints](#api-endpoints)
  - [User Registration and Authentication](#user-registration-and-authentication)
  - [Two-Factor Authentication (2FA)](#two-factor-authentication-2fa)
  - [Session Management](#session-management)
  - [Password and Account Management](#password-and-account-management)

## Installation

To get started with the backend, follow these steps:

### Prerequisites

- [Node.js](https://nodejs.org/en/download/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (Running locally or on a cloud service like MongoDB Atlas)

### Steps

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd 2SafeAuth-main/backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of the `backend` directory and configure the following variables:

   ```bash
   MONGO_URI=<Your MongoDB URI>
   PORT=3000
   CORS_ORIGIN=*
   REFRESH_TOKEN_SECRET=mysecrettoken
   ACCESS_TOKEN_SECRET=mysecret2token
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_EXPIRY=10d

   ```

4. **Run the server:**
   To start the development server, run:

   ```bash
   npm start
   ```

   The server will run at `http://localhost:3000` by default.

### Scripts

- **`npm start`**: Runs the server.
- **`npm run dev`**: Runs the server with live reload for development.

## API Endpoints

### Base URL

All endpoints are prefixed with `/api/v1/users`.

### User Registration and Authentication

1. **POST `/api/v1/users/register`**  
   Registers a new user.

   - **Request Body:**
     ```json
     {
       "fullName": "John Doe",
       "email": "johndoe@example.com",
       "username": "johndoe",
       "password": "password123"
     }
     ```
   - **Responses:**
     - `201 Created`: User successfully registered.
     - `400 Bad Request`: Validation errors.

2. **POST `/api/v1/users/login`**  
   Logs in a user and returns a JWT.

   - **Request Body:**
     ```json
     {
       "username": "johndoe",
       "password": "password123"
     }
     ```
   - **Responses:**
     - `200 OK`: Login successful, returns JWT.
     - `400 Bad Request`: Invalid credentials.

3. **POST `/api/v1/users/logout`**  
   Logs out the current user and invalidates the JWT.
   - Requires a valid JWT in the Authorization header.

### Two-Factor Authentication (2FA)

1. **POST `/api/v1/users/enable-2fa`**  
   Enables 2FA for the logged-in user.

   - Requires JWT Authentication.

2. **POST `/api/v1/users/verify-otp`**  
   Verifies the OTP provided by the user.

   - Requires JWT Authentication.
   - **Request Body:**
     ```json
     {
       "otp": "123456"
     }
     ```

3. **POST `/api/v1/users/validate-otp`**  
   Validates the OTP during 2FA setup or login.

   - Requires JWT Authentication.
   - **Request Body:**
     ```json
     {
       "username": "soniya",
       "otp": "123456"
     }
     ```

4. **POST `/api/v1/users/toggle-2fa`**  
   Toggles 2FA on or off for the logged-in user.
   - Requires JWT Authentication.

### Session Management

1. **GET `/api/v1/users/get-sessions`**  
   Fetches all active sessions for the logged-in user.

   - Requires JWT Authentication.

2. **DELETE `/api/v1/users/sessions/:sessionId`**  
   Logs out a specific session identified by `sessionId`.
   - Requires JWT Authentication.

### Password and Account Management

1. **POST `/api/v1/users/change-password`**  
   Allows the user to change their current password.

   - Requires JWT Authentication.
   - **Request Body:**
     ```json
     {
       "currentPassword": "oldpassword123",
       "newPassword": "newpassword456"
     }
     ```

2. **PATCH `/api/v1/users/update-account`**  
   Updates the user’s account details (e.g., email, username).

   - Requires JWT Authentication.
   - **Request Body:**
     ```json
     {
       "email": "newemail@example.com",
       "username": "newusername"
     }
     ```

3. **GET `/api/v1/users/current-user`**  
   Fetches the current user's profile details.

   - Requires JWT Authentication.

4. **POST `/api/v1/users/refresh-token`**  
   Refreshes the JWT token for the user.



---
