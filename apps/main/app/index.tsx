import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text accessibilityRole="header" style={styles.title}>Hello, world</Text>
      <Text style={styles.subtitle}>Expo Router is enabled.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 16
  },
  title: { fontSize: 24, fontWeight: '600', color: '#111' },
  subtitle: { marginTop: 8, fontSize: 16, color: '#555' }
});

