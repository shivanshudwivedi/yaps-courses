import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View, SafeAreaView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import navigation
import MainNavigator from './navigation';
// Import screens
import LoginScreen from './screens/LoginScreen';
import CollegeSelectionScreen from './screens/CollegeSelectionScreen';
import CourseSelectionScreen from './screens/CourseSelectionScreen';
import CourseDiscussionScreen from './screens/CourseDiscussionScreen';
// Import utilities
import { isLoggedIn } from './utils/auth';
import { initializeStorage } from './utils/storage';

// Create navigator
const Stack = createStackNavigator();

// Main app component
export default function App() {
  const [loading, setLoading] = useState(true);
  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    const bootstrapAsync = async () => {
      try {
        // For development: clear any existing data to ensure fresh setup
        // Remove this in production!
        // const resetStorage = async () => {
        //   try {
        //     console.log('Resetting storage for development...');
        //     await AsyncStorage.clear();
        //   } catch (e) {
        //     console.error('Error resetting storage:', e);
        //   }
        // };
        
        // Uncomment to reset during development
        // await resetStorage();
        
        // Initialize storage with demo data
        await initializeStorage();
        
        // Check if user is logged in
        const loggedIn = await isLoggedIn();
        console.log('User logged in:', loggedIn);
        setUserLoggedIn(loggedIn);
      } catch (e) {
        console.error('Error initializing app:', e);
      } finally {
        setLoading(false);
      }
    };
    
    bootstrapAsync();
  }, []);
  
  // Create a wrapper component that provides navigation to our listener
  const AppContent = () => {
    const navigation = useNavigation();
    
    useEffect(() => {
      // Add a focus listener to recheck login status when returning to the app
      const unsubscribe = navigation.addListener('state', async () => {
        try {
          const loggedIn = await isLoggedIn();
          if (loggedIn !== userLoggedIn) {
            console.log('Login state changed to:', loggedIn);
            setUserLoggedIn(loggedIn);
          }
        } catch (e) {
          console.error('Error checking login state:', e);
        }
      });
      
      return unsubscribe;
    }, [navigation, userLoggedIn]);
    
    return (
      <>
        <StatusBar style="auto" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!userLoggedIn ? (
            // Auth screens
            <>
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="CollegeSelection" component={CollegeSelectionScreen} />
              <Stack.Screen name="CourseSelection" component={CourseSelectionScreen} />
            </>
          ) : (
            // App screens
            <>
              <Stack.Screen name="MainTabs" component={MainNavigator} />
              <Stack.Screen 
                name="CourseDiscussion" 
                component={CourseDiscussionScreen}
                options={{ headerShown: true, title: 'Course Discussion' }}
              />
            </>
          )}
        </Stack.Navigator>
      </>
    );
  };
  
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#4630eb" />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <AppContent />
    </NavigationContainer>
  );
}