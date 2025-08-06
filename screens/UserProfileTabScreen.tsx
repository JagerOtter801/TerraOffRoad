import { Platform } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Marker } from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import { styles } from "../styles";
import { gpsService, Waypoint, Route, Coordinate } from '../modules/navigation';
import { useEffect, useState } from "react";

interface MapsScreenProps {
  onBackPress?: () => void;
  user?: any;
}

function ProfileTabScreen({ onBackPress, user }: MapsScreenProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Profile</Text>
      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
      <TouchableOpacity 
        onPress={onBackPress} 
        style={{ marginTop: 30, padding: 15, backgroundColor: '#ff4444', borderRadius: 8 }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ProfileTabScreen