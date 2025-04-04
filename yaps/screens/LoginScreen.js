import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { loginUser, storeTempUser } from '../utils/auth';
import { generateId } from '../utils/auth';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    // Simple validation
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    // For prototype: check if it's a .edu email
    if (!email.toLowerCase().endsWith('.edu')) {
      Alert.alert('Invalid Email', 'Please use a valid college email (.edu)');
      return;
    }

    setIsLoading(true);

    try {
      // Try to login with existing account
      const result = await loginUser(email);
      
      if (result.success) {
        // User found, go to main screen
        navigation.replace('Main');
      } else {
        // Create a new user and go to college selection
        const tempUser = {
          id: generateId('user'),
          email: email.toLowerCase(),
        };
        
        await storeTempUser(tempUser);
        navigation.navigate('CollegeSelection');
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo placeholder */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>CourseChat</Text>
          </View>

          <Text style={styles.title}>Welcome to CourseChat</Text>
          <Text style={styles.subtitle}>
            Anonymous discussions for your college courses
          </Text>

          <View style={styles.formContainer}>
            <TextInput
              style={styles.input}
              placeholder="Your college email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              autoCompleteType="email"
            />

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Loading...' : 'Continue'}
              </Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.footerText}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#4630eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
    marginBottom: 30,
  },
  input: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
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
  footerText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
});