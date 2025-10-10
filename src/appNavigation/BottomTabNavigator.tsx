import {Text, View, TouchableOpacity, Modal} from 'react-native';
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
import React, { useState } from 'react';
import {getWeatherData} from "../weather/WeatherReport";

type WeatherData = {
  current: {
    time: Date;
    temperature_2m: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  daily: {
    sunrise: Date[];
    sunset: Date[];
    temperature_2m_max: Float32Array | null;
    temperature_2m_min: Float32Array | null;
  };
};



const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const {t} = useTranslation();
   const [showWeatherModal, setShowWeatherModal] = useState(false);
   const [weather, setWeather] = useState<WeatherData |null>(null)

const getWeather = async () => {
  try {
    const data = await getWeatherData();
    setWeather(data);
  } catch (error) {
    console.error("Failed to fetch weather:", error);
  }
};

  return (
    <>
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
            <FontAwesome testID="map-screen-tab" name="map-o" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={t('poi')}
        component={PointsOfInterest}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5  testID="points-of-interest-tab" name="map-marked-alt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={t('gear')}
        component={GearScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <AntDesign testID="gear-tab" name="profile" size={size} color={color}/>
          ),
        }}
      />
      <Tab.Screen
        name={t('weather')}
        component={OfflineMapsScreen}
        listeners={{ tabPress: (e) => {
          e.preventDefault();
          getWeather();
          setShowWeatherModal(true);
        }}}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons testID="weather-tab" name="partly-sunny-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>

    <Modal visible={showWeatherModal} transparent animationType="fade">
  <View
    style={{
      flex: 1,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <View
      style={{
        backgroundColor: "white",
        padding: 30,
        borderRadius: 10,
        width: 260,
      }}
    >
      {weather ? (
  <>
    <Text style={{ fontSize: 20, fontWeight: "600", textAlign: "center", marginBottom: 10 }}>
      Weather Report
    </Text>

    <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 5 }}>
      🌡️ {weather.current.temperature_2m.toFixed(1)}°F
    </Text>

    <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 5 }}>
      🌬️ Wind: {weather.current.wind_speed_10m.toFixed(1)} mph
    </Text>

    <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 5 }}>
      🌅 Sunrise: {new Date(weather.daily.sunrise[0]).toLocaleTimeString()}
    </Text>

    <Text style={{ fontSize: 16, textAlign: "center", marginBottom: 15 }}>
      🌇 Sunset: {new Date(weather.daily.sunset[0]).toLocaleTimeString()}
    </Text>
  </>
) : (
  <Text style={{ textAlign: "center" }}>Loading weather...</Text>
)}


      <TouchableOpacity
        onPress={() => setShowWeatherModal(false)}
        style={{
          backgroundColor: "#007AFF",
          padding: 10,
          borderRadius: 5,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "white" }}>Close</Text>
      </TouchableOpacity>
    </View>
  </View>
</Modal>
      </>
    
  );
};

export default BottomTabNavigator;
