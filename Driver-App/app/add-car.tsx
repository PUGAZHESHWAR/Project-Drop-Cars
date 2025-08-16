import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, Car, Save } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function AddCarScreen() {
  const [carData, setCarData] = useState({
    name: '',
    type: '',
    registration: '',
    model: '',
    year: '',
    color: '',
  });
  const router = useRouter();
  const { user } = useAuth();

  const handleSave = () => {
    if (!carData.name || !carData.type || !carData.registration) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    // Here you would typically save to API
    // For now, we'll just navigate to the next step
    Alert.alert(
      'Success', 
      'Car added successfully! Now add your first driver.',
      [
        {
          text: 'OK',
          onPress: () => router.push('/add-driver')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Your First Car</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 1/3</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Welcome to Drop Cars!</Text>
          <Text style={styles.welcomeSubtitle}>
            Hi {user?.fullName}, let's get you started by adding your first car and driver.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Car Details</Text>
          
          <View style={styles.inputGroup}>
            <Car color="#6B7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Car Name (e.g., Tata Nexon)"
              value={carData.name}
              onChangeText={(text) => setCarData(prev => ({ ...prev, name: text }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Car color="#6B7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Car Type (e.g., SUV, Sedan, Hatchback)"
              value={carData.type}
              onChangeText={(text) => setCarData(prev => ({ ...prev, type: text }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Car color="#6B7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Registration Number (e.g., TN10BZ1234)"
              value={carData.registration}
              onChangeText={(text) => setCarData(prev => ({ ...prev, registration: text.toUpperCase() }))}
              autoCapitalize="characters"
            />
          </View>

          <View style={styles.inputGroup}>
            <Car color="#6B7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Model Year (e.g., 2023)"
              value={carData.year}
              onChangeText={(text) => setCarData(prev => ({ ...prev, year: text }))}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Car color="#6B7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Color (e.g., White, Black, Red)"
              value={carData.color}
              onChangeText={(text) => setCarData(prev => ({ ...prev, color: text }))}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save color="#FFFFFF" size={20} />
            <Text style={styles.saveButtonText}>Save Car & Continue</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  stepIndicator: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  welcomeSection: {
    backgroundColor: '#F0F9FF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#3B82F6',
  },
  welcomeTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  form: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 20,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
});


