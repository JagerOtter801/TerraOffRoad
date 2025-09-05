import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SettingsScreen = () => {
    return (
        <View testID="settings-screen" style={styles.container}>
            <Text style={styles.placeholder}>TODO: Settings Screen</Text>
        </View>
    );
};

// Place holder styles until decision is made on this pages implementation
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