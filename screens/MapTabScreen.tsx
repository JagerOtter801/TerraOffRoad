import { Platform } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import { Marker } from "react-native-maps";
import { StatusBar } from "expo-status-bar";
import { styles } from "../styles";
import { gpsService, Waypoint, Route, Coordinate } from "../modules/navigation";
import { useEffect, useState } from "react";

interface MapsScreenProps {
  onBackPress?: () => void;
  user?: any;
}

// Only import maps on mobile
const MapView =
  Platform.OS !== "web" ? require("react-native-maps").default : null;

function MapTabScreen({ onBackPress, user }: MapsScreenProps) {
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);

  const initialRegion = {
    latitude: 40.6197536,
    longitude: -111.8094614,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  const initialLatitudeDelta = 0.0922;
  const initialLongitudeDelta = 0.0421;
  

  useEffect(() => {
    const getLocation = async () => {
      try {
        const isEnabled = await gpsService.isLocationEnabled();
        if (!isEnabled) {
          setLocationError("Location services are disabled");
          return;
        }

        const location = await gpsService.getCurrentLocation();
        setCurrentLocation(location);
        setLocationError(null);
      } catch (error: any) {
        setLocationError(error.message || "Could not get location");
      }
    };

    getLocation();
  }, []);

  if (Platform.OS === "web") {
    return <Text>Maps not available on web</Text>;
  }

  return (
    <View style={styles.maps_container}>
      <View style={styles.maps_header}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.maps_header_title}>Terra Off Road Maps</Text>
        <View style={styles.maps_placeholder} />
      </View>

      <MapView
        style={styles.map}
        region={
          currentLocation
            ? {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                longitudeDelta: initialLatitudeDelta,
                latitudeDelta:initialLongitudeDelta,
              }
            : {
                ...initialRegion,
              }
        }
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="hybrid"
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
            description="Current GPS position"
            pinColor="blue"
          />
        )}

        <Marker
          coordinate={{
            latitude: 39.7391536,
            longitude: -111.8947614,
          }}
          title="Welcome to Terra Off Road!"
          description="Start your adventure here"
        />
      </MapView>
      <StatusBar style="light" />
    </View>
  );
}

export default MapTabScreen;
