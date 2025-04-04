import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Comment({ text, timestamp, upvotes, onUpvote }) {
  // Format the timestamp
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}m ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{text}</Text>
      <View style={styles.footer}>
        <Text style={styles.timestamp}>{formatDate(timestamp)}</Text>
        <TouchableOpacity 
          style={styles.upvoteButton}
          onPress={onUpvote}
        >
          <Text style={styles.upvoteText}>▲</Text>
          <Text style={styles.upvoteCount}>{upvotes || 0}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    marginBottom: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timestamp: {
    fontSize: 12,
    color: '#888',
  },
  upvoteButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  upvoteText: {
    fontSize: 16,
    color: '#4630eb',
    marginRight: 5,
  },
  upvoteCount: {
    fontSize: 14,
    color: '#4630eb',
  },
});
