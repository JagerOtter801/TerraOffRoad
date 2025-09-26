import { styles } from "../../styles";
import { FontAwesome5 } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MapScreen from "../screens/MapScreen";
import GearScreen from "../screens/GearScreen";
import OfflineMapsScreen from "../screens/GearScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from 'react-i18next';
import PointsOfInterest from "../screens/PointsOfInterest";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const {t} = useTranslation();
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
        name={t('map')}
        component={MapScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="map-o" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={t('poi')}
        component={PointsOfInterest}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map-marked-alt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={t('gear')}
        component={GearScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="profile" size={size} color={color}/>
          ),
        }}
      />
      <Tab.Screen
        name={t('weather')}
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

export default BottomTabNavigator;
