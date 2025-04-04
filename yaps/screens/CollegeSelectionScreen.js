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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { getColleges } from '../utils/storage';
import { getTempUser } from '../utils/auth';

export default function CollegeSelectionScreen({ navigation }) {
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Get colleges data
        const collegesData = await getColleges();
        setColleges(collegesData);
        setFilteredColleges(collegesData);
        
        // Get temp user
        const tempUser = await getTempUser();
        setUser(tempUser);
      } catch (error) {
        console.error('Error loading colleges:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter colleges based on search
  useEffect(() => {
    if (search) {
      const filtered = colleges.filter(college =>
        college.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredColleges(filtered);
    } else {
      setFilteredColleges(colleges);
    }
  }, [search, colleges]);

  const handleSelectCollege = (college) => {
    setSelectedCollege(college.id);
  };

  const handleContinue = () => {
    if (selectedCollege) {
      navigation.navigate('CourseSelection', { collegeId: selectedCollege });
    }
  };

  const renderCollegeItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.collegeItem,
        selectedCollege === item.id && styles.selectedCollegeItem,
      ]}
      onPress={() => handleSelectCollege(item)}
    >
      <Text style={styles.collegeName}>{item.name}</Text>
      {selectedCollege === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#4630eb" />
      )}
    </TouchableOpacity>
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
      <Header title="Select Your College" showBackButton={true} />
      
      <View style={styles.content}>
        <Text style={styles.title}>Which college do you attend?</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for your college..."
            value={search}
            onChangeText={setSearch}
          />
        </View>
        
        <FlatList
          data={filteredColleges}
          renderItem={renderCollegeItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
        
        <TouchableOpacity
          style={[styles.button, !selectedCollege && styles.buttonDisabled]}
          onPress={handleContinue}
          disabled={!selectedCollege}
        >
          <Text style={styles.buttonText}>Continue</Text>
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
  collegeItem: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedCollegeItem: {
    backgroundColor: '#f0f0ff',
    borderColor: '#4630eb',
    borderWidth: 1,
  },
  collegeName: {
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4630eb',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
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