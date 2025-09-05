import React from 'react';
import { View, Text, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const COMPANY_INFO = {
    name: 'Terra OffRoad',
    email: 'info@terraoffroad.com',
    phone: '+1 (555) 123-4567',
    linkedin: 'https://github.com/users/JagerOtter801/projects/1',
};


const ContactUsScreen: React.FC = () => {
    return (
        <View testID="contact-us-screen" style={styles.container}>
            <Text style={styles.header}>Contact Us</Text>
            <Text style={styles.label}>Company Name:</Text>
            <Text style={styles.value}>{COMPANY_INFO.name}</Text>

            <Text style={styles.label}>Email:</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`mailto:${COMPANY_INFO.email}`)}>
                <Text style={[styles.value, styles.link]}>{COMPANY_INFO.email}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Phone:</Text>
            <TouchableOpacity onPress={() => Linking.openURL(`tel:${COMPANY_INFO.phone}`)}>
                <Text style={[styles.value, styles.link]}>{COMPANY_INFO.phone}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Github:</Text>
            <TouchableOpacity onPress={() => Linking.openURL(COMPANY_INFO.linkedin)}>
                <Text style={[styles.value, styles.link]}>{COMPANY_INFO.linkedin}</Text>
            </TouchableOpacity>
        </View>
    );
};

// Place holder styles until decision is made on this pages implementation
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#333',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        color: '#555',
    },
    value: {
        fontSize: 16,
        marginTop: 4,
        color: '#222',
    },
    link: {
        color: '#0077b5',
        textDecorationLine: 'underline',
    },
});

export default ContactUsScreen;