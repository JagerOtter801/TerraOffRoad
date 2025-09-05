

import { styles } from "../../styles"
import { MaterialIcons } from "@expo/vector-icons";
import MapTabScreen from "../../screens/MapTabScreen";
import RoutesTabScreen from "../../screens/RoutesTabScreen";
import UserProfileTabScreen from "../../screens/UserProfileTabScreen";
import OfflineMapsScreen from "./../../screens/OfflineMapsTabScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Tab = createBottomTabNavigator();

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

export default TabsNavigator;