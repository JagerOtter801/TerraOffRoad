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
import { gpsService } from "../navigation";
import * as SecureStore from "expo-secure-store";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Auth0 configuration to skip for now until authentication is needed
  const SKIP_AUTH0 = true;
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

  const clearAllData = async ()=> {
    gpsService.deleteAllWaypoints();
    gpsService.deleteAllRoutes();
    gpsService.stopLocationUpdates();
    await SecureStore.deleteItemAsync('userToken');
  }


const login = () => {
  setIsLoading(true);

  if (SKIP_AUTH0) {
    setTimeout(() => {
      
      const newUser = {
        id: "user_" + Date.now(),
        email: "user@terraoffroad.com",
        name: "Off-Road Explorer",
      };
      
      setUser(newUser);
      setIsLoading(false);
    }, 500);
    return;
  }

  promptAsync();
};

  const logout = async () => {
    if (SKIP_AUTH0) {
      setUser(null);
      setIsLoading(false);
      clearAllData();
      return;
    }

    setIsLoading(true);

    const logoutUrl = `https://${auth0Domain}/v2/logout?client_id=${auth0ClientId}&returnTo=${encodeURIComponent(
      AuthSession.makeRedirectUri({ scheme: "terraoffroad" })
    )}`;
    setUser(null);
    setIsLoading(false);
  };

  useEffect(() => {
    // Handle the authentication response using mock data for demonstration purposes.
    if (response?.type === "success") {
      // Create a mock user object for demonstration purposes.
      setUser({
        id: "user_" + Date.now(),
        email: "user@terraoffroad.com",
        name: "Off-Road Explorer",
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
