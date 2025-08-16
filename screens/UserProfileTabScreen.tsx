import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfileScreen from "./UserProfileScreen";
import EditUserProfileScreen from "./EditUserProfileScreen";


function UserProfileTabScreen() {
  const Stack = createNativeStackNavigator();

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="UserProfileScreen"
        component={UserProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EditUserProfileScreen"
        component={EditUserProfileScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default UserProfileTabScreen;
