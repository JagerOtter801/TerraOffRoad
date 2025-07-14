import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as AuthSession from 'expo-auth-session';
import { REACT_APP_AUTH0_DOMAIN, REACT_APP_AUTH0_CLIENT_ID } from '@env';
import { User, AuthContextType } from './types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auth0 configuration
  const auth0Domain = REACT_APP_AUTH0_DOMAIN;
  const auth0ClientId = REACT_APP_AUTH0_CLIENT_ID;

  
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: auth0ClientId,
      scopes: ['openid', 'profile', 'email'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'terraxoffroad',
      }),
      responseType: AuthSession.ResponseType.Code,
    },
    {
      authorizationEndpoint: `https://${auth0Domain}/authorize`,
    }
  );

  // Handle auth response
  useEffect(() => {
    if (response?.type === 'success') {
     // TBD Future: exchange the code for tokens and get real user data
      setUser({
        id: 'user_' + Date.now(),
        email: 'user@terraxoffroad.com',
        name: 'Off-Road Explorer'
      });
      setIsLoading(false);
    } else if (response?.type === 'error') {
      setIsLoading(false);
      console.error('Auth error:', response.error);
    }
  }, [response]);

  const login = () => {
    setIsLoading(true);
    promptAsync();
  };

  const logout = () => {
    setUser(null);
    setIsLoading(false);
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};