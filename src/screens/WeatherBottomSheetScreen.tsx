import {
  useCallback,
  useEffect,
  useState,
  forwardRef,
} from "react";
import { View, Text, StyleSheet } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { getWeatherData } from "../weather/WeatherAPI";
import { WeatherData } from "../screens/index";
import {styles} from "../../styles"

const WeatherBottomSheetScreen = forwardRef<BottomSheet>((props, ref) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
 const [lastWeatherFetchTime, setLastWeatherFetchTime] = useState<number>(0);

  const handleSheetChanges = useCallback((index: number) => {
    if( index >=0){
      const now = Date.now();
      const fiveMinutes = 300000;

      if(!weather || (now - lastWeatherFetchTime > fiveMinutes)){
      getWeather();
    }
  }

  }, [weather, lastWeatherFetchTime]);

  const getWeather = async () => {
    try {
      const data = await getWeatherData();
      setWeather(data);
      setLastWeatherFetchTime(Date.now());
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    }
  };

  return (
    <BottomSheet
      ref={ref}
      onChange={handleSheetChanges}
      index={-1}
      snapPoints={['70%']}
      backgroundStyle={styles.bottomSheetBackground}
      handleIndicatorStyle={styles.handleIndicator}
      enablePanDownToClose={true}
    >
      <BottomSheetView style={styles.bottomSheetContentContainer}>
        <View style={styles.innerContainer}>
          <View style={styles.weatherCard}>
            {weather ? (
              <>
                <Text style={styles.title}>Weather Report</Text>

                <View style={styles.temperatureContainer}>
                  <Text style={styles.temperature}>
                    {weather.current.temperature_2m.toFixed(1)}°F
                  </Text>
                </View>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Wind</Text>
                    <Text style={styles.detailValue}>
                      {weather.current.wind_speed_10m.toFixed(1)} mph
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Sunrise</Text>
                    <Text style={styles.detailValue}>
                      {new Date(weather.daily.sunrise[0]).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>

                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Sunset</Text>
                    <Text style={styles.detailValue}>
                      {new Date(weather.daily.sunset[0]).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </Text>
                  </View>
                </View>
              </>
            ) : (
              <Text style={styles.loadingText}>Loading weather...</Text>
            )}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});

export default WeatherBottomSheetScreen;