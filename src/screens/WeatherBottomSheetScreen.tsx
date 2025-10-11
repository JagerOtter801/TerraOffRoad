import React, { useCallback, useEffect, useMemo, useRef, forwardRef, useState} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import {getWeatherData} from "../weather/WeatherAPI";
import { WeatherData } from "../screens/index";

const WeatherBottomSheetScreen = forwardRef<BottomSheet>((props, ref) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const getWeather = async () => {
    try {
      const data = await getWeatherData();
      setWeather(data);
    } catch (error) {
      console.error("Failed to fetch weather:", error);
    }
  };

  useEffect(() => {
    getWeather();
  }, []);

  return (
    <BottomSheet
      ref={ref}
      onChange={handleSheetChanges}
      index={-1} // Changed to -1 so it starts closed
      snapPoints={[500]}
      backgroundStyle={{ backgroundColor: "#b6a398" }}
      handleIndicatorStyle={{ backgroundColor: "#fff" }}
      enablePanDownToClose={true}
    >
      <BottomSheetView style={styles.contentContainer}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              padding: 30,
              borderRadius: 10,
              width: 260,
            }}
          >
            {weather ? (
              <>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "600",
                    textAlign: "center",
                    marginBottom: 10,
                  }}
                >
                  Weather Report
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                    marginBottom: 5,
                  }}
                >
                  🌡️ {weather.current.temperature_2m.toFixed(1)}°F
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                    marginBottom: 5,
                  }}
                >
                  🌬️ Wind: {weather.current.wind_speed_10m.toFixed(1)} mph
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                    marginBottom: 5,
                  }}
                >
                  🌅 Sunrise:{" "}
                  {new Date(weather.daily.sunrise[0]).toLocaleTimeString()}
                </Text>

                <Text
                  style={{
                    fontSize: 16,
                    textAlign: "center",
                    marginBottom: 15,
                  }}
                >
                  🌇 Sunset:{" "}
                  {new Date(weather.daily.sunset[0]).toLocaleTimeString()}
                </Text>
              </>
            ) : (
              <Text style={{ textAlign: "center" }}>Loading weather...</Text>
            )}
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
});


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'grey',
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    margin: 4,
    alignItems: 'center',
  },
});

export default WeatherBottomSheetScreen;