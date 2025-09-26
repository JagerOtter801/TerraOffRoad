import { fetchWeatherApi } from 'openmeteo';

const params = {
	"latitude": 52.52,
	"longitude": 13.41,
	"daily": ["sunset", "sunrise", "temperature_2m_max", "temperature_2m_min", "weather_code", "rain_sum", "showers_sum", "snowfall_sum", "precipitation_hours", "precipitation_probability_max", "precipitation_sum", "wind_speed_10m_max", "wind_gusts_10m_max"],
	"hourly": ["temperature_2m", "wind_speed_10m", "relative_humidity_2m", "precipitation_probability", "precipitation", "rain", "showers", "snowfall", "weather_code"],
	"models": "ecmwf_ifs025",
	"current": ["temperature_2m", "precipitation", "rain", "showers", "snowfall", "weather_code", "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m"],
	"wind_speed_unit": "mph",
	"temperature_unit": "fahrenheit",
	"precipitation_unit": "inch",
};
const url = "https://api.open-meteo.com/v1/forecast";
const responses = await fetchWeatherApi(url, params);

// Process first location. Add a for-loop for multiple locations or weather models
const response = responses[0];

// Attributes for timezone and location
const latitude = response.latitude();
const longitude = response.longitude();
const elevation = response.elevation();
const utcOffsetSeconds = response.utcOffsetSeconds();

console.log(
	`\nCoordinates: ${latitude}°N ${longitude}°E`,
	`\nElevation: ${elevation}m asl`,
	`\nTimezone difference to GMT+0: ${utcOffsetSeconds}s`,
);

const current = response.current()!;
const hourly = response.hourly()!;
const daily = response.daily()!;

// Define Int64 variables so they can be processed accordingly
const sunset = daily.variables(0)!;
const sunrise = daily.variables(1)!;

// Note: The order of weather variables in the URL query and the indices below need to match!
const weatherData = {
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
	hourly: {
		time: [...Array((Number(hourly.timeEnd()) - Number(hourly.time())) / hourly.interval())].map(
			(_, i) => new Date((Number(hourly.time()) + i * hourly.interval() + utcOffsetSeconds) * 1000)
		),
		temperature_2m: hourly.variables(0)!.valuesArray(),
		wind_speed_10m: hourly.variables(1)!.valuesArray(),
		relative_humidity_2m: hourly.variables(2)!.valuesArray(),
		precipitation_probability: hourly.variables(3)!.valuesArray(),
		precipitation: hourly.variables(4)!.valuesArray(),
		rain: hourly.variables(5)!.valuesArray(),
		showers: hourly.variables(6)!.valuesArray(),
		snowfall: hourly.variables(7)!.valuesArray(),
		weather_code: hourly.variables(8)!.valuesArray(),
	},
	daily: {
		time: [...Array((Number(daily.timeEnd()) - Number(daily.time())) / daily.interval())].map(
			(_, i) => new Date((Number(daily.time()) + i * daily.interval() + utcOffsetSeconds) * 1000)
		),
		// Map Int64 values to according structure
		sunset: [...Array(sunset.valuesInt64Length())].map(
			(_, i) => new Date((Number(sunset.valuesInt64(i)) + utcOffsetSeconds) * 1000)
		),
		// Map Int64 values to according structure
		sunrise: [...Array(sunrise.valuesInt64Length())].map(
			(_, i) => new Date((Number(sunrise.valuesInt64(i)) + utcOffsetSeconds) * 1000)
		),
		temperature_2m_max: daily.variables(2)!.valuesArray(),
		temperature_2m_min: daily.variables(3)!.valuesArray(),
		weather_code: daily.variables(4)!.valuesArray(),
		rain_sum: daily.variables(5)!.valuesArray(),
		showers_sum: daily.variables(6)!.valuesArray(),
		snowfall_sum: daily.variables(7)!.valuesArray(),
		precipitation_hours: daily.variables(8)!.valuesArray(),
		precipitation_probability_max: daily.variables(9)!.valuesArray(),
		precipitation_sum: daily.variables(10)!.valuesArray(),
		wind_speed_10m_max: daily.variables(11)!.valuesArray(),
		wind_gusts_10m_max: daily.variables(12)!.valuesArray(),
	},
};

// 'weatherData' now contains a simple structure with arrays with datetime and weather data
console.log(
	`\nCurrent time: ${weatherData.current.time}`,
	`\nCurrent temperature_2m: ${weatherData.current.temperature_2m}`,
	`\nCurrent precipitation: ${weatherData.current.precipitation}`,
	`\nCurrent rain: ${weatherData.current.rain}`,
	`\nCurrent showers: ${weatherData.current.showers}`,
	`\nCurrent snowfall: ${weatherData.current.snowfall}`,
	`\nCurrent weather_code: ${weatherData.current.weather_code}`,
	`\nCurrent wind_speed_10m: ${weatherData.current.wind_speed_10m}`,
	`\nCurrent wind_direction_10m: ${weatherData.current.wind_direction_10m}`,
	`\nCurrent wind_gusts_10m: ${weatherData.current.wind_gusts_10m}`,
);
console.log("\nHourly data", weatherData.hourly)
console.log("\nDaily data", weatherData.daily)