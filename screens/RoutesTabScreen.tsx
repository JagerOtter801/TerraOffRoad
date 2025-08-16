import { View, Text,} from "react-native";

function RoutesTabScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24 }}>Saved Routes</Text>
      <Text>Your off-road routes will appear here</Text>
    </View>
  );
}

export default RoutesTabScreen;