import * as Location from "expo-location";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Coordinate, Waypoint, Route, LocationError } from "./types";

interface RateLimitState {
  dailyCount: number;
  lastResetDate: string;
  lastApiCall: number;
}

class GpsService {
  private currentLocation: Coordinate | null = null;
  private waypoints: Waypoint[] = [];
  private locationSubscription: Location.LocationSubscription | null = null;
  
  // Rate limiting configuration preventing cost issues
  private readonly MIN_API_INTERVAL_BETWEEN_CALLS: number = 30000; 
  private readonly DAILY_API_CALL_LIMIT: number = 200; 
  private readonly RATE_LIMIT_STORAGE_KEY = 'gps_rate_limit_state';
  
 
  private cachedPermissionStatus: string | null = null;
  private lastPermissionCheck: number = 0;
  private readonly PERMISSION_CACHE_DURATION = 60000;

  private async loadRateLimitState(): Promise<RateLimitState> {
    try {
      const storedState = await AsyncStorage.getItem(this.RATE_LIMIT_STORAGE_KEY);
      if (storedState) {
        const state: RateLimitState = JSON.parse(storedState);
        
        // Validate state structure
        if (typeof state.dailyCount !== 'number' || 
            typeof state.lastResetDate !== 'string' || 
            typeof state.lastApiCall !== 'number') {
          throw new Error("Invalid rate limit state structure");
        }
        
        // Reset daily count if it's a new day (using UTC to avoid timezone issues)
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
        const stateDate = new Date(state.lastResetDate).toISOString().split('T')[0];
        
        if (stateDate !== today) {
          const resetState: RateLimitState = {
            dailyCount: 0,
            lastResetDate: today,
            lastApiCall: state.lastApiCall, // Keep last call time for interval checking
          };
          await this.saveRateLimitState(resetState);
          return resetState;
        }
        
        return state;
      }
    } catch (error) {
      console.error("Failed to load rate limit state, creating new:", error);
      // On any error, create a conservative default state
      const defaultState: RateLimitState = {
        dailyCount: this.DAILY_API_CALL_LIMIT - 10, // Leave some room but be conservative
        lastResetDate: new Date().toISOString().split('T')[0],
        lastApiCall: Date.now() - (this.MIN_API_INTERVAL_BETWEEN_CALLS / 2), // Allow next call in 15 seconds
      };
      
      try {
        await this.saveRateLimitState(defaultState);
      } catch (saveError) {
        console.error("Failed to save default rate limit state:", saveError);
      }
      
      return defaultState;
    }
    
    // Return fresh state for new users
    const newState: RateLimitState = {
      dailyCount: 0,
      lastResetDate: new Date().toISOString().split('T')[0],
      lastApiCall: 0,
    };
    
    try {
      await this.saveRateLimitState(newState);
    } catch (error) {
      console.error("Failed to save initial rate limit state:", error);
    }
    
    return newState;
  }

