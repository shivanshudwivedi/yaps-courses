import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CourseCard({ course, onPress, isSelected = false }) {
  return (
    <TouchableOpacity 
      style={[styles.container, isSelected && styles.selectedContainer]}
      onPress={onPress}
    >
      <View style={styles.codeContainer}>
        <Text style={styles.code}>{course.code}</Text>
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.name}>{course.name}</Text>
      </View>
      {isSelected && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  selectedContainer: {
    borderColor: '#4630eb',
    borderWidth: 2,
  },
  codeContainer: {
    backgroundColor: '#f2f2f2',
    padding: 15,
    justifyContent: 'center',
  },
  code: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  contentContainer: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
  },
  checkmark: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
  },
  checkmarkText: {
    fontSize: 20,
    color: '#4630eb',
  },
});
