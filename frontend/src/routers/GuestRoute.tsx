import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { Spinner } from '@chakra-ui/react';

export const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { authToken, userInfo, loading } = useAuth();

  if (loading) {
    return <Spinner color="teal.500" size="lg" />;
  }

  if (authToken) {
    return <Navigate to={`/profile/${userInfo?.id}`} replace />; // Redirect to home (or dashboard)
  }

  return <>{children}</>;
};
