import { Alert, Modal, TextInput } from "react-native";
import { View, Text, TouchableOpacity } from "react-native";
import MapView, { UrlTile, Marker } from "react-native-maps";
import { styles } from "../../styles";
import { MaterialIcons } from "@expo/vector-icons";
import { gpsService, Waypoint, Coordinate } from "../gps";
import { MapLongPressEvent } from "../gps/types";

import { useEffect, useState, useRef } from "react";
import { useNavigation, DrawerActions } from "@react-navigation/native";

const MapScreen = () => {
  const [currentLocation, setCurrentLocation] = useState<Coordinate | null>(
    null
  );
  const [isLocationError, setLocationError] = useState<string | null>(null);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([]);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(
    null
  );
  const [isWaypointMenuVisible, setWaypointMenuVisible] =
    useState<boolean>(false);
  const [isEditingWaypoint, setEditingWaypoint] = useState<boolean>(false);
  const [editedWaypointName, setEditedWaypointName] = useState<string>("");
  const [isDeleteAllWaypointsDisplayed, setVisibleDeleteAllWaypointsModal] =
    useState<boolean>(false);
  const [isConfirmDeleteWaypointVisible, setConfirmDeleteWaypointVisiblity] =
    useState<boolean>(false);
  const [shouldRenderMap, setShouldRenderMap] = useState(false);

  const navigation = useNavigation();
  const mapRef = useRef<MapView>(null);

  const initialLatitudeDelta = 0.5;
  const initialLongitudeDelta = 0.5;
  const currentLatitudeDelta = 0.02;
  const currentLongitudeDelta = 0.02;

  const initialRegion = {
    latitude: 40.6197536,
    longitude: -111.8094614,
    latitudeDelta: initialLatitudeDelta,
    longitudeDelta: initialLongitudeDelta,
  };

  useEffect(() => {
    const initializeData = async () => {
      try {
        const isEnabled = await gpsService.isLocationEnabled();
        const allWaypoints = gpsService.getAllWaypoints();

        if (!isEnabled) {
          setLocationError("Location services are disabled");
          setWaypoints(allWaypoints);
          return;
        }

        const location = await gpsService.getCurrentLocation();
        setCurrentLocation(location);
        setLocationError(null);
        setWaypoints(allWaypoints);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Could not get location";
        const allWaypoints = gpsService.getAllWaypoints();
        setLocationError(errorMessage);
        setWaypoints(allWaypoints);
      }
    };

    initializeData();
  }, []);

  // Avoid showing a blank or laggy map immediately
  // while Async location retreival runs
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldRenderMap(true);
    }, 800);
    return () =>
      // Prevent memory leak/unwanted state updates
      clearTimeout(timer);
  }, []);

  const handleLocationPress = async () => {
    try {
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

  const handleWaypointMenu = () => {
    if (waypoints.length <= 0) {
      Alert.alert("There are no waypoints selected or waypoints created.");
      return;
    }
    setSelectedWaypoint(selectedWaypoint);
    setWaypointMenuVisible(true);
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

  const handleEditWaypoint = () => {
    if (selectedWaypoint) {
      setEditedWaypointName(selectedWaypoint.name || "");
      setEditingWaypoint(true);
      setWaypointMenuVisible(false);
    }
  };

  const saveWaypointEdit = async () => {
    if (selectedWaypoint && editedWaypointName.trim()) {
      const success = await gpsService.updateWaypointName(
        selectedWaypoint.id,
        editedWaypointName.trim()
      );
      if (success) {
        setWaypoints(gpsService.getAllWaypoints());
      }
    }
    setEditingWaypoint(false);
    setSelectedWaypoint(null);
    setEditedWaypointName("");
  };

  const handleDeleteWaypoint = () => {
    if (selectedWaypoint) {
      setWaypointMenuVisible(false);
      setConfirmDeleteWaypointVisiblity(true);
    }
  };

  const handleDeleteAllWaypoints = () => {
    setWaypointMenuVisible(false);
    setSelectedWaypoint(null);
    setVisibleDeleteAllWaypointsModal(true);
  };

  const handleMarkerShortPress = (waypoint: Waypoint) => {
    setSelectedWaypoint(waypoint);
  };

  return (
    <View style={styles.maps_container}>
      <View style={styles.floatingHeader}>
        <TouchableOpacity
          testID="hamburger-menu-button"
          accessibilityLabel="hamburger-menu-button"
          style={styles.floatingHamburgerMenu}
          onPress={() => {
            navigation.dispatch(DrawerActions.openDrawer());
          }}
        >
          <Text style={styles.mapsHamburgerIcon}>☰</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        testID="location-button"
        accessibilityLabel="location-button"
        style={styles.floatingLocationButton}
        onPress={handleLocationPress}
      >
        <MaterialIcons
          name="my-location"
          size={24}
          color="rgba(60, 58, 58, 0.9)"
        />
      </TouchableOpacity>
      <TouchableOpacity
        testID="waypoint-menu-button"
        accessibilityLabel="waypoint-menu-button"
        style={styles.floatingWaypointButton}
        onPress={handleWaypointMenu}
      >
        <MaterialIcons name="list" size={24} color="rgba(60, 58, 58, 0.9)" />
      </TouchableOpacity>
      {shouldRenderMap && (
        <MapView
          key="main-map"
          testID="map-view"
          accessibilityLabel="map-view"
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
          showsMyLocationButton={false}
          toolbarEnabled={false}
          mapType="none"
          onLongPress={createWayPoint}
          ref={mapRef}
        >
          <UrlTile
            urlTemplate="https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            maximumZ={17}
            flipY={false}
          />

          {currentLocation && (
            <Marker
              testID="current-location-marker"
              accessibilityLabel="current-location-marker"
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
              testID={`waypoint-marker-${waypoint.id}`}
              accessibilityLabel={`waypoint-marker-${waypoint.id}`}
              coordinate={{
                latitude: waypoint.latitude,
                longitude: waypoint.longitude,
              }}
              title={waypoint.name}
              description={`Added: ${new Date(
                waypoint.timestamp || Date.now()
              ).toLocaleTimeString()}`}
              pinColor="blue"
              onPress={() => handleMarkerShortPress(waypoint)}
            />
          ))}
        </MapView>
      )}

      {/* Waypoint Menu Modal */}
      <Modal
        visible={isWaypointMenuVisible}
        transparent={true}
        animationType="fade"
        testID="waypoint-menu-modal"
        accessibilityLabel="waypoint-menu-modal"
      >
        <View style={styles.userOptionsModal}>
          <Text style={styles.waypointMenuModalTitle}>
            {selectedWaypoint?.name || "Waypoint"}
          </Text>

          <TouchableOpacity
            testID="edit-waypoint-button"
            accessibilityLabel="edit-waypoint-button"
            style={[styles.modalButtons, styles.modalButtonGreen]}
            onPress={handleEditWaypoint}
          >
            <Text style={styles.waypointMenuButtonText}>Edit Name</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="delete-single-waypoint-button"
            accessibilityLabel="delete-single-waypoint-button"
            style={[styles.modalButtons, styles.modalButtonOrange]}
            onPress={handleDeleteWaypoint}
          >
            <Text style={styles.waypointMenuButtonText}>
              Delete This Waypoint
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="delete-all-waypoints-button"
            accessibilityLabel="delete-all-waypoints-button"
            style={[styles.modalButtons, styles.modalButtonRed]}
            onPress={handleDeleteAllWaypoints}
          >
            <Text style={styles.waypointMenuButtonText}>
              Delete All Waypoints
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="waypoint-menu-cancel-button"
            accessibilityLabel="waypoint-menu-cancel-button"
            style={[styles.modalButtons, styles.modalButtonGray]}
            onPress={() => {
              setWaypointMenuVisible(false);
              setSelectedWaypoint(null);
            }}
          >
            <Text style={styles.waypointMenuButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Edit Waypoint Modal */}
      <Modal
        visible={isEditingWaypoint}
        transparent={true}
        animationType="fade"
        testID="edit-waypoint-modal"
        accessibilityLabel="edit-waypoint-modal"
      >
        <View style={styles.userOptionsModal}>
          <Text style={styles.editWaypointModalTitle}>Edit Waypoint Name</Text>

          <TextInput
            testID="edit-waypoint-input"
            accessibilityLabel="edit-waypoint-input"
            style={styles.editWaypointTextInput}
            value={editedWaypointName}
            onChangeText={setEditedWaypointName}
            placeholder="Enter waypoint name"
            autoFocus={true}
            selectTextOnFocus={true}
          />

          <TouchableOpacity
            testID="save-waypoint-button"
            accessibilityLabel="save-waypoint-button"
            style={[styles.modalButtons, styles.modalButtonGreen]}
            onPress={saveWaypointEdit}
          >
            <Text style={styles.editWaypointButtonText}>Save</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="cancel-edit-waypoint-button"
            accessibilityLabel="cancel-edit-waypoint-button"
            style={[styles.modalButtons, styles.modalButtonGray]}
            onPress={() => {
              setEditingWaypoint(false);
              setSelectedWaypoint(null);
              setEditedWaypointName("");
            }}
          >
            <Text style={styles.editWaypointButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Delete All Waypoints Confirmation Modal */}
      <Modal
        visible={!!isDeleteAllWaypointsDisplayed}
        transparent={true}
        animationType="fade"
        testID="delete-all-waypoints-modal"
        accessibilityLabel="delete-all-waypoints-modal"
      >
        <View style={styles.userOptionsModal}>
          <Text style={styles.deleteAllWaypointsModalTitle}>
            Confirm Delete All Waypoints?
          </Text>
          <Text style={styles.deleteAllWaypointsSubtext}>
            This will permanently delete all {waypoints.length} waypoints.
          </Text>

          <TouchableOpacity
            testID="confirm-delete-all-button"
            accessibilityLabel="confirm-delete-all-button"
            style={[styles.modalButtons, styles.modalButtonRed]}
            onPress={async () => {
              await gpsService.deleteAllWaypoints();
              setWaypoints([]);
              setVisibleDeleteAllWaypointsModal(false);
            }}
          >
            <Text style={styles.deleteAllWaypointsButtonText}>Delete All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="cancel-delete-all-button"
            accessibilityLabel="cancel-delete-all-button"
            style={[styles.modalButtons, styles.modalButtonGray]}
            onPress={() => setVisibleDeleteAllWaypointsModal(false)}
          >
            <Text style={styles.deleteAllWaypointsButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Delete Single Waypoint Confirmation Modal */}
      <Modal
        visible={!!isConfirmDeleteWaypointVisible}
        transparent={true}
        animationType="fade"
        testID="confirm-delete-waypoint-modal"
        accessibilityLabel="confirm-delete-waypoint-modal"
      >
        <View style={styles.userOptionsModal}>
          <Text style={styles.deleteAllWaypointsModalTitle}>
            Confirm Delete Waypoint?
          </Text>
          <Text style={styles.deleteAllWaypointsSubtext}>
            This will permanently delete waypoint
          </Text>

          <TouchableOpacity
            testID="confirm-delete-waypoint-button"
            accessibilityLabel="confirm-delete-waypoint-button"
            style={[styles.modalButtons, styles.modalButtonRed]}
            onPress={async () => {
              if (selectedWaypoint) {
                gpsService.deleteWaypoint(selectedWaypoint.id);
                setWaypoints(gpsService.getAllWaypoints());
                setConfirmDeleteWaypointVisiblity(false);
                setSelectedWaypoint(null);
              }
            }}
          >
            <Text style={styles.deleteAllWaypointsButtonText}>
              Delete Waypoint
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            testID="cancel-delete-waypoint-button"
            accessibilityLabel="cancel-delete-waypoint-button"
            style={[styles.modalButtons, styles.modalButtonGray]}
            onPress={() => {
              setConfirmDeleteWaypointVisiblity(false);
              setSelectedWaypoint(null);
            }}
          >
            <Text style={styles.deleteAllWaypointsButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default MapScreen;