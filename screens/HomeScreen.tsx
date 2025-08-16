import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useAuth } from "../modules/auth0";
import { styles } from "../styles";
import MapsScreen from "./MapsScreen";

export default function HomeScreen() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  if (isLoading) {
    return (
      <ImageBackground
        style={styles.home_screen_container}
        source={require("../assets/terraoffroad_background_compatability.png")}
      >
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Logging in...</Text>
        <StatusBar style="light" />
      </ImageBackground>
    );
  }

  if (isAuthenticated && user) {
    return <MapsScreen user={user} />;
  }

  return (
    <ImageBackground
      style={styles.home_screen_container}
      source={require("../assets/terraoffroad_background_compatability.png")}
    >
      <View style={styles.auth0_login_background}>
        <Text style={styles.auth0_login_title}>Terra Off-Road</Text>
        <Text style={styles.subauth0_login_title}>Track your adventures</Text>
        <TouchableOpacity testID="auth0-login-button" onPress={login}>
          <Text style={styles.auth0_login_button}>Login with Auth0</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </ImageBackground>
  );
}
