import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCurrentUser, logoutUser } from '../utils/auth';
import { getColleges, getCollegeCourses } from '../utils/storage';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [college, setCollege] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Refresh when screen comes into focus
    const unsubscribe = navigation.addListener('focus', loadData);
    
    return unsubscribe;
  }, [navigation]);

  const loadData = async () => {
    try {
      setLoading(true);
      // Get current user
      const userData = await getCurrentUser();
      setUser(userData);
      
      if (userData && userData.collegeId) {
        // Get college information
        const colleges = await getColleges();
        const userCollege = colleges.find(c => c.id === userData.collegeId);
        setCollege(userCollege);
        
        // Get enrolled courses
        const allCourses = await getCollegeCourses(userData.collegeId);
        const userCourses = allCourses.filter(course => 
          userData.courses.includes(course.id)
        );
        setCourses(userCourses);
      }
    } catch (error) {
      console.error('Error loading profile data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await logoutUser();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (error) {
              console.error('Error logging out:', error);
              Alert.alert('Error', 'Failed to logout. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

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
        <Text style={styles.headerTitle}>Profile</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileIcon}>
            <Text style={styles.profileIconText}>
              {user && user.email ? user.email.charAt(0).toUpperCase() : '?'}
            </Text>
          </View>
          <Text style={styles.emailText}>{user?.email}</Text>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>College</Text>
          <View style={styles.infoCard}>
            <Ionicons name="school-outline" size={24} color="#666" style={styles.infoIcon} />
            <Text style={styles.infoText}>{college?.name || 'Not specified'}</Text>
          </View>
        </View>
        
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>My Courses</Text>
          {courses.length > 0 ? (
            courses.map(course => (
              <View key={course.id} style={styles.courseCard}>
                <Text style={styles.courseCode}>{course.code}</Text>
                <Text style={styles.courseName}>{course.name}</Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyCourses}>
              <Text style={styles.emptyText}>No courses found</Text>
            </View>
          )}
        </View>
        
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#ff3b30" style={styles.actionIcon} />
            <Text style={styles.actionTextDanger}>Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4630eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileIconText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  emailText: {
    fontSize: 18,
    fontWeight: '500',
  },
  infoSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoText: {
    fontSize: 16,
  },
  courseCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  courseCode: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  courseName: {
    fontSize: 14,
    color: '#666',
  },
  emptyCourses: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
  },
  actionsSection: {
    marginTop: 20,
    marginBottom: 40,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    marginBottom: 10,
  },
  actionIcon: {
    marginRight: 15,
  },
  actionTextDanger: {
    fontSize: 16,
    color: '#ff3b30',
  },
});