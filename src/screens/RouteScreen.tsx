import { useState } from "react";
import { View, Text, FlatList } from "react-native";

const RoutesScreen = () => {
  const [routesDisplayed, setRoutesDisplayed] = useState(false);
  const [routes, setRoutes] = useState([
    { id: "1", name: "Mountain Trail", distance: "5.2 miles" },
    { id: "2", name: "Desert Path", distance: "3.8 miles" },
    { id: "3", name: "Forest Loop", distance: "7.1 miles" },
  ]); // Placeholder for routes


  return (
    <View testID="routes-screen" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      {routesDisplayed ? (
        <>
          <Text style={{ fontSize: 24 }}>Saved Routes</Text>
          <Text>Your off-road routes will appear here</Text>
        </>
      ) : (
        <FlatList
          data={routes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ flex: 1, flexDirection: "row", padding: 10, borderBottomWidth: 1, borderColor: "#ccc" }}>
              <Text>{item.name + " "}</Text>
              <Text>{item.distance}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default RoutesScreen;
