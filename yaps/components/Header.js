import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Header({ title, showBackButton = false }) {
  const navigation = useNavigation();
  
  return (
    <View style={styles.header}>
      {showBackButton && (
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      )}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4630eb',
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 10,
  },
  backButtonText: {
    fontSize: 24,
    color: 'white',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
});