import { useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Image } from "react-native";
import { styles } from "../../styles";

/*
* NOTE THIS IS A BOILER PLATE CODE USED AS A PLACE HOLDER FOR FUTURE IMPLEMENTATION
*/
type Waypoint = {
  id: string;
  name: string;
  distance: string;
  imageUri?: string;
};

const PointsOfInterest = () => {
  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    { id: "1", name: "Mountain Trail", distance: "5.2 miles" },
    { id: "2", name: "Desert Path", distance: "3.8 miles" },
    { id: "3", name: "Forest Loop", distance: "7.1 miles" },
  ]);

  const renderWaypoint = ({ item }: { item: Waypoint }) => (
    <TouchableOpacity style={styles.waypointItemContainer}>
      <View style={styles.waypointImageContainer}>
        {item.imageUri ? (
          <Image source={{ uri: item.imageUri }} style={styles.waypointImage} />
        ) : (
          <View style={styles.waypointImagePlaceholder}>
            <Text style={styles.waypointImagePlaceholderText}>📍</Text>
          </View>
        )}
      </View>
      <View style={styles.waypointInfoContainer}>
        <Text style={styles.waypointName}>{item.name}</Text>
        <Text style={styles.waypointDistance}>{item.distance}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyWaypointContainer}>
      <Text style={styles.emptyWaypointText}>No waypoints saved yet</Text>
      <Text style={styles.emptyWaypointSubtext}>Create waypoints on the map to see them here</Text>
    </View>
  );

  return (
    <View testID="routes-screen" style={styles.poiScreenContainer}>
      <Text style={styles.poiScreenTitle}>Saved Waypoints: UNDER DEVELOPMENT</Text>
      <FlatList
        data={waypoints}
        keyExtractor={(item) => item.id}
        renderItem={renderWaypoint}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={styles.poiListContent}
      />
    </View>
  );
};

export default PointsOfInterest;
