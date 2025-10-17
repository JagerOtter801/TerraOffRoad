import { fetchWeatherApi } from 'openmeteo';
import { gpsService } from '../gps';

export const getWeatherData = async () => {
  const location = await gpsService.getCurrentLocation();
  const params = {
    latitude: location.latitude,
    longitude: location.longitude,
    daily: [
      "sunset",
      "sunrise",
      "temperature_2m_max",
      "temperature_2m_min",
      "weather_code",
      "rain_sum",
      "showers_sum",
      "snowfall_sum",
      "precipitation_hours",
      "precipitation_probability_max",
      "precipitation_sum",
      "wind_speed_10m_max",
      "wind_gusts_10m_max",
    ],
    hourly: [
      "temperature_2m",
      "wind_speed_10m",
      "relative_humidity_2m",
      "precipitation_probability",
      "precipitation",
      "rain",
      "showers",
      "snowfall",
      "weather_code",
    ],
    models: "ecmwf_ifs025",
    current: [
      "temperature_2m",
      "precipitation",
      "rain",
      "showers",
      "snowfall",
      "weather_code",
      "wind_speed_10m",
      "wind_direction_10m",
      "wind_gusts_10m",
    ],
    wind_speed_unit: "mph",
    temperature_unit: "fahrenheit",
    precipitation_unit: "inch",
  };

  const url = "https://api.open-meteo.com/v1/forecast";
  const responses = await fetchWeatherApi(url, params);
  const response = responses[0];

  const utcOffsetSeconds = response.utcOffsetSeconds();
  const current = response.current()!;
  const daily = response.daily()!;
  const sunset = daily.variables(0)!;
  const sunrise = daily.variables(1)!;

  return {
    current: {
      time: new Date((Number(current.time()) + utcOffsetSeconds) * 1000),
      temperature_2m: current.variables(0)!.value(),
      precipitation: current.variables(1)!.value(),
      rain: current.variables(2)!.value(),
      showers: current.variables(3)!.value(),
      snowfall: current.variables(4)!.value(),
      weather_code: current.variables(5)!.value(),
      wind_speed_10m: current.variables(6)!.value(),
      wind_direction_10m: current.variables(7)!.value(),
      wind_gusts_10m: current.variables(8)!.value(),
    },
    daily: {
      sunrise: [...Array(sunrise.valuesInt64Length())].map(
        (_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
      ),
      sunset: [...Array(sunset.valuesInt64Length())].map(
        (_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
      ),
      temperature_2m_max: daily.variables(2)!.valuesArray(),
      temperature_2m_min: daily.variables(3)!.valuesArray(),
    },
  };
};