import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfileScreen from '../screens/UserProfileScreen';
import EditUserProfileScreen from "../screens/EditUserProfileScreen";

const ProfileStack = createNativeStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="UserProfile"  options={{ headerShown: false }} component={UserProfileScreen} />
      <ProfileStack.Screen name="EditUserProfile" component={EditUserProfileScreen} />
    </ProfileStack.Navigator>
  );
}

