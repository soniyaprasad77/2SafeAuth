# 2SafeAuth Frontend

This is the frontend for the 2SafeAuth project. It provides a user interface for authentication and two-factor authentication (2FA) features. The frontend is built with React, React Router, and TailwindCSS.

## Table of Contents
- [Installation](#installation)
- [Available Scripts](#available-scripts)
- [Frontend Routes](#frontend-routes)
- [Environment Variables](#environment-variables)

## Installation

To set up the frontend, follow these steps:

### Prerequisites
- [Node.js](https://nodejs.org/en/download/) (v14 or higher)

### Steps

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd 2SafeAuth-main/frontend
   ```

2. **Install dependencies:**
   Run the following command in the frontend directory to install all required dependencies.
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root of the `frontend` directory and configure the following variable:
   ```bash
   VITE_BACKEND_API_URL=<Your backend API URL>
   ```

4. **Run the frontend development server:**
   To start the development server, run:
   ```bash
   npm run dev
   ```

   The application will run at `http://localhost:3000` by default.

### Scripts
- **`npm run dev`**: Starts the development server with hot-reloading enabled.
- **`npm run build`**: Builds the app for production.
- **`npm run preview`**: Serves the production build for preview.

## Frontend Routes

These are the main routes in the frontend:

1. **`/login`**  
   The login page where users can enter their credentials to log in to their accounts.

2. **`/signup`**  
   The registration page where new users can sign up for an account.

3. **`/otp-verification`**  
   After login, this page allows users to verify their OTP if 2FA is enabled.

4. **`/profile`**  
   The profile page where users can view and manage their account details. This route is protected and requires the user to be authenticated.

5. **`/2fa-setup`**  
   The page where users can set up two-factor authentication for their account.

6. **`*` (Wildcard)**  
   Any unmatched routes will redirect users to the login page.

## Environment Variables

The frontend requires the following environment variable to be set in the `.env` file:

| Variable               | Description                                      |
|------------------------|--------------------------------------------------|
| `VITE_BACKEND_API_URL`  | The base URL of the backend API (e.g., `http://localhost:5000/api`). |

## Built With

- **React**: JavaScript library for building user interfaces.
- **React Router**: For handling client-side routing.
- **TailwindCSS**: A utility-first CSS framework for styling.
- **Vite**: A fast build tool that provides a local development server.

