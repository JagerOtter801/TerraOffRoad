import { Platform } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { styles } from "../styles";
import { gpsService, Waypoint, Route, Coordinate } from "../modules/navigation";
import { MapLongPressEvent } from "../modules/navigation/types";
import { useEffect, useState, useRef } from "react";

function MapTabScreen() {
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );

  //ToDo: handle location errors gracefully
  const [locationError, setLocationError] = useState<string | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);

  const mapRef = useRef<any>(null);
  const initialLatitudeDelta = 1.0922;
  const initialLongitudeDelta = 1.0421;
  const currentLatitudeDelta = 0.0922;
  const currentLongitudeDelta = 0.0421;

  const initialRegion = {
    latitude: 40.6197536,
    longitude: -111.8094614,
    latitudeDelta: initialLatitudeDelta,
    longitudeDelta: initialLongitudeDelta,
  };

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

  const handleLocationPress = async () => {
    try {
      const location = await gpsService.getCurrentLocation();
      setCurrentLocation(location);

      // Animate map to current location
      if (mapRef.current) {
        mapRef.current.animateToRegion(
          {
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: currentLatitudeDelta,
            longitudeDelta: currentLongitudeDelta,
          },
          1000
        );
      }
    } catch (error: any) {
      setLocationError(error.message || "Could not get location");
    }
  };

  const createWayPoint = async (event: MapLongPressEvent) => {
    try {
      const { latitude, longitude } = event.nativeEvent.coordinate;
      const coordinate: Coordinate = {
        latitude,
        longitude,
        timestamp: Date.now(),
      };
      await gpsService.addWaypoint(coordinate);
      setWaypoints(gpsService.getAllWaypoints()); 
    } catch (error) {
      console.error("Error handling long press:", error);
    }
  };

  if (Platform.OS === "web") {
    return <Text>Maps not available on web</Text>;
  }

  return (
    <View style={styles.maps_container}>
      <View style={styles.maps_header}>
        <TouchableOpacity
          style={styles.mapsHamburgerMenu}
          onPress={() => {
            /* Handle hamburger menu press */
          }}
        >
          <Text style={styles.mapsHamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, paddingLeft: 20, alignItems: "center" }}>
          <Text style={styles.maps_header_title}>Terra Off-Road</Text>
        </View>

        <View style={{ width: 44 }} />
      </View>

      <MapView
        style={styles.map}
        region={
          currentLocation
            ? {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                longitudeDelta: currentLongitudeDelta,
                latitudeDelta: currentLatitudeDelta,
              }
            : {
                ...initialRegion,
              }
        }
        showsUserLocation={true}
        showsMyLocationButton={Platform.OS === "android"}
        mapType="hybrid"
        onLongPress={createWayPoint}
        ref={mapRef}
      >
        {currentLocation && (
          <Marker
            coordinate={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
            }}
            title="Your Location"
            description="Current GPS position"
            pinColor="red"
          />
        )}

        {gpsService.getAllWaypoints().map((waypoint) => (
          <Marker
            key={waypoint.id}
            coordinate={{
              latitude: waypoint.latitude,
              longitude: waypoint.longitude,
            }}
            title={waypoint.name}
            description={`Added: ${new Date(
              waypoint.timestamp || Date.now()
            ).toLocaleTimeString()}`}
            pinColor="blue"
          />
        ))}
      </MapView>

      {Platform.OS === "ios" && (
        <TouchableOpacity
          style={styles.iosLocationButton}
          onPress={handleLocationPress}
        >
          <Text style={styles.iosLocationButtonText}>📍</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default MapTabScreen;
