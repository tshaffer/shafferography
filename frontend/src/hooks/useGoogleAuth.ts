import { useState, useEffect } from 'react';

const GOOGLE_AUTH_URL = 'http://localhost:8080/auth/google';
const API_BASE_URL = 'http://localhost:8080';

export const useGoogleAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const saveTokens = (token: string, expiresIn: number, googleId: string) => {
    const expirationTime = Date.now() + expiresIn * 1000;
    localStorage.setItem('googleAccessToken', token);
    localStorage.setItem('tokenExpiration', expirationTime.toString());
    localStorage.setItem('googleId', googleId);
  };

  const isTokenExpired = (): boolean => {
    const expiration = localStorage.getItem('tokenExpiration');
    return !expiration || Date.now() > parseInt(expiration);
  };

  const fetchAccessToken = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/token`, { method: 'GET', credentials: 'include' });
      if (response.ok) {
        const { accessToken, googleId } = await response.json();
        saveTokens(accessToken, 3600, googleId);
        setIsLoggedIn(true);
      } else {
        refreshAccessToken();
      }
    } catch {
      console.error('Error fetching access token');
    }
  };

  const refreshAccessToken = async () => {
    const googleId = localStorage.getItem('googleId');
    if (!googleId) {
      logout();
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ googleId }),
      });
      if (response.ok) {
        const { accessToken, expiresIn } = await response.json();
        saveTokens(accessToken, expiresIn, googleId);
        setIsLoggedIn(true);
        fetchUserProfile();
      } else {
        logout();
      }
    } catch {
      logout();
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/user-profile`, { credentials: 'include' });
      return response.ok ? response.json() : null;
    } catch {
      return null;
    }
  };

  const logout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const expiresIn = params.get('expiresIn');
    const googleId = params.get('googleId');

    if (localStorage.getItem('loggedOut') === 'true') {
      localStorage.removeItem('loggedOut');
      setIsLoggedIn(false);
      return;
    }

    if (googleId && googleId !== localStorage.getItem('googleId')) {
      localStorage.clear();
    }

    if (accessToken && expiresIn && googleId) {
      saveTokens(accessToken, parseInt(expiresIn), googleId);
      setIsLoggedIn(true);
      window.history.replaceState({}, document.title, '/');
    } else if (isTokenExpired()) {
      fetchAccessToken();
    } else {
      setIsLoggedIn(true);
      fetchUserProfile();
    }
  }, []);

  return { isLoggedIn, logout, loginUrl: GOOGLE_AUTH_URL };
};
