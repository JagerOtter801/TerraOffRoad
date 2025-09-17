import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const EditUserProfileScreen: React.FC = () => {
    const navigation = useNavigation();

    const handleBack = () => {
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Edit User Profile</Text>
            {/* Add user profile form fields here */}
        </View>
    );
};

// Todo: Move styles to styles.ts once decision is made on this functionality
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    backButton: {
        padding: 8,
        alignSelf: "flex-start",
        marginBottom: 16,
    },
    backButtonText: {
        color: "#007AFF",
        fontSize: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 24,
    },
});

export default EditUserProfileScreen;