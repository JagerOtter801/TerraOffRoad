import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import TabsNavigator from "../modules/navigation/TabsNavigator";
import HelpScreen from "./HelpScreen";
import ContactUsScreen from "./ContactUsScreen";
import SettingsScreen from "./SettingsScreen";


const Drawer = createDrawerNavigator();

const MapsScreen = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <NavigationContainer>
        <Drawer.Navigator>
          <Drawer.Screen
            name="MainTabs"
            component={TabsNavigator}
            options={{ headerShown: false }}
          />
          <Drawer.Screen name="Settings" component={SettingsScreen} />
          <Drawer.Screen name="Help / FAQs" component={HelpScreen} />
          <Drawer.Screen name="Contact Us" component={ContactUsScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default MapsScreen;
