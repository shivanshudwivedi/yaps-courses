// utils/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';

// Check if user is logged in
export const isLoggedIn = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user !== null;
  } catch (error) {
    console.error('Error checking login status:', error);
    return false;
  }
};

// Get current user
export const getCurrentUser = async () => {
  try {
    const user = await AsyncStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Login user
export const loginUser = async (email) => {
  try {
    const users = await AsyncStorage.getItem('users');
    const parsedUsers = users ? JSON.parse(users) : [];
    const user = parsedUsers.find(u => u.email === email);
    
    if (user) {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      return { success: true, user, isNewUser: false };
    }
    
    return { success: false, message: 'User not found' };
  } catch (error) {
    console.error('Error logging in:', error);
    return { success: false, message: 'Login failed' };
  }
};

// Store temporary user during registration
export const storeTempUser = async (userData) => {
  try {
    await AsyncStorage.setItem('tempUser', JSON.stringify(userData));
    return true;
  } catch (error) {
    console.error('Error storing temp user:', error);
    return false;
  }
};

// Get temporary user
export const getTempUser = async () => {
  try {
    const tempUser = await AsyncStorage.getItem('tempUser');
    return tempUser ? JSON.parse(tempUser) : null;
  } catch (error) {
    console.error('Error getting temp user:', error);
    return null;
  }
};

// Complete user registration
export const completeRegistration = async (collegeId, courses) => {
    try {
      console.log('Starting registration with collegeId:', collegeId, 'and courses:', courses);
      
      const tempUser = await getTempUser();
      console.log('Temp user found:', tempUser);
      
      if (!tempUser) {
        console.error('No temp user found during registration');
        return false;
      }
      
      const user = {
        ...tempUser,
        collegeId,
        courses
      };
      
      console.log('Created user object:', user);
      
      // Save to users collection
      const users = await AsyncStorage.getItem('users');
      const parsedUsers = users ? JSON.parse(users) : [];
      parsedUsers.push(user);
      await AsyncStorage.setItem('users', JSON.stringify(parsedUsers));
      console.log('Updated users collection');
      
      // Save as current user
      await AsyncStorage.setItem('user', JSON.stringify(user));
      console.log('Saved current user');
      
      // Clear temp user
      await AsyncStorage.removeItem('tempUser');
      console.log('Cleared temp user');
      
      return true;
    } catch (error) {
      console.error('Error completing registration:', error);
      return false;
    }
  };
  
// Logout user
export const logoutUser = async () => {
  try {
    await AsyncStorage.removeItem('user');
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};

// utils/idGenerator.js
export const generateId = (prefix = '') => {
  return `${prefix}${Date.now().toString(36)}${Math.random().toString(36).substr(2, 5)}`;
};