import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import TabsNavigator from "./TabsNavigator";
import UserProfileScreen from "../screens/UserProfileScreen";
import HelpScreen from "../screens/HelpScreen";
import ContactUsScreen from "../screens/ContactUsScreen";
import SettingsScreen from "../screens/SettingsScreen";


const Drawer = createDrawerNavigator();

const MapTabDrawerScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <Drawer.Navigator>
        <Drawer.Screen
          name="MainTabs"
          component={TabsNavigator}
          options={{ headerShown: false }}
          key="main-tabs"
        />
        <Drawer.Screen name="Profile" component={UserProfileScreen}/>
        <Drawer.Screen name="Settings" component={SettingsScreen} />
        <Drawer.Screen name="Help / FAQs" component={HelpScreen} />
        <Drawer.Screen name="Contact Us" component={ContactUsScreen} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

export default MapTabDrawerScreen;
