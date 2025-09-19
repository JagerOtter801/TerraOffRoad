import { AuthProvider } from "./src/auth0";
import LoginScreen from "./src/screens/LoginScreen";
import MapTabDrawerScreen from "./src/tabsNavigation/MapTabDrawerScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import './src/localization/i18n/index';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="MapScreen" component={MapTabDrawerScreen} />
          </Stack.Navigator>
        </NavigationContainer>      
      </SafeAreaProvider>
    </AuthProvider>
  );
}