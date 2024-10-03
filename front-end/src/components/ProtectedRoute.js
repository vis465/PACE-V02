import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // Check if user data exists in localStorage
  const user = localStorage.getItem("user");

  if (!user) {
    // Redirect to login page if no user data is found in localStorage
    return <Navigate to="/" />;
  }

  // If user is logged in, render the child components
  return children;
};

export default ProtectedRoute;
