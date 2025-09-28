import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Coordinate, Waypoint } from "./types";

class GpsService {
  private currentLocation: Coordinate | null = null;
  private waypoints: Waypoint[] = [];
  private locationSubscription: Location.LocationSubscription | null = null;
  
  // Simple rate limiting - prevent rapid successive calls
  private lastLocationCall = 0;
  private lastPOICall = 0;
  private lastWeatherCall = 0;
  
  private readonly MIN_LOCATION_INTERVAL = 10000; // 10 seconds
  private readonly MIN_POI_INTERVAL = 10000; // 10 seconds for POI searches
  private readonly MIN_WEATHER_INTERVAL = 30000; // 30 seconds for weather
  
  private cachedPermissionStatus: string | null = null;
  private lastPermissionCheck = 0;
  private readonly PERMISSION_CACHE_DURATION = 60000; // 1 minute

  async requestLocationPermissions(): Promise<boolean> {
    const now = Date.now();
    
 
    if (this.cachedPermissionStatus && (now - this.lastPermissionCheck) < this.PERMISSION_CACHE_DURATION) {
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
    
    // Check rate limit
    if (now - this.lastLocationCall < this.MIN_LOCATION_INTERVAL) {
      // Return cached location if available and recent (within 5 minutes)
      if (
        this.currentLocation &&
        typeof this.currentLocation.timestamp === "number" &&
        (now - this.currentLocation.timestamp) < 300000
      ) {
        console.log("Rate limited - returning cached location");
        return this.currentLocation;
      }
      const waitTime = Math.ceil((this.MIN_LOCATION_INTERVAL - (now - this.lastLocationCall)) / 1000);
      throw new Error(`Please wait ${waitTime} seconds before requesting location again`);
    }

    try {
      const hasPermission = await this.requestLocationPermissions();
      if (!hasPermission) {
        throw new Error("Location permission denied");
      }

      this.lastLocationCall = now;

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
        timestamp: now,
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

  // Search for Points of Interest with rate limiting
  async searchPOI(category: string, bounds: any): Promise<any[]> {
    const now = Date.now();
    
    // Check rate limit
    if (now - this.lastPOICall < this.MIN_POI_INTERVAL) {
      const waitTime = Math.ceil((this.MIN_POI_INTERVAL - (now - this.lastPOICall)) / 1000);
      throw new Error(`Please wait ${waitTime} seconds before searching again`);
    }

    this.lastPOICall = now;

    try {
      const overpassUrl = 'https://overpass-api.de/api/interpreter';
      
      // Map category to Overpass query
      const categoryMap: { [key: string]: string } = {
        gas: 'fuel',
        hospital: 'hospital',
        grocery: 'supermarket',
        mechanic: 'car_repair',
        restroom: 'toilets'
      };

      const amenity = categoryMap[category] || category;
      
      const query = `
        [out:json][timeout:25];
        (
          node["amenity"="${amenity}"](${bounds.south},${bounds.west},${bounds.north},${bounds.east});
        );
        out;
      `;
      
      const response = await fetch(overpassUrl, {
        method: 'POST',
        body: `data=${encodeURIComponent(query)}`,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });
      
      if (!response.ok) {
        throw new Error(`POI search failed: ${response.status}`);
      }
      
      const data = await response.json();
      return data.elements || [];
    } catch (error: any) {
      console.error('POI search failed:', error);
      throw new Error(error.message || 'Failed to search for points of interest');
    }
  }

  /**
   * Get weather data with rate limiting
   */
  async getWeatherForLocation(latitude: number, longitude: number, apiKey: string): Promise<any> {
    const now = Date.now();
    
    // Check rate limit
    if (now - this.lastWeatherCall < this.MIN_WEATHER_INTERVAL) {
      const waitTime = Math.ceil((this.MIN_WEATHER_INTERVAL - (now - this.lastWeatherCall)) / 1000);
      throw new Error(`Please wait ${waitTime} seconds before checking weather again`);
    }

    this.lastWeatherCall = now;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Weather request failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error: any) {
      console.error('Weather request failed:', error);
      throw new Error(error.message || 'Failed to get weather data');
    }
  }

  /**
   * Start location updates with conservative settings
   */
  async startLocationUpdates(callback: (location: Coordinate) => void): Promise<boolean> {
    try {
      const hasPermission = await this.requestLocationPermissions();
      if (!hasPermission) {
        throw new Error("Location permission denied");
      }

      this.stopLocationUpdates();

      // Conservative settings to prevent battery drain
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 15000, // 15 seconds
          distanceInterval: 25, // 25 meters
        },
        (location) => {
          const coordinate: Coordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude || undefined,
            accuracy: location.coords.accuracy || undefined,
            heading: location.coords.heading || undefined,
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
      name: name || `Pin ${this.waypoints.length + 1}`,
    };

    this.waypoints.push(waypoint);
    
    // Save to AsyncStorage for persistence
    try {
      await AsyncStorage.setItem('waypoints', JSON.stringify(this.waypoints));
    } catch (error) {
      console.error('Failed to save waypoints:', error);
    }
    
    return waypoint;
  }

  
async updateWaypointName(waypointId: string, newName: string): Promise<boolean> {
  const waypointIndex = this.waypoints.findIndex(waypoint => waypoint.id === waypointId);
  
  if (waypointIndex === -1) {
    return false;
  }

  this.waypoints[waypointIndex].name = newName;
  
  try {
    await AsyncStorage.setItem('waypoints', JSON.stringify(this.waypoints));
    return true;
  } catch (error) {
    console.error('Failed to save updated waypoint:', error);
    return false;
  }
}

  getAllWaypoints(): Waypoint[] {
    return [...this.waypoints];
  }

  async loadWapointsFromStorage(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem('waypoints');
      if (stored) {
        this.waypoints = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load waypoints:', error);
    }
  }

  deleteWaypoint(waypointId: string): boolean {
    const initialLength = this.waypoints.length;
    this.waypoints = this.waypoints.filter(waypoint => waypoint.id !== waypointId);
    
    // Save updated waypoints
    AsyncStorage.setItem('waypoints', JSON.stringify(this.waypoints)).catch(error => {
      console.error('Failed to save waypoints after deletion:', error);
    });
    
    return this.waypoints.length < initialLength;
  }


  async deleteAllWaypoints(): Promise<void> {
    this.waypoints = [];
    try {
      await AsyncStorage.removeItem('waypoints');
    } catch (error) {
      console.error("Error clearing waypoints:", error);
    }
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
    
    // Return cached status if recent
    if (this.cachedPermissionStatus && (now - this.lastPermissionCheck) < this.PERMISSION_CACHE_DURATION) {
      return this.cachedPermissionStatus;
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


  getRateLimitStatus() {
    const now = Date.now();
    return {
      location: {
        canCall: (now - this.lastLocationCall) >= this.MIN_LOCATION_INTERVAL,
        nextCallIn: Math.max(0, this.MIN_LOCATION_INTERVAL - (now - this.lastLocationCall))
      },
      poi: {
        canCall: (now - this.lastPOICall) >= this.MIN_POI_INTERVAL,
        nextCallIn: Math.max(0, this.MIN_POI_INTERVAL - (now - this.lastPOICall))
      },
      weather: {
        canCall: (now - this.lastWeatherCall) >= this.MIN_WEATHER_INTERVAL,
        nextCallIn: Math.max(0, this.MIN_WEATHER_INTERVAL - (now - this.lastWeatherCall))
      }
    };
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }
}

export const gpsService = new GpsService();