import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ConfessionCard from '../components/ConfessionCard';
import { getCollegeConfessions, saveConfession } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';
import { generateId } from '../utils/auth';

export default function ConfessionsScreen() {
  const [confessions, setConfessions] = useState([]);
  const [newConfession, setNewConfession] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Get current user
      const userData = await getCurrentUser();
      setUser(userData);
      
      if (userData && userData.collegeId) {
        // Get confessions for user's college
        const collegeConfessions = await getCollegeConfessions(userData.collegeId);
        setConfessions(collegeConfessions);
      }
    } catch (error) {
      console.error('Error loading confessions:', error);
      Alert.alert('Error', 'Failed to load confessions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitConfession = async () => {
    if (!newConfession.trim()) return;
    
    setSubmitting(true);
    
    try {
      if (!user || !user.collegeId) {
        throw new Error('User or college information missing');
      }
      
      // Create new confession
      const confession = {
        id: generateId('confession'),
        collegeId: user.collegeId,
        text: newConfession.trim(),
        timestamp: new Date().toISOString(),
        upvotes: 0,
      };
      
      // Save to storage
      const success = await saveConfession(confession);
      
      if (success) {
        setNewConfession('');
        // Refresh confessions
        await loadData();
        // Scroll to top to show new confession
        if (flatListRef.current && confessions.length > 0) {
          flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
      } else {
        throw new Error('Failed to save confession');
      }
    } catch (error) {
      console.error('Error submitting confession:', error);
      Alert.alert('Error', 'Failed to submit your confession. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (confession) => {
    try {
      // Create updated confession with incremented upvotes
      const updatedConfession = {
        ...confession,
        upvotes: (confession.upvotes || 0) + 1,
      };
      
      // Save to storage
      const success = await saveConfession(updatedConfession);
      
      if (success) {
        // Update local state
        setConfessions(prevConfessions => 
          prevConfessions.map(c => c.id === confession.id ? updatedConfession : c)
        );
      }
    } catch (error) {
      console.error('Error upvoting confession:', error);
    }
  };

  const renderConfessionItem = ({ item }) => (
    <ConfessionCard
      text={item.text}
      timestamp={item.timestamp}
      upvotes={item.upvotes}
      onUpvote={() => handleUpvote(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Confessions</Text>
      </View>
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.keyboardView}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write an anonymous confession..."
            value={newConfession}
            onChangeText={setNewConfession}
            multiline
            numberOfLines={3}
          />
          <TouchableOpacity
            style={[styles.submitButton, (!newConfession.trim() || submitting) && styles.submitButtonDisabled]}
            onPress={handleSubmitConfession}
            disabled={!newConfession.trim() || submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Posting...' : 'Post'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#9c27b0" />
          ) : (
            <>
              {confessions.length > 0 ? (
                <FlatList
                  ref={flatListRef}
                  data={confessions}
                  renderItem={renderConfessionItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.list}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="chatbubble-ellipses-outline" size={64} color="#ccc" />
                  <Text style={styles.emptyText}>No confessions yet</Text>
                  <Text style={styles.emptySubtext}>
                    Be the first to anonymously share your thoughts
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f6fa',
  },
  header: {
    height: 100,
    backgroundColor: '#9c27b0',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  keyboardView: {
    flex: 1,
  },
  inputContainer: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 10,
    minHeight: 80,
  },
  submitButton: {
    backgroundColor: '#9c27b0',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 15,
  },
  list: {
    paddingBottom: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
    paddingHorizontal: 30,
  },
});