// utils/storage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// In a real app, we'd use FileSystem to read/write JSON files
// For this prototype, we'll use AsyncStorage and import initial data from JSON files
import usersData from '../data/users.json';
import collegesData from '../data/colleges.json';
import coursesData from '../data/courses.json';
import commentsData from '../data/comments.json';
import confessionsData from '../data/confessions.json';

// Initialize data in AsyncStorage
export const initializeStorage = async () => {
  try {
    // Check if data is already initialized
    const initialized = await AsyncStorage.getItem('dataInitialized');
    if (initialized) return;

    // Set initial data
    await AsyncStorage.setItem('users', JSON.stringify(usersData));
    await AsyncStorage.setItem('colleges', JSON.stringify(collegesData));
    await AsyncStorage.setItem('courses', JSON.stringify(coursesData));
    await AsyncStorage.setItem('comments', JSON.stringify(commentsData));
    await AsyncStorage.setItem('confessions', JSON.stringify(confessionsData));
    
    // Mark as initialized
    await AsyncStorage.setItem('dataInitialized', 'true');
  } catch (error) {
    console.error('Error initializing storage:', error);
  }
};

// Get all colleges
export const getColleges = async () => {
  try {
    const colleges = await AsyncStorage.getItem('colleges');
    return colleges ? JSON.parse(colleges) : [];
  } catch (error) {
    console.error('Error getting colleges:', error);
    return [];
  }
};

// Get courses for a specific college
export const getCollegeCourses = async (collegeId) => {
  try {
    const courses = await AsyncStorage.getItem('courses');
    const parsedCourses = courses ? JSON.parse(courses) : [];
    return parsedCourses.filter(course => course.collegeId === collegeId);
  } catch (error) {
    console.error('Error getting college courses:', error);
    return [];
  }
};

// Get comments for a specific course
export const getCourseComments = async (courseId) => {
  try {
    const comments = await AsyncStorage.getItem('comments');
    const parsedComments = comments ? JSON.parse(comments) : [];
    return parsedComments
      .filter(comment => comment.courseId === courseId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Error getting course comments:', error);
    return [];
  }
};

// Save a new comment
export const saveComment = async (comment) => {
  try {
    const comments = await AsyncStorage.getItem('comments');
    const parsedComments = comments ? JSON.parse(comments) : [];
    const newComments = [...parsedComments, comment];
    await AsyncStorage.setItem('comments', JSON.stringify(newComments));
    return true;
  } catch (error) {
    console.error('Error saving comment:', error);
    return false;
  }
};

// Get confessions for a specific college
export const getCollegeConfessions = async (collegeId) => {
  try {
    const confessions = await AsyncStorage.getItem('confessions');
    const parsedConfessions = confessions ? JSON.parse(confessions) : [];
    return parsedConfessions
      .filter(confession => confession.collegeId === collegeId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Error getting college confessions:', error);
    return [];
  }
};

// Save a new confession
export const saveConfession = async (confession) => {
  try {
    const confessions = await AsyncStorage.getItem('confessions');
    const parsedConfessions = confessions ? JSON.parse(confessions) : [];
    const newConfessions = [...parsedConfessions, confession];
    await AsyncStorage.setItem('confessions', JSON.stringify(newConfessions));
    return true;
  } catch (error) {
    console.error('Error saving confession:', error);
    return false;
  }
};

// Save user data
export const saveUser = async (user) => {
  try {
    const users = await AsyncStorage.getItem('users');
    const parsedUsers = users ? JSON.parse(users) : [];
    
    // Check if user already exists
    const existingUserIndex = parsedUsers.findIndex(u => u.id === user.id);
    
    if (existingUserIndex >= 0) {
      // Update existing user
      parsedUsers[existingUserIndex] = user;
    } else {
      // Add new user
      parsedUsers.push(user);
    }
    
    await AsyncStorage.setItem('users', JSON.stringify(parsedUsers));
    return true;
  } catch (error) {
    console.error('Error saving user:', error);
    return false;
  }
};
