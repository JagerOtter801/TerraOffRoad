import React from 'react';
import { View, Text, StyleSheet , TouchableOpacity} from 'react-native';
import { styles } from '../../styles';
import { useAuth } from "../auth0";


const SettingsScreen = () => {
      const { user, logout } = useAuth();
    return (
        <View testID="settings-screen" style={styles.settingsDrawerContent}>
            <TouchableOpacity
                    onPress={logout}
                    style={{
                      marginTop: 30,
                      padding: 15,
                      backgroundColor: "#ff4444",
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: "white", fontSize: 16 }}>Logout</Text>
                  </TouchableOpacity>
        </View>
    );
};

export default SettingsScreen;