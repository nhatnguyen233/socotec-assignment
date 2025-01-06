import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    id: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('userInfo');
    if (token) {
      setAuthToken(token);
    }
    if (user) {
      setUserInfo(JSON.parse(user));
    }
    setLoading(false);
  }, []);

  return { authToken, userInfo, loading };
};
