import { StatusBar } from 'expo-status-bar';
import { Text, View, ActivityIndicator, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { useAuth } from '../modules/auth0'; 
import {styles} from '../styles';

export default function HomeScreen() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  if (isLoading) {
    return (
      <ImageBackground style={styles.home_screen_container} source={require('../assets/terraoffroad_background_compatability.png')}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Logging in...</Text>
        <StatusBar style="auto" />
      </ImageBackground>
    );
  }

  if (isAuthenticated && user) {
    return (
      <ImageBackground style={styles.home_screen_container} source={require('../assets/terraoffroad_background_compatability.png')}>
        <Text style={styles.authenticated_homescreen_title}>authenticated_homescreen_title
           to TerraX Off Road!</Text>
        <Text>{user.id}</Text>
        <Text>{JSON.stringify(user)}</Text>
        <Image 
          source={require('../assets/borat.png')} 
          style={{ width: 200, height: 100, borderRadius: 50, margin: 50 }} 
          alt="User Avatar" 
        />
        <TouchableOpacity onPress={logout}>
          <Text style={styles.button}>Logout</Text>
        </TouchableOpacity>
        <StatusBar style="auto" />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground style={styles.home_screen_container} source={require('../assets/terraoffroad_background_compatability.png')}>
      <View style={styles.auth0_login_background


      }>
        <Text style={styles.auth0_login_title

        }>TerraX Off Road</Text>
        <Text style={styles.subauth0_login_title

        }>Track your adventures</Text>
        <TouchableOpacity onPress={login}>
          <Text style={styles.button}>Login with Auth0</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </ImageBackground>
  );
}


