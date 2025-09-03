import { AuthProvider } from "./modules/auth0";
import LoginScreen from "./screens/LoginScreen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <LoginScreen />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
