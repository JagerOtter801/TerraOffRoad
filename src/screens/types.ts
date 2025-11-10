export type SectionName =
  | "Vehicle Items"
  | "Shelter"
  | "Sleeping System"
  | "Emergency/Medical"
  | "Clothing"
  | "Cooking"
  | "Food"
  | "Hygiene"
  | "Lighting/Signaling"
  | "Electronics"
  | "Misc";

export type PackingItem = {
  id: string;
  name: string;
  checked: boolean;
};

export type PackingList = {
  [key in SectionName]: PackingItem[];
};

export type WeatherData = {
  current: {
    time: Date;
    temperature_2m: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    weather_code: number;
    wind_speed_10m: number;
    wind_direction_10m: number;
    wind_gusts_10m: number;
  };
  daily: {
    sunrise: Date[];
    sunset: Date[];
    temperature_2m_max: Float32Array | null;
    temperature_2m_min: Float32Array | null;
  };
};