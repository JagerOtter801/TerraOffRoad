import { styles } from "../../styles";
import { FontAwesome5 } from "@expo/vector-icons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MapScreen from "../screens/MapScreen";
import GearScreen from "../screens/GearScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import PointsOfInterest from "../screens/PointsOfInterestScreen";
import { useWeatherBottomSheet } from "../weather/WeatherBottomSheetContext";

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const { t } = useTranslation();
  const { openWeatherSheet, closeWeatherSheet } = useWeatherBottomSheet();

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: styles.maps_bottom_tab_navigation,
          tabBarActiveTintColor: "#E5E2E1",
          tabBarInactiveTintColor: "#9E9998",
          tabBarBackground: () => null,
        }}
      >
        <Tab.Screen
          name={t("map")}
          component={MapScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome
                testID="map-screen-tab"
                name="map-o"
                size={size}
                color={color}
              />
            ),
          }}
          listeners={() => ({
            tabPress: () => {
              closeWeatherSheet();
            },
          })}
        />
        <Tab.Screen
          name={t("poi")}
          component={PointsOfInterest}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <FontAwesome5
                testID="points-of-interest-tab"
                name="map-marked-alt"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name={t("gear")}
          component={GearScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <AntDesign
                testID="gear-tab"
                name="profile"
                size={size}
                color={color}
              />
            ),
          }}
        />
        <Tab.Screen
          name={t("weather")}
          component={MapScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                testID="weather-tab"
                name="partly-sunny-outline"
                size={size}
                color={color}
              />
            ),
          }}
          listeners={({ navigation }) => ({
            tabPress: (e) => {
              e.preventDefault();
              openWeatherSheet();
              navigation.navigate(t("map"));
            },
          })}
        />
      </Tab.Navigator>
    </>
  );
};

export default BottomTabNavigator;
