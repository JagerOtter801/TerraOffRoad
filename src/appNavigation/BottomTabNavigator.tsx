import {Text, View, TouchableOpacity, Modal} from 'react-native';
import { styles } from "../../styles";
import { FontAwesome5 } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MapScreen from "../screens/MapScreen";
import RoutesTabScreen from "../screens/RouteScreen";
import OfflineMapsScreen from "../screens/OfflineMapsScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from 'react-i18next';
import React, { useState } from 'react';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const {t} = useTranslation();
   const [showWeatherModal, setShowWeatherModal] = useState(false);
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
            <FontAwesome name="map-o" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={t('routes')}
        component={RoutesTabScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="map-marked-alt" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name={t('offline maps')}
        component={OfflineMapsScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cloud-download-outline" size={size} color={color}/>
          ),
        }}
      />
      <Tab.Screen
        name={t('weather')}
        component={OfflineMapsScreen}
        listeners={{ tabPress: (e) => {
          e.preventDefault();
          setShowWeatherModal(true);
        }}}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="partly-sunny-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>

    <Modal
        visible={showWeatherModal}
        transparent={true}
        animationType="fade"
      >
        <View style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <View style={{
            backgroundColor: 'white',
            padding: 30,
            borderRadius: 10,
            width: 250,
          }}>
            <Text style={{ fontSize: 18, marginBottom: 20, textAlign: 'center' }}>
              Weather Modal
            </Text>
            <TouchableOpacity
              onPress={() => setShowWeatherModal(false)}
              style={{
                backgroundColor: '#007AFF',
                padding: 10,
                borderRadius: 5,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: 'white' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      </>
    
  );
};

export default BottomTabNavigator;
