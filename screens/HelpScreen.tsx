import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';

const faqs = [
    {
        question: 'How do I use TerraOffRoad?',
        answer: 'Navigate through the app using the menu. Select features to explore maps, trails, and more.',
    },
    {
        question: 'Is my data saved?',
        answer: 'Your data is securely stored on your device. You can manage it in the settings.',
    },
    {
        question: 'Who can I contact for support?',
        answer: 'Reach out via the Contact Us section in the app for any assistance.',
    },
    // Add more FAQs as needed
];

const HelpScreen = () => (
    <ScrollView contentContainerStyle={styles.container}>
        <Text testID="help-screen" style={styles.title}>Help & FAQs</Text>
        {faqs.map((faq, idx) => (
            <View key={idx} style={styles.faqItem}>
                <Text style={styles.question}>{faq.question}</Text>
                <Text style={styles.answer}>{faq.answer}</Text>
            </View>
        ))}
    </ScrollView>
);

// Place holder styles until decision is made on this pages implementation
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    faqItem: {
        marginBottom: 18,
    },
    question: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 4,
    },
    answer: {
        fontSize: 16,
        color: '#555',
    },
});

export default HelpScreen;