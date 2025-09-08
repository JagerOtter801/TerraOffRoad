// modules/navigation/types.ts
export interface Coordinate {
  latitude: number;
  longitude: number;
  timestamp?: number;
  altitude?: number;
  accuracy?: number;
  heading?: number;
}

export interface Waypoint extends Coordinate {
  id: string;
  name?: string;
}

export interface Route {
  id: string;
  name: string;
  waypoints: Waypoint[];
  totalDistance: number;
  createdAt: number;
}

export interface LocationError {
  code: number;
  message: string;
}

export interface MapLongPressEvent {
  nativeEvent: {
    coordinate: {
      latitude: number;
      longitude: number;
    };
  };
}

export type RootStackParamList = {
  MapsScreen: undefined,
  LoginScreen : undefined,
  MapTabScreen : undefined,
  OfflineMapScreen : undefined,
  RoutesTabScreen : undefined,
  SettingsScreen: undefined,
  UserProfileScreen: undefined,
  UserProfileTabScreen : undefined,

}