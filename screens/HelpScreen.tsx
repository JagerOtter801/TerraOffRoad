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
    <ScrollView contentContainerStyle={{ backgroundColor: '#fff', padding: 20}}>
        <Text testID="help-screen" style={{fontSize : 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center'}}>Help & FAQs</Text>
        {faqs.map((faq, idx) => (
            <View key={idx} style={{marginBottom: 18}}>
                <Text style={{fontSize: 18, fontWeight: '600', marginBottom : 4}}>{faq.question}</Text>
                <Text style={{fontSize: 16, color: '#555'}}>{faq.answer}</Text>
            </View>
        ))}
    </ScrollView>
);

export default HelpScreen;