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
import Comment from '../components/Comment';
import Header from '../components/Header';
import { getCourseComments, saveComment } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';
import { generateId } from '../utils/auth';

export default function CourseDiscussionScreen({ route, navigation }) {
  const { course } = route.params;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    // Set the navigation title to the course name
    navigation.setOptions({
      title: course.code,
      headerStyle: {
        backgroundColor: '#4630eb',
      },
      headerTintColor: '#fff',
    });

    loadData();
    
    // Refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', loadData);
    
    return unsubscribe;
  }, [navigation, course]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Get current user
      const userData = await getCurrentUser();
      setUser(userData);
      
      // Get comments for this course
      const courseComments = await getCourseComments(course.id);
      setComments(courseComments);
    } catch (error) {
      console.error('Error loading discussion:', error);
      Alert.alert('Error', 'Failed to load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    
    try {
      // Create new comment
      const comment = {
        id: generateId('comment'),
        courseId: course.id,
        text: newComment.trim(),
        timestamp: new Date().toISOString(),
        upvotes: 0,
      };
      
      // Save to storage
      const success = await saveComment(comment);
      
      if (success) {
        setNewComment('');
        // Refresh comments
        await loadData();
        // Scroll to bottom to show new comment
        if (flatListRef.current && comments.length > 0) {
          flatListRef.current.scrollToEnd({ animated: true });
        }
      } else {
        throw new Error('Failed to save comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      Alert.alert('Error', 'Failed to submit your comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (comment) => {
    try {
      // Create updated comment with incremented upvotes
      const updatedComment = {
        ...comment,
        upvotes: (comment.upvotes || 0) + 1,
      };
      
      // Save to storage
      const success = await saveComment(updatedComment);
      
      if (success) {
        // Update local state
        setComments(prevComments => 
          prevComments.map(c => c.id === comment.id ? updatedComment : c)
        );
      }
    } catch (error) {
      console.error('Error upvoting comment:', error);
    }
  };

  const renderCommentItem = ({ item }) => (
    <Comment
      text={item.text}
      timestamp={item.timestamp}
      upvotes={item.upvotes}
      onUpvote={() => handleUpvote(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator size="large" color="#4630eb" />
          ) : (
            <>
              {comments.length > 0 ? (
                <FlatList
                  ref={flatListRef}
                  data={comments}
                  renderItem={renderCommentItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.list}
                />
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="chatbubble-outline" size={64} color="#ccc" />
                  <Text style={styles.emptyText}>No comments yet</Text>
                  <Text style={styles.emptySubtext}>
                    Be the first to start the discussion
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Write a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            style={[styles.sendButton, (!newComment.trim() || submitting) && styles.sendButtonDisabled]}
            onPress={handleSubmitComment}
            disabled={!newComment.trim() || submitting}
          >
            <Ionicons
              name="send"
              size={20}
              color={!newComment.trim() || submitting ? '#ccc' : 'white'}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  keyboardView: {
    flex: 1,
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
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4630eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    backgroundColor: '#e0e0e0',
  },
});