import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Coordinate, Waypoint } from "./types";

class GpsService {
  private currentLocation: Coordinate | null = null;
  private waypoints: Waypoint[] = [];
  private locationSubscription: Location.LocationSubscription | null = null;

  private rateLimitingLastLocationCall = 0;
  private readonly RATE_LIMITING_MIN_LOCATION_INTERVAL = 10000;
  private readonly RATE_LIMITING_CACHED_LOCATION_MAX_AGE = 300000;
 
  private cachedPermissionStatus: string | null = null;
  private lastPermissionCheck = 0;
  private readonly PERMISSION_CACHE_DURATION = 60000;

  async requestLocationPermissions(): Promise<boolean> {
    const now = Date.now();
    const cacheIsValid =
      this.cachedPermissionStatus &&
      now - this.lastPermissionCheck < this.PERMISSION_CACHE_DURATION;

    if (cacheIsValid) {
      return this.cachedPermissionStatus === "granted";
    }

    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      this.cachedPermissionStatus = status;
      this.lastPermissionCheck = now;
      return status === "granted";
    } catch (error) {
      console.error("Permission request failed:", error);
      return false;
    }
  }

  async getCurrentLocation(): Promise<Coordinate> {
    const now = Date.now();
    const timeSinceLastCall = now - this.rateLimitingLastLocationCall;

    // If rate limit is in effect, return cached location
    if (timeSinceLastCall < this.RATE_LIMITING_MIN_LOCATION_INTERVAL) {
      if (this.hasFreshCachedLocation(now)) {
        console.log("Rate limited - returning cached location");
        return this.currentLocation!;
      }

      const waitTime = Math.ceil(
        (this.RATE_LIMITING_MIN_LOCATION_INTERVAL - timeSinceLastCall) / 1000
      );
      throw new Error(
        `Please wait ${waitTime} seconds before requesting location again`
      );
    }

    const hasPermission = await this.requestLocationPermissions();
    if (!hasPermission) {
      throw new Error("Location permission denied");
    }

    this.rateLimitingLastLocationCall = now;

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
      timeInterval: 15000,
      distanceInterval: 0,
    });

    this.currentLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      altitude: location.coords.altitude ?? undefined,
      accuracy: location.coords.accuracy ?? undefined,
      heading: location.coords.heading ?? undefined,
      timestamp: now,
    };

    return this.currentLocation;
  }

  private hasFreshCachedLocation(now: number): boolean {
    if (!this.currentLocation) return false;

    const locationAge = now - (this.currentLocation.timestamp ?? 0);
    return locationAge < this.RATE_LIMITING_CACHED_LOCATION_MAX_AGE;
  }

  async startLocationUpdates(
    callback: (location: Coordinate) => void
  ): Promise<boolean> {
    const hasPermission = await this.requestLocationPermissions();
    if (!hasPermission) {
      throw new Error("Location permission denied");
    }

    this.stopLocationUpdates();

    try {
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 15000,
          distanceInterval: 25,
        },
        (location) => {
          const coordinate: Coordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude ?? undefined,
            accuracy: location.coords.accuracy ?? undefined,
            heading: location.coords.heading ?? undefined,
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
    this.locationSubscription?.remove();
    this.locationSubscription = null;
  }

  async addWaypoint(coordinate?: Coordinate, name?: string): Promise<Waypoint> {
    const locationToUse = coordinate ?? this.currentLocation;

    if (!locationToUse) {
      throw new Error("No location available. Get current location first.");
    }

    const waypoint: Waypoint = {
      id: this.generateId(),
      latitude: locationToUse.latitude,
      longitude: locationToUse.longitude,
      timestamp: Date.now(),
      name: name ?? `Pin ${this.waypoints.length + 1}`,
    };

    this.waypoints.push(waypoint);
    await this.saveWaypoints();

    return waypoint;
  }

  async updateWaypointName(
    waypointId: string,
    newName: string
  ): Promise<boolean> {
    const waypoint = this.waypoints.find((w) => w.id === waypointId);

    if (!waypoint) {
      return false;
    }

    waypoint.name = newName;
    await this.saveWaypoints();
    return true;
  }

  getAllWaypoints(): Waypoint[] {
    return [...this.waypoints];
  }

  async loadWaypointsFromStorage(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem("waypoints");
      if (stored) {
        this.waypoints = JSON.parse(stored);
      }
    } catch (error) {
      console.error("Failed to load waypoints:", error);
    }
  }

  async deleteWaypoint(waypointId: string): Promise<boolean> {
    const initialLength = this.waypoints.length;
    this.waypoints = this.waypoints.filter(
      (waypoint) => waypoint.id !== waypointId
    );

    if (this.waypoints.length < initialLength) {
      await this.saveWaypoints();
      return true;
    }

    return false;
  }

  async deleteAllWaypoints(): Promise<void> {
    this.waypoints = [];
    await AsyncStorage.removeItem("waypoints");
  }

  async isLocationEnabled(): Promise<boolean> {
    try {
      return await Location.hasServicesEnabledAsync();
    } catch (error) {
      console.error("Error checking location services:", error);
      return false;
    }
  }

  async getLocationPermissionStatus(): Promise<string> {
    const now = Date.now();
    const cacheIsValid =
      this.cachedPermissionStatus &&
      now - this.lastPermissionCheck < this.PERMISSION_CACHE_DURATION;

    if (cacheIsValid) {
      return this.cachedPermissionStatus!;
    }

    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      this.cachedPermissionStatus = status;
      this.lastPermissionCheck = now;
      return status;
    } catch (error) {
      console.error("Error getting permission status:", error);
      return "undetermined";
    }
  }

  canGetLocation(): boolean {
    const now = Date.now();
    return now - this.rateLimitingLastLocationCall >= this.RATE_LIMITING_MIN_LOCATION_INTERVAL;
  }

  private async saveWaypoints(): Promise<void> {
    try {
      await AsyncStorage.setItem("waypoints", JSON.stringify(this.waypoints));
    } catch (error) {
      console.error("Failed to save waypoints:", error);
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
  }
}

export const gpsService = new GpsService();
