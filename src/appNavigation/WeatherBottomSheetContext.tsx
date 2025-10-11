// contexts/WeatherBottomSheetContext.tsx
import React, { createContext, useContext, useRef, ReactNode } from 'react';
import BottomSheet from '@gorhom/bottom-sheet';
import WeatherBottomSheetScreen from '../screens/WeatherBottomSheetScreen';

type WeatherBottomSheetContextType = {
  openWeatherSheet: () => void;
  closeWeatherSheet: () => void;
};

const WeatherBottomSheetContext = createContext<WeatherBottomSheetContextType | undefined>(undefined);

export const useWeatherBottomSheet = () => {
  const context = useContext(WeatherBottomSheetContext);
  if (!context) {
    throw new Error('useWeatherBottomSheet must be used within WeatherBottomSheetProvider');
  }
  return context;
};

export const WeatherBottomSheetProvider = ({ children }: { children: ReactNode }) => {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const openWeatherSheet = () => {
    bottomSheetRef.current?.snapToIndex(0);
  };

  const closeWeatherSheet = () => {
    bottomSheetRef.current?.close();
  };

  return (
    <WeatherBottomSheetContext.Provider value={{ openWeatherSheet, closeWeatherSheet }}>
      {children}
      <WeatherBottomSheetScreen ref={bottomSheetRef} />
    </WeatherBottomSheetContext.Provider>
  );
};