import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import CourseCard from '../components/CourseCard';
import { getCollegeCourses } from '../utils/storage';
import { getTempUser, completeRegistration } from '../utils/auth';

export default function CourseSelectionScreen({ route, navigation }) {
  const { collegeId } = route.params;
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get courses for selected college
        const coursesData = await getCollegeCourses(collegeId);
        setCourses(coursesData);
        setFilteredCourses(coursesData);
        
        // Get temp user
        const tempUser = await getTempUser();
        setUser(tempUser);
      } catch (error) {
        console.error('Error loading courses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [collegeId]);

  // Filter courses based on search
  useEffect(() => {
    if (search) {
      const filtered = courses.filter(
        course =>
          course.name.toLowerCase().includes(search.toLowerCase()) ||
          course.code.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [search, courses]);

  const handleSelectCourse = (course) => {
    setSelectedCourses(prevSelected => {
      // If already selected, remove it
      if (prevSelected.includes(course.id)) {
        return prevSelected.filter(id => id !== course.id);
      }
      // Otherwise add it
      return [...prevSelected, course.id];
    });
  };

  const handleComplete = async () => {
    if (selectedCourses.length === 0) {
      Alert.alert('Select Courses', 'Please select at least one course to continue.');
      return;
    }
  
    if (!user) {
      Alert.alert('Error', 'User information not found. Please try again.');
      return;
    }
  
    setRegistering(true);
  
    try {
      // Complete registration with selected college and courses
      const success = await completeRegistration(collegeId, selectedCourses);
      
      if (success) {
        console.log('Registration successful, navigating to Login');
        // Instead of using replace, navigate to Login and let App.js detect logged in state
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'Something went wrong during registration. Please try again.');
    } finally {
      setRegistering(false);
    }
  };
  
  const renderCourseItem = ({ item }) => (
    <CourseCard
      course={item}
      onPress={() => handleSelectCourse(item)}
      isSelected={selectedCourses.includes(item.id)}
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
      <Header title="Select Your Courses" showBackButton={true} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Which courses are you taking?</Text>
        <Text style={styles.subtitle}>Select all that apply</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for your courses..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        
        <FlatList
          data={filteredCourses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
        
        <View style={styles.selectedCount}>
          <Text style={styles.selectedCountText}>
            {selectedCourses.length} course{selectedCourses.length !== 1 && 's'} selected
          </Text>
        </View>
        
        <TouchableOpacity
          style={[styles.button, selectedCourses.length === 0 && styles.buttonDisabled]}
          onPress={handleComplete}
          disabled={selectedCourses.length === 0 || registering}
        >
          <Text style={styles.buttonText}>
            {registering ? 'Setting up your account...' : 'Complete'}
          </Text>
        </TouchableOpacity>
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
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  list: {
    flexGrow: 1,
  },
  selectedCount: {
    marginTop: 10,
    marginBottom: 10,
  },
  selectedCountText: {
    fontSize: 14,
    color: '#666',
  },
  button: {
    backgroundColor: '#4630eb',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#a8a8a8',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});