  /**
   * Save rate limiting state to storage
   */
  private async saveRateLimitState(state: RateLimitState): Promise<void> {
    try {
      await AsyncStorage.setItem(this.RATE_LIMIT_STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error("Failed to save rate limit state:", error);
    }
  }

  // Mutex to prevent race conditions in rate limiting
  private rateLimitMutex: Promise<any> = Promise.resolve();

  /**
   * Check if we can make an API call and atomically increment counter if allowed
   */
  private async canMakeApiCallAndIncrement(): Promise<{ allowed: boolean; reason?: string; timeUntilNext?: number }> {
    // Use mutex to prevent race conditions
    return this.rateLimitMutex = this.rateLimitMutex.then(async () => {
      try {
        const state = await this.loadRateLimitState();
        const now = Date.now();
        
        // Validate timestamps to detect clock manipulation
        if (state.lastApiCall > now + 60000) { // If last call is more than 1 minute in future
          console.warn("Clock manipulation detected, resetting rate limit state");
          const resetState: RateLimitState = {
            dailyCount: 0,
            lastResetDate: new Date().toDateString(),
            lastApiCall: 0,
          };
          await this.saveRateLimitState(resetState);
          return this.canMakeApiCallAndIncrement(); // Retry with reset state
        }
        
        // Check daily limit
        if (state.dailyCount >= this.DAILY_API_CALL_LIMIT) {
          return { 
            allowed: false, 
            reason: `Daily limit of ${this.DAILY_API_CALL_LIMIT} location requests reached. Resets at midnight.` 
          };
        }
        
        // Check minimum interval
        const timeSinceLastCall = now - state.lastApiCall;
        if (timeSinceLastCall < this.MIN_API_INTERVAL_BETWEEN_CALLS) {
          const timeUntilNext = this.MIN_API_INTERVAL_BETWEEN_CALLS - timeSinceLastCall;
          return { 
            allowed: false, 
            reason: `Rate limited. Next request available in ${Math.ceil(timeUntilNext / 1000)} seconds.`,
            timeUntilNext 
          };
        }
        
        // ATOMICALLY increment counter
        state.dailyCount += 1;
        state.lastApiCall = now;
        await this.saveRateLimitState(state);
        
        return { allowed: true };
      } catch (error) {
        console.error("Rate limiting error:", error);
        // On storage failure, be conservative and deny the request
        return { 
          allowed: false, 
          reason: "Rate limiting system unavailable - request denied for safety" 
        };
      }
    });
  }

  /**
   * Get cached permission status or fetch fresh if cache expired
   */
  async requestLocationPermissions(): Promise<boolean> {
    const now = Date.now();
    
    // Use cached permission status if recent
    if (this.cachedPermissionStatus && (now - this.lastPermissionCheck) < this.PERMISSION_CACHE_DURATION) {
      return this.cachedPermissionStatus === "granted";
    }
    
    // Check rate limits before making permission request
    const rateLimitCheck = await this.canMakeApiCallAndIncrement();
    if (!rateLimitCheck.allowed) {
      // Return cached status if available, otherwise deny
      if (this.cachedPermissionStatus) {
        console.log(`Permission request rate limited - using cached status: ${this.cachedPermissionStatus}`);
        return this.cachedPermissionStatus === "granted";
      }
      throw new Error("Permission request rate limited and no cached status available");
    }
    
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      this.cachedPermissionStatus = status;
      this.lastPermissionCheck = now;
      return status === "granted";
    } catch (error) {
      console.error("Permission request failed:", error);
      // Decrement counter since permission request failed
      try {
        await this.decrementApiCallCounter();
      } catch (decrementError) {
        console.error("Failed to decrement counter after permission error:", decrementError);
      }
      return false;
    }
  }


