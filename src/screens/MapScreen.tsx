import { Modal, Platform } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import { styles } from "../../styles";
import { gpsService, Waypoint, Route, Coordinate } from "../navigation";
import { MapLongPressEvent } from "../navigation/types";
import { testWeatherApi } from "../weather/WeatherReport";
import { useEffect, useState, useRef } from "react";
import { useNavigation, DrawerActions } from "@react-navigation/native";

const MapScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );
  const [isLocationError, setLocationError] = useState<string | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [isWaypointDeleteDisplayed, setWaypointDeleteModal] =
    useState<boolean>(false);
  const [shouldRenderMap, setShouldRenderMap] = useState(false);

  const navigation = useNavigation();
  const mapRef = useRef<any>(null);

  const initialLatitudeDelta = 1.5;
  const initialLongitudeDelta = 1.5;
  const currentLatitudeDelta = 0.02;
  const currentLongitudeDelta = 0.02;

  const initialRegion = {
    latitude: 40.6197536,
    longitude: -111.8094614,
    latitudeDelta: initialLatitudeDelta,
    longitudeDelta: initialLongitudeDelta,
  };

  // Batched initialization - runs once on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        const isEnabled = await gpsService.isLocationEnabled();
        const allWaypoints = gpsService.getAllWaypoints();

        if (!isEnabled) {
          // Batch these updates
          setLocationError("Location services are disabled");
          setWaypoints(allWaypoints);
          return;
        }

        const location = await gpsService.getCurrentLocation();
        setCurrentLocation(location);
        setLocationError(null);
        setWaypoints(allWaypoints);
      } catch (error: any) {
        const allWaypoints = gpsService.getAllWaypoints();
        setLocationError(error.message || "Could not get location");
        setWaypoints(allWaypoints);
      }
    };

    initializeData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRenderMap(true);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleLocationPress = async () => {
    try {
      // Check if current location is recent and use if it is
      const now = Date.now();
      if (
        currentLocation &&
        typeof currentLocation.timestamp === "number" &&
        now - currentLocation.timestamp < 30000
      ) {
        if (mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: currentLatitudeDelta,
              longitudeDelta: currentLongitudeDelta,
            },
            1000
          );
        }
        return;
      }

      const location = await gpsService.getCurrentLocation();
      setCurrentLocation(location);

      // Animate to the new location
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

  return (
    <View style={styles.maps_container}>
      <View style={styles.maps_header}>
        <TouchableOpacity
          style={styles.mapsHamburgerMenu}
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <Text style={styles.mapsHamburgerIcon}>☰</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, paddingLeft: 20, alignItems: "center" }}>
          <Text style={styles.maps_header_title}>Terra Off-Road</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {shouldRenderMap && (
        <MapView
          key="main-map"
          testID="map-tab-screen"
          style={styles.map}
          region={
            currentLocation
              ? {
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  longitudeDelta: currentLatitudeDelta,
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
          onDoublePress={() => setWaypointDeleteModal(true)}
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

          {waypoints.map((waypoint) => (
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
      )}

      <Modal
        visible={!!isWaypointDeleteDisplayed}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.userOptionsModal}>
          <Text>Confirm Delete All Waypoints?</Text>
          <TouchableOpacity
            style={[styles.modalButtons, { backgroundColor: "#8a8279" }]}
            onPress={async () => {
              gpsService.deleteAllWaypoints();
              setWaypoints([]);
              setWaypointDeleteModal(false);
            }}
          >
            <Text>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.modalButtons, { backgroundColor: "lightgray" }]}
            onPress={() => setWaypointDeleteModal(false)}
          >
            <Text>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </Modal>

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
};

export default MapScreen;
