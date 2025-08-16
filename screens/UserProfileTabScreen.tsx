import { View, Text, TouchableOpacity } from "react-native";
import { useAuth } from "../modules/auth0";

interface ProfileTabScreenProps {
  user?: any;
}

function ProfileTabScreen({ user }: ProfileTabScreenProps) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Profile</Text>
      <Text>Name: {user?.name}</Text>
      <Text>Email: {user?.email}</Text>
      <TouchableOpacity 
        onPress={useAuth().logout} 
        style={{ marginTop: 30, padding: 15, backgroundColor: '#ff4444', borderRadius: 8 }}
      >
        <Text style={{ color: 'white', fontSize: 16 }}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

export default ProfileTabScreen