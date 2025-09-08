import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Coordinate, Waypoint, Route, LocationError } from "./types";

class GpsService {
  private currentLocation: Coordinate | null = null;
  private waypoints: Waypoint[] = [];
  private locationSubscription: Location.LocationSubscription | null = null;

  async requestLocationPermissions(): Promise<boolean> {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return status === "granted";
    } catch (error) {
      console.error("Permission request failed:", error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<Coordinate> {
    try {
      const hasPermission = await this.requestLocationPermissions();
      if (!hasPermission) {
        throw new Error("Location permission denied");
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        timeInterval: 15000,
        distanceInterval: 0,
      });

      const coordinate: Coordinate = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        altitude: location.coords.altitude || undefined,
        accuracy: location.coords.accuracy || undefined,
        heading: location.coords.heading || undefined,
        timestamp: Date.now(),
      };

      this.currentLocation = coordinate;
      return coordinate;
    } catch (error: any) {
      throw {
        code: 1,
        message: error.message || "Could not get current location",
      };
    }
  }

  // Update current location (watch for changes)
  async startLocationUpdates(
    callback: (location: Coordinate) => void
  ): Promise<boolean> {
    try {
      const hasPermission = await this.requestLocationPermissions();
      if (!hasPermission) {
        throw new Error("Location permission denied");
      }

      // Stop any existing subscription
      if (this.locationSubscription) {
        this.locationSubscription.remove();
      }

      // Update location every 5 seconds only if location changes by 10 meters
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, 
          distanceInterval: 10, 
        },
        (location) => {
          const coordinate: Coordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: Date.now(),
          };
          this.currentLocation = coordinate;
          callback(coordinate);
        }
      );

      return true;
    } catch (error) {
      console.error("Location update error:", error);
      return false;
    }
  }

  stopLocationUpdates(): void {
    if (this.locationSubscription) {
      this.locationSubscription.remove();
      this.locationSubscription = null;
    }
  }

  async addWaypoint(coordinate?: Coordinate, name?: string): Promise<Waypoint> {
    const locationToUse = coordinate || this.currentLocation;

    if (!locationToUse) {
      throw new Error("No location available. Get current location first.");
    }

    const waypoint: Waypoint = {
      id: this.generateId(),
      latitude: locationToUse.latitude,
      longitude: locationToUse.longitude,
      timestamp: Date.now(),
      name: name || `Waypoint ${this.waypoints.length + 1}`,
    };

    this.waypoints.push(waypoint);
    return waypoint;
  }

  getAllWaypoints(): Waypoint[] {
    return [...this.waypoints];
  }

  createRouteFromWaypoints(routeName?: string): Route | null {
    if (this.waypoints.length < 2) {
      return null;
    }

    const totalDistance = this.calculateTotalRouteDistance(this.waypoints);

    const route: Route = {
      id: this.generateId(),
      name: routeName || `Route ${new Date().toLocaleDateString()}`,
      waypoints: [...this.waypoints],
      totalDistance,
      createdAt: Date.now(),
    };

    return route;
  }

  calculateDistance(point1: Coordinate, point2: Coordinate): number {
    const earthRadiusInMeters = 6371000; 
    const startLatitudeRad = this.toRadians(point1.latitude);
    const endLatitudeRad = this.toRadians(point2.latitude);
    const latitudeDifferenceRad = this.toRadians(
      point2.latitude - point1.latitude
    );
    const longitudeDifferenceRad = this.toRadians(
      point2.longitude - point1.longitude
    );

    const halfChordLengthSquared =
      Math.sin(latitudeDifferenceRad / 2) *
        Math.sin(latitudeDifferenceRad / 2) +
      Math.cos(startLatitudeRad) *
        Math.cos(endLatitudeRad) *
        Math.sin(longitudeDifferenceRad / 2) *
        Math.sin(longitudeDifferenceRad / 2);

    const angularDistance =
      2 *
      Math.atan2(
        Math.sqrt(halfChordLengthSquared),
        Math.sqrt(1 - halfChordLengthSquared)
      );
    return earthRadiusInMeters * angularDistance; 
  }

  calculateTotalRouteDistance(waypoints: Waypoint[]): number {
    if (waypoints.length < 2) return 0;

    let totalDistance = 0;

    // Distance between each consecutive waypoint
    for (let i = 0; i < waypoints.length - 1; i++) {
      totalDistance += this.calculateDistance(waypoints[i], waypoints[i + 1]);
    }

    // Distance from final waypoint back to first waypoint
    if (waypoints.length > 2) {
      totalDistance += this.calculateDistance(
        waypoints[waypoints.length - 1],
        waypoints[0]
      );
    }

    return totalDistance;
  }

  calculateElevationGain(waypoints: Waypoint[]): { gain: number; loss: number } {
  let totalGain = 0;
  let totalLoss = 0;

  for (let i = 1; i < waypoints.length; i++) {
    const prev = waypoints[i - 1];
    const current = waypoints[i];
    
    if (prev.altitude && current.altitude) {
      const elevationChange = current.altitude - prev.altitude;
      if (elevationChange > 0) {
        totalGain += elevationChange;
      } else {
        totalLoss += Math.abs(elevationChange);
      }
    }
  }

  return { gain: totalGain, loss: totalLoss };
}

  async saveRouteToDeviceStorage(route: Route): Promise<void> {
    try {
      await AsyncStorage.setItem(`route_${route.id}`, JSON.stringify(route));

      const existingRouteIds = await this.getSavedRouteIds();
      existingRouteIds.push(route.id);
      await AsyncStorage.setItem(
        "saved_route_ids",
        JSON.stringify(existingRouteIds)
      );
    } catch (error) {
      throw new Error("Could not save route to storage");
    }
  }

  async loadAllSavedRoutes(): Promise<Route[]> {
    try {
      const routeIds = await this.getSavedRouteIds();
      const routes: Route[] = [];

      for (const routeId of routeIds) {
        const routeJson = await AsyncStorage.getItem(`route_${routeId}`);
        if (routeJson) {
          routes.push(JSON.parse(routeJson));
        }
      }

      return routes;
    } catch (error) {
      console.error("Failed to load routes:", error);
      return [];
    }
  }

  async deleteRoute(routeId: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`route_${routeId}`);

      const existingIds = await this.getSavedRouteIds();
      const updatedIds = existingIds.filter((id) => id !== routeId);
      await AsyncStorage.setItem("saved_route_ids", JSON.stringify(updatedIds));
    } catch (error) {
      throw new Error("Could not delete route");
    }
  }

  async deleteAllRoutes(){
    try {
      const routeIdsJson = await AsyncStorage.getItem('routeIds');
      if(routeIdsJson){
        const routeIds : string [] = JSON.parse(routeIdsJson);
        for(const routeId of routeIds){
          await AsyncStorage.removeItem(`route_${routeId}`);
        }
      }
    } catch (error) {
      console.error("Error clearing user data:", error);
    }
  }

  deleteWaypoint(waypointId: string): boolean {
    const initialLength = this.waypoints.length;
    this.waypoints = this.waypoints.filter(
      (waypoint) => waypoint.id !== waypointId
    );
    return this.waypoints.length < initialLength;
  }

  async deleteAllWaypoints(): Promise<void> {
    try {
      const waypointIdsJson = await AsyncStorage.getItem('waypointIds');
      if (waypointIdsJson) {
        const waypointIds: string[] = JSON.parse(waypointIdsJson);
        for (const waypointId of waypointIds) {
          await AsyncStorage.removeItem(`waypoint_${waypointId}`);
        }
      }
      this.waypoints = [];
    } catch (error) {
      console.error("Error clearing waypoints:", error);
    }
  }

  formatDistance(distanceInMeters: number): string {
    if (distanceInMeters < 1000) {
      return `${Math.round(distanceInMeters)}m`;
    } else {
      return `${(distanceInMeters / 1000).toFixed(2)}km`;
    }
  }

  getDistanceInKilometers(point1: Coordinate, point2: Coordinate): number {
    return this.calculateDistance(point1, point2) / 1000;
  }

  getDistanceInMiles(point1: Coordinate, point2: Coordinate): number {
    return this.calculateDistance(point1, point2) / 1609.344;
  }

  // Check if location services are enabled
  async isLocationEnabled(): Promise<boolean> {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch (error) {
      console.error("Error checking location services:", error);
      return false;
    }
  }

  async getLocationPermissionStatus(): Promise<string> {
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      return status;
    } catch (error) {
      console.error("Error getting permission status:", error);
      return "undetermined";
    }
  }

  private async getSavedRouteIds(): Promise<string[]> {
    const routeIdsJson = await AsyncStorage.getItem("saved_route_ids");
    return routeIdsJson ? JSON.parse(routeIdsJson) : [];
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}


export const gpsService = new GpsService();
