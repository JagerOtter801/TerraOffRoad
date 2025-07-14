import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { useState, useEffect } from 'react';
import { REACT_APP_AUTH0_DOMAIN, REACT_APP_AUTH0_CLIENT_ID } from '@env';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Auth0 configuration from .env file
  const auth0Domain = REACT_APP_AUTH0_DOMAIN;
  const auth0ClientId = REACT_APP_AUTH0_CLIENT_ID;

    console.log('Auth0 Domain:', auth0Domain);
  console.log('Auth0 Client ID:', auth0ClientId);
  
  // AuthSession request setup
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: auth0ClientId,
      scopes: ['openid', 'profile'],
      redirectUri: AuthSession.makeRedirectUri({
        scheme: 'terraxoffroad',
      }),
      responseType: AuthSession.ResponseType.Code,
    },
    {
      authorizationEndpoint: `https://${auth0Domain}/authorize`,
    }
  );

  // AuthSession response handling
  useEffect(() => {
    if (response?.type === 'success') {
      setIsLoggedIn(true);
    }
  }, [response]);

  const handleLogin = () => {
    promptAsync();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <View style={styles.container}>
      {isLoggedIn ? (
        <>
          <Text style={styles.welcome}>Welcome to TerraX Off Road!</Text>
          <Text style={styles.message}>You're logged in! 🎉</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <>
          <Text>Open up App.tsx to start working on your app!</Text>
          <Button 
            title="Login with Auth0" 
            onPress={handleLogin}
            disabled={!request}
          />
        </>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
  },
});