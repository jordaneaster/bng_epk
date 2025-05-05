'use client';
import Cookies from 'js-cookie';

const TOKEN_NAME = 'admin_auth_token';
const TOKEN_EXPIRY = 7; // days

// Check if user is authenticated
export const isAuthenticated = () => {
  if (typeof window === 'undefined') return false;
  return !!Cookies.get(TOKEN_NAME);
};

// Sign in function using env variables for credentials
export const signIn = async (username, password) => {
  console.log("Attempting login with:", username);
  
  // Get credentials from env vars
  const validUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
  const validPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  
  // Basic credential validation
  if (username === validUsername && password === validPassword) {
    console.log("Login successful");
    // Generate a simple token (use JWT in production)
    const token = btoa(`${username}:${Date.now()}`);
    
    // Store in cookies
    Cookies.set(TOKEN_NAME, token, { 
      expires: TOKEN_EXPIRY,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return true;
  }
  
  console.log("Login failed: Invalid credentials");
  return false;
};

// Sign out function
export const signOut = () => {
  if (typeof window === 'undefined') return;
  Cookies.remove(TOKEN_NAME);
};

// Get auth token
export const getAuthToken = () => {
  if (typeof window === 'undefined') return null;
  return Cookies.get(TOKEN_NAME);
};
