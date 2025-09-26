import { createDrawerNavigator } from "@react-navigation/drawer";
import { SafeAreaView } from "react-native-safe-area-context";
import TabsNavigator from "./BottomTabNavigator";
import ProfileStack from "./ProfileStack"
import HelpScreen from "../screens/HelpScreen";
import ContactUsScreen from "../screens/ContactUsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { useTranslation } from 'react-i18next';

const Drawer = createDrawerNavigator();


const MapTabDrawerScreen = () => {
  const {t}= useTranslation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <Drawer.Navigator>
        <Drawer.Screen
          name={t("main menu")}
          component={TabsNavigator}
          options={{ headerShown: false }}
          key="main-tabs"
        />
        <Drawer.Screen name={t("settings")} component={SettingsScreen} />
        <Drawer.Screen name={t("help / faqs")} component={HelpScreen} />
        <Drawer.Screen name={t("contact us")} component={ContactUsScreen} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

export default MapTabDrawerScreen;
