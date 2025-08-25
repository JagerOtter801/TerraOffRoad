import { AuthProvider } from "./modules/auth0";
import HomeScreen from "./screens/HomeScreen";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <HomeScreen />
      </SafeAreaProvider>
    </AuthProvider>
  );
}
