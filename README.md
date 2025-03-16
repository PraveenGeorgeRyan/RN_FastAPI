# React Native with FastAPI Login System

This project demonstrates a complete login system built with React Native for the frontend and FastAPI for the backend. It's designed to be a learning resource for beginners trying to understand how authentication works across frontend and backend systems.

## Project Overview

This application consists of two main parts:

1. **Backend (FastAPI)**: A Python-based API server that handles authentication
2. **Frontend (React Native)**: A mobile app that provides the user interface for login

## What is FastAPI?

[FastAPI](https://fastapi.tiangolo.com/) is a modern, fast web framework for building APIs with Python. It's designed to be easy to use while providing high performance. Some key features:

- **Fast**: Very high performance, on par with NodeJS and Go
- **Easy to learn**: Designed to be easy to use and learn
- **Type annotations**: Leverages Python's type hints for better developer experience
- **Automatic docs**: Generates interactive API documentation automatically

In our project, FastAPI handles:
- User authentication with JWT (JSON Web Tokens)
- Password verification
- API endpoints for login and user information

## What is React Native?

[React Native](https://reactnative.dev/) is a framework for building native mobile applications using JavaScript and React. It allows you to build mobile apps that look and feel like native apps but using a single codebase. Key features:

- **Learn once, write anywhere**: Use the same code for iOS and Android
- **React-based**: Uses the same design as React for web apps
- **Native components**: Provides a set of components that map to native UI elements

In our project, React Native handles:
- The user interface for login
- State management using Zustand
- Navigation between screens
- API requests to the FastAPI backend

## How Authentication Works in This App

The authentication flow works like this:

1. **User enters credentials**: The user inputs their username and password in the React Native app.
2. **Frontend sends login request**: The app sends a POST request to the `/token` endpoint on the FastAPI server.
3. **Backend verifies credentials**: The server checks if the username exists and if the password is correct.
4. **Backend generates JWT token**: If credentials are valid, the server creates a JWT token with user information.
5. **Frontend receives and stores token**: The React Native app stores this token using Zustand state management.
6. **Token used for future requests**: For subsequent protected API requests, the token is included in the Authorization header.

## Security Best Practices

This project implements several security best practices:

1. **Environment Variables**: Sensitive configuration is stored in environment variables, not in code
2. **Password Hashing**: Passwords are never stored in plain text but are hashed for security
3. **JWT Authentication**: Using industry-standard JSON Web Tokens for secure authentication
4. **Safe Network Configuration**: Using proper networking practices for development environments
5. **Cross-Platform Security**: Security considerations for both iOS and Android platforms

## Running the Application

### Backend (FastAPI):

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

3. Run the server:
   ```
   python main.py
   ```
   
   The server will start and be accessible to your application.

### Frontend (React Native):

1. Navigate to the React Native project directory:
   ```
   cd rn_fastapi
   ```

2. Install dependencies:
   ```
   npm install
   ```
   
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the values in `.env` according to your development environment

4. Start the Metro bundler:
   ```
   npm start
   ```

5. Run on Android (in a separate terminal):
   ```
   npm run android
   ```
   
   Or iOS:
   ```
   npm run ios
   ```

## Running on Physical Devices

When running the app on a physical device with Expo Go:

1. Ensure your device and development computer are on the same network
2. Update the `.env` file with appropriate server URLs
3. Do not commit the `.env` file to version control
4. Use the QR code from Expo to open the app on your device

## Test Credentials

You can use these test credentials to log in:

- **Username**: johndoe
- **Password**: password123

## Key Features of this Login System:

1. **JWT Authentication**: Secure token-based authentication
2. **Password Visibility Toggle**: Eye icon to show/hide password
3. **Environment Variables**: Secure configuration management
4. **Automatic Server Discovery**: Tries multiple connection methods
5. **Error Handling**: Clear error messages for login failures
6. **Responsive UI**: Works on different screen sizes
7. **State Management**: Uses Zustand for managing auth state

## Learning Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [JWT Introduction](https://jwt.io/introduction)
- [Zustand State Management](https://github.com/pmndrs/zustand)
- [React Native Environment Variables](https://www.npmjs.com/package/react-native-dotenv)

## Project Structure

```
rn_fastapi/
├── backend/               # FastAPI backend
│   ├── main.py            # Main FastAPI application
│   └── requirements.txt   # Python dependencies
│
└── rn_fastapi/            # React Native frontend
    ├── .env.example       # Example environment variables (safe to commit)
    ├── .env               # Actual environment variables (do not commit)
    ├── navigation/        # Navigation configuration
    ├── screens/           # UI screens
    │   ├── login.tsx      # Login screen
    │   ├── overview.tsx   # Post-login welcome screen
    │   └── details.tsx    # Example details screen
    └── package.json       # JavaScript dependencies
```

## Next Steps for Learning

1. Add a real database instead of the mock user data
2. Implement user registration functionality
3. Add password reset capability
4. Improve security with HTTPS
5. Add form validation
6. Implement protected routes on the backend
7. Add user profile management
