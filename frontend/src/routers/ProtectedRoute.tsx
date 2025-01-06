import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { Spinner } from '@chakra-ui/react';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authToken, loading } = useAuth(); // Get authToken directly from useAuth

  if (loading) {
    return <Spinner color="teal.500" size="lg" />;
  }
  if (!authToken) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
