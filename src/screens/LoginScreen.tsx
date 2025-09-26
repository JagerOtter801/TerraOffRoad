import { StatusBar } from "expo-status-bar";
import {
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { useAuth } from "../auth0";
import { styles } from "../../styles";
import { useEffect } from "react";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootStackParamList } from "../appNavigation";
import { useTranslation } from 'react-i18next';

const LoginScreen = () => {
  const { user, isLoading, isAuthenticated, login } = useAuth();
  const { t } = useTranslation();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    if (isAuthenticated && user) {
      navigation.reset({
        index: 0,
        routes: [{ name: "MapScreen" }],
      });
    }
  }, [isAuthenticated, user, navigation]);

  if (isLoading) {
    return (
      <ImageBackground style={styles.login_screen_container}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Logging in...</Text>
        <StatusBar style="light" />
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      style={styles.login_screen_container}
      source={require("../../assets/terraoffroad_background_compatability.png")}
    >
      <View testID="login-screen" style={styles.auth0_login_background}>
        <Text style={styles.auth0_login_title}>{t('Terra Off-Road')}</Text>
        <Text style={styles.subauth0_login_title}>{t('slogan')}</Text>
        <TouchableOpacity testID="auth0-login-button" onPress={login}>
          <Text style={styles.auth0_login_button}>{t('login')}</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="light" />
    </ImageBackground>
  );
};

export default LoginScreen;
