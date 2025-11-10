import {useEffect} from 'react';
import { AuthProvider, useAuth } from "./src/auth0";
import MapTabDrawer from "./src/appNavigation/MapTabDrawer";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import  i18n  from './src/localization/i18n/index';
import * as RNLocalize from 'react-native-localize';
import { AppState, AppStateStatus } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { WeatherBottomSheetProvider } from './src/weather/WeatherBottomSheetContext'

function AppNavigator() {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="MapScreen" component={MapTabDrawer} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {

  //Automatically handle language change/update when application state changes
  useEffect (()=>{
    const handleLanguageChangeListener = (appStatus : AppStateStatus) => {
      if(appStatus === 'active'){
        const newLanguage = RNLocalize.findBestLanguageTag(['en', 'es']);
        if(newLanguage?.languageTag && newLanguage.languageTag !== i18n.language){
          i18n.changeLanguage(newLanguage.languageTag);

        }
      }
    };

    const appStateSubscription = AppState.addEventListener('change', handleLanguageChangeListener);
    return ()=>{
      appStateSubscription?.remove();
    }
  },[]);


  return (
    <AuthProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <WeatherBottomSheetProvider>
            <AppNavigator />
          </WeatherBottomSheetProvider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </AuthProvider>
  );
}