  async getCurrentLocation(): Promise<Coordinate> {
    // Atomic rate limit check and counter increment
    const rateLimitCheck = await this.canMakeApiCallAndIncrement();
    if (!rateLimitCheck.allowed) {
      // Return cached location if available and recent (within 5 minutes)
      if (
        this.currentLocation &&
        typeof this.currentLocation.timestamp === "number" &&
        (Date.now() - this.currentLocation.timestamp) < 300000
      ) {
        console.log(`Rate limited - returning cached location. ${rateLimitCheck.reason}`);
        return this.currentLocation;
      }
      throw new Error(rateLimitCheck.reason || "Rate limited - no cached location available");
    }

    try {
      const hasPermission = await this.requestLocationPermissions();
      if (!hasPermission) {
        await this.decrementApiCallCounter();
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
      const currentState = await this.loadRateLimitState();
      console.log(`Location updated. Daily usage: ${currentState.dailyCount}/${this.DAILY_API_CALL_LIMIT}`);
      return coordinate;
    } catch (error: any) {
      // If location call failed, consider decrementing counter
      // But be conservative - only decrement for permission errors, not network/GPS errors
      if (error.message?.includes("permission")) {
        try {
          await this.decrementApiCallCounter();
        } catch (decrementError) {
          console.error("Failed to decrement counter after permission error:", decrementError);
        }
      }
      
      throw {
        code: 1,
        message: error.message || "Could not get current location",
      };
    }
  }

  // Location update with throttling to prevent spamming
  private locationUpdateThrottleTimer: NodeJS.Timeout | null = null;
  async startLocationUpdates(
    callback: (location: Coordinate) => void
  ): Promise<boolean> {
    try {
      const hasPermission = await this.requestLocationPermissions();
      if (!hasPermission) {
        throw new Error("Location permission denied");
      }

      this.stopLocationUpdates();

      let lastCallbackTime = 0;
      const CALLBACK_THROTTLE = 10000; 

      // Update location with conservative intervals to prevent API spam
      this.locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced, // Balanced to reduce battery drain
          timeInterval: 15000, 
          distanceInterval: 25, 
        },
        (location) => {
          const now = Date.now();
          
          // Throttle callback execution to prevent excessive updates
          if (now - lastCallbackTime < CALLBACK_THROTTLE) {
            return;
          }
          lastCallbackTime = now;

          const coordinate: Coordinate = {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            altitude: location.coords.altitude || undefined,
            accuracy: location.coords.accuracy || undefined,
            heading: location.coords.heading || undefined,
            timestamp: now,
          };
          
          this.currentLocation = coordinate;
          
          // Use throttle timer to prevent rapid successive callbacks
          if (this.locationUpdateThrottleTimer) {
            clearTimeout(this.locationUpdateThrottleTimer);
          }
          
          this.locationUpdateThrottleTimer = setTimeout(() => {
            callback(coordinate);
            this.locationUpdateThrottleTimer = null;
          }, 100); 
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
    
    if (this.locationUpdateThrottleTimer) {
      clearTimeout(this.locationUpdateThrottleTimer);
      this.locationUpdateThrottleTimer = null;
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

  async deleteAllRoutes(): Promise<void> {
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

  /**
   * Get current rate limiting status
   */
  async getRateLimitStatus(): Promise<{
    dailyUsage: number;
    dailyLimit: number;
    canMakeCall: boolean;
    timeUntilNextCall?: number;
    resetTime: string;
  }> {
    try {
      const state = await this.loadRateLimitState();
      const now = Date.now();
      
      const canMakeCall = state.dailyCount < this.DAILY_API_CALL_LIMIT && 
                         (now - state.lastApiCall) >= this.MIN_API_INTERVAL_BETWEEN_CALLS;
      
      let timeUntilNextCall: number | undefined;
      if (!canMakeCall && state.dailyCount < this.DAILY_API_CALL_LIMIT) {
        timeUntilNextCall = this.MIN_API_INTERVAL_BETWEEN_CALLS - (now - state.lastApiCall);
      }
      
      // Calculate when the daily limit resets (midnight UTC to avoid timezone issues)
      const tomorrow = new Date();
      tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
      tomorrow.setUTCHours(0, 0, 0, 0);
      
      return {
        dailyUsage: state.dailyCount,
        dailyLimit: this.DAILY_API_CALL_LIMIT,
        canMakeCall,
        timeUntilNextCall,
        resetTime: tomorrow.toISOString(),
      };
    } catch (error) {
      console.error("Failed to get rate limit status:", error);
      return {
        dailyUsage: this.DAILY_API_CALL_LIMIT,
        dailyLimit: this.DAILY_API_CALL_LIMIT,
        canMakeCall: false,
        resetTime: new Date().toISOString(),
      };
    }
  }


  private async decrementApiCallCounter(): Promise<void> {
    try {
      const state = await this.loadRateLimitState();
      if (state.dailyCount > 0) {
        state.dailyCount -= 1;
        await this.saveRateLimitState(state);
        console.log("API call counter decremented due to failed request");
      }
    } catch (error) {
      console.error("Failed to decrement API call counter:", error);
    }
  }


  async resetRateLimit(): Promise<void> {
    const resetState: RateLimitState = {
      dailyCount: 0,
      lastResetDate: new Date().toDateString(),
      lastApiCall: 0,
    };
    await this.saveRateLimitState(resetState);
    console.log("Rate limit state reset");
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