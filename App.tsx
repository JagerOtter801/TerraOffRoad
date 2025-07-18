import { AuthProvider } from './modules/auth0';
import HomeScreen from './screens/HomeScreen'

export default function App() {
  return (
    <AuthProvider>
      <HomeScreen />
    </AuthProvider>
  );
}
