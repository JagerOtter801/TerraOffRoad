import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import MapView , {Marker} from 'react-native-maps';
import { StatusBar } from 'expo-status-bar';  
import { styles } from '../styles';  

interface MapsScreenProps {
    onBackPress?: () => void;
    user?: any;
}


const MapsScreen = ({onBackPress, user}: MapsScreenProps) => {
    const initialRegion = {
    latitude: 39.7391536, 
    longitude: -111.8947614,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
     <View style={styles.maps_container}>
      <View style={styles.maps_header}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.maps_header_title}>Terra Off Road Maps</Text>
        <View style={styles.maps_placeholder} />
      </View>

      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        mapType="hybrid" // Shows satellite view - good for off-road!
      >
        {/* Example we can  add more markers for trails, camps, etc. */}
        <Marker
          coordinate={{
            latitude: 39.7391536,
            longitude: -111.8947614,
          }}
          title="Welcome to Terra Off Road!"
          description="Start your adventure here"
        />
      </MapView>

      {/* Bottom info panel */}
      <View style={styles.bottomPanel}>
        <Text style={styles.welcomeText}>
          Welcome {user?.name || user?.email || 'Explorer'}!
        </Text>
        <Text style={styles.maps_bottom_info_text}>
          Ready to track your off-road adventures?
        </Text>
      </View>

      <StatusBar style="light" />
    </View>
  );
}

export default MapsScreen;
