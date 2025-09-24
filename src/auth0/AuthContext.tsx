import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import * as AuthSession from "expo-auth-session";
import { REACT_APP_AUTH0_DOMAIN, REACT_APP_AUTH0_CLIENT_ID } from "@env";
import { User, AuthContextType } from "./types";
import { gpsService } from "../gpsNavigation";
import * as Keychain from "react-native-keychain";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const SKIP_AUTH0 = true;
  const SKIP_USER_ID = "user_";
  const SKIP_EMAIL = "user@terraoffroad.com";
  const SKIP_NAME = "Off-Road Explorer";
  const auth0Domain = REACT_APP_AUTH0_DOMAIN;
  const auth0ClientId = REACT_APP_AUTH0_CLIENT_ID;

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: auth0ClientId,
      scopes: ["openid", "profile", "email"],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: "terraoffroad",
      }),
      responseType: AuthSession.ResponseType.Code,
    },
    {
      authorizationEndpoint: `https://${auth0Domain}/authorize`,
    }
  );

  const login = () => {
    setIsLoading(true);

    if (SKIP_AUTH0) {
      setTimeout(() => {
        const newUser = {
          id: SKIP_USER_ID + Date.now(),
          email: SKIP_EMAIL,
          name: SKIP_NAME,
        };

        setUser(newUser);
        setIsLoading(false);
      }, 500);
    }

    //promptAsync();

    //  TODO: Use this as a guide for when I want to store JWT securely aka encrypted
    //     import * as Keychain from 'react-native-keychain';

    // // Store token
    // await Keychain.setInternetCredentials('myapp', 'token', jwtToken);

    // // Retrieve token
    // const credentials = await Keychain.getInternetCredentials('myapp');
    // if (credentials) {
    //   const token = credentials.password;
    // }
  };

  const logout = async () => {
    const logoutUrl = `https://${auth0Domain}/v2/logout?client_id=${auth0ClientId}&returnTo=${encodeURIComponent(
      AuthSession.makeRedirectUri({ scheme: "terraoffroad" })
    )}`;

    setIsLoading(false);
    setUser(null);
    setIsLoading(false);
  };

  function clearAllData() {
    gpsService.deleteAllWaypoints();
    gpsService.deleteAllRoutes();
    gpsService.stopLocationUpdates();
    AsyncStorage.clear();
  }

  useEffect(() => {
    if (response?.type === "success") {
      // Create a mock user object for demonstration purposes.
      setUser({
        id: SKIP_USER_ID + Date.now(),
        email: SKIP_EMAIL,
        name: SKIP_NAME,
      });
      setIsLoading(false);
    } else if (response?.type === "error") {
      setIsLoading(false);
      console.error("Auth error:", response.error);
    }
  }, [response]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
