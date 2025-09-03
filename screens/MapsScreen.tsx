import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapTabScreen from "./MapTabScreen";
import RoutesTabScreen from "./RoutesTabScreen";
import UserProfileTabScreen from "./UserProfileTabScreen";
import OfflineMapsScreen from "./OfflineMapsTabScreen";
import HelpScreen from "./HelpScreen";
import ContactUsScreen from "./ContactUsScreen";
import SettingsScreen from "./SettingsScreen";
import { styles } from "../styles";
import { MaterialIcons } from "@expo/vector-icons";

interface MapsScreenProps {
  user?: any;
}

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabsNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: { ...styles.maps_bottom_tab_navigation },
        tabBarActiveTintColor: "#E5E2E1",
        tabBarInactiveTintColor: "#9E9998",
        tabBarBackground: () => null,
      }}
    >
      <Tab.Screen
        name="Map"
        component={MapTabScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="map" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Routes"
        component={RoutesTabScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="directions" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Offline Maps"
        component={OfflineMapsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="cloud-download" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={UserProfileTabScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="account-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const MapsScreen = ({ user }: MapsScreenProps) => {
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
