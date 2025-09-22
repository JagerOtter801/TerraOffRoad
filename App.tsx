import {useEffect} from 'react';
import { AuthProvider } from "./src/auth0";
import LoginScreen from "./src/screens/LoginScreen";
import MapTabDrawerScreen from "./src/tabsNavigation/MapTabDrawerScreen";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import  i18n from './src/localization/i18n/index';
import * as RNLocalize from 'react-native-localize';
import { AppState, AppStateStatus } from 'react-native';

const Stack = createNativeStackNavigator();

export default function App() {

  // Localization automatic handle language change dynamically
  useEffect (()=>{
    const handleLanguageChangeListener = (appStatus : AppStateStatus) => {
      if(appStatus === 'active'){
        const newLanguage = RNLocalize.findBestLanguageTag(['en', 'es']);
        if(newLanguage?.languageTag && newLanguage.languageTag !== i18n.language){
          i18n.changeLanguage(newLanguage.languageTag);

        }
      }
    };

    // Call function when app state changes
    const subscription = AppState.addEventListener('change', handleLanguageChangeListener);
    return ()=>{
      subscription?.remove();
    }
  },[]);


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