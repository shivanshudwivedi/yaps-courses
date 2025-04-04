import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CourseCard from '../components/CourseCard';
import { getCollegeCourses } from '../utils/storage';
import { getCurrentUser } from '../utils/auth';

export default function CourseListScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get current user
        const userData = await getCurrentUser();
        setUser(userData);
        
        if (userData && userData.collegeId) {
          // Get courses for the user's college
          const userCourses = await getCollegeCourses(userData.collegeId);
          
          // Filter to only include the courses the user is enrolled in
          const enrolledCourses = userCourses.filter(course => 
            userData.courses.includes(course.id)
          );
          
          setCourses(enrolledCourses);
        }
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', loadData);
    
    return unsubscribe;
  }, [navigation]);

  const handleCourseTap = (course) => {
    navigation.navigate('CourseDiscussion', { course });
  };

  const renderCourseItem = ({ item }) => (
    <CourseCard
      course={item}
      onPress={() => handleCourseTap(item)}
    />
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4630eb" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Courses</Text>
      </View>
      
      <View style={styles.content}>
        {courses.length > 0 ? (
          <FlatList
            data={courses}
            renderItem={renderCourseItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyCourses}>
            <Ionicons name="book-outline" size={64} color="#ccc" />
            <Text style={styles.emptyCoursesText}>No courses found</Text>
            <Text style={styles.emptyCoursesSubtext}>
              You haven't added any courses yet
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    height: 100,
    backgroundColor: '#4630eb',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  list: {
    flexGrow: 1,
  },
  emptyCourses: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyCoursesText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  emptyCoursesSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
});