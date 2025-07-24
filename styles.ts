import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  home_screen_container
  : {
    flex: 1,
    backgroundColor: '#2c3e50', 
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  auth0_login_background: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    borderRadius: 15,
    padding: 30,
    alignItems: 'center',
    width: '100%',
    maxWidth: 300,
  },
  auth0_login_title
  : {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2c3e50',
  },
  subauth0_login_title
  : {
    fontSize: 16,
    marginBottom: 30,
    color: '#7f8c8d',
  },
  authenticated_homescreen_title: {
    fontSize: 2,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#27ae60',
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

