Project Name
# Overview
This project is a user authentication and management system built with Node.js, Express, and MongoDB. It includes features such as user registration, login, logout, password change, and token-based authentication using JWT.

## Project Structure

### Installation
1. Clone the repository:
    ```sh
    git clone <repository-url>
    ```
2. Install dependencies:
    ```sh
    npm install
    ```
3. Create a `.env` file in the root directory and add the following environment variables:
    ```env
    # Example .env content
    PORT=3000
    MONGODB_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    ```

4. Start the development server:
    ```sh
    npm run dev
    ```

## API Endpoints

### User Routes
- `POST /api/v1/users/register` - Register a new user
- `POST /api/v1/users/login` - Login a user
- `POST /api/v1/users/logout` - Logout a user
- `POST /api/v1/users/refresh-token` - Refresh access token
- `POST /api/v1/users/change-password` - Change current password
- `GET /api/v1/users/current-user` - Get current user details
- `PATCH /api/v1/users/update-account` - Update account details

### Middleware
- `verifyJWT`: Verifies the JWT token for protected routes. Defined in `src/middlewares/auth.middleware.js`.

### Utilities
- `ApiError`: Custom error class for API errors. Defined in `src/utils/ApiError.js`.
- `ApiResponse`: Standardized API response format. Defined in `src/utils/ApiResponse.js`.
- `asyncHandler`: Utility to handle async route handlers. Defined in `src/utils/asyncHandler.js`.


