import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen = () => {
    return (
        <View testID="settings-screen" style={styles.container}>
            <Text style={styles.placeholder}>TODO: Settings Screen</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholder: {
        fontSize: 20,
        color: '#888',
    },
});

export default SettingsScreen;