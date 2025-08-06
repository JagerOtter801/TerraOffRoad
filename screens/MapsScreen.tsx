import { Platform } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import MapTabScreen from "./MapTabScreen";
import RoutesTabScreen from "./RoutesTabScreen";
import ProfileTabScreen from "./UserProfileTabScreen";
import {styles} from "../styles";

interface MapsScreenProps {
  onBackPress?: () => void;
  user?: any;
}

const Tab = createBottomTabNavigator();

const MapsScreen = ({ onBackPress, user }: MapsScreenProps) => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: {...styles.maps_bottom_tab_navigation,
          },
          tabBarBackground: () => null,
        }}
      >
        <Tab.Screen
          name="Map"
          children={() => (
            <MapTabScreen onBackPress={onBackPress} user={user} />
          )}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>🗺️</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Routes"
          component={RoutesTabScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>🛣️</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          children={() => (
            <ProfileTabScreen onBackPress={onBackPress} user={user} />
          )}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color, fontSize: size }}>👤</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default MapsScreen;
