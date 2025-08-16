import { Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import MapTabScreen from "./MapTabScreen";
import RoutesTabScreen from "./RoutesTabScreen";
import ProfileTabScreen from "./UserProfileTabScreen";
import OfflineMapsScreen from "./OfflineMapsScreen";
import { styles } from "../styles";
import { MaterialIcons } from "@expo/vector-icons";

interface MapsScreenProps {
  user?: any;
}

const Tab = createBottomTabNavigator();

const MapsScreen = ({ user }: MapsScreenProps) => {
  return (
    <NavigationContainer>
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
          children={() => <ProfileTabScreen user={user} />}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="account-circle" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MapsScreen;
