import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ActivityIndicator, Image, TouchableOpacity } from 'react-native';
import { AuthProvider, useAuth } from './modules/auth0';

function AppContent() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0066cc" />
        <Text style={styles.loadingText}>Logging in...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

if (isAuthenticated && user) {
  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Welcome to TerraX Off Road!</Text>
      <Text style={styles.message}>Hello, {user.name}! 🎉</Text>
      <Text style={styles.email}>{user.email}</Text>
      <Text>{user.id}</Text>
      <Text>{JSON.stringify(user)}</Text>
      <Image 
        source={require('./assets/borat.png')}
        style={{ width: 200, height: 100, borderRadius: 50, margin: 50 }} 
        alt="User Avatar" 
      />
      <TouchableOpacity onPress={logout}>
        <Text style={styles.button}>Logout</Text>
      </TouchableOpacity>
      <StatusBar style="auto" />
    </View>
  );
}

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>TerraX Off Road</Text>
        <Text style={styles.subtitle}>Track your adventures</Text>
        <TouchableOpacity onPress={login}>
          <Text style={styles.button}>Login with Auth0</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </View>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2c3e50', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 30,
    color: '#7f8c8d',
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#27ae60',
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
  },
  email: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    color: '#7f8c8d',
  },
  button: {
    backgroundColor: '#0066cc',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
});