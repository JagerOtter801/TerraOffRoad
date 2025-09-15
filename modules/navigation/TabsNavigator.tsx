import { styles } from "../../styles";
import { FontAwesome5 } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MapTabScreen from "../../screens/MapTabScreen";
import RoutesTabScreen from "../../screens/RoutesTabScreen";
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
            <FontAwesome name="map-o" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Routes"
        component={RoutesTabScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map-marked-alt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Offline Maps"
        component={OfflineMapsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="cloud-download" size={size} color={color}/>
          ),
        }}
      />
      <Tab.Screen
        name="Weather"
        component={OfflineMapsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="partly-sunny-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabsNavigator;
