import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Camera, Upload, ArrowLeft } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function StartTripScreen() {
  const [startKm, setStartKm] = useState('');
  const [odometerPhoto, setOdometerPhoto] = useState<string | null>(null);
  const router = useRouter();

  const takeOdometerPhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setOdometerPhoto(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const handleStartTrip = () => {
    if (!startKm || !odometerPhoto) {
      Alert.alert('Error', 'Please enter start KM and upload odometer photo');
      return;
    }

    Alert.alert(
      'Trip Started',
      `Trip started successfully with ${startKm} KM`,
      [{ text: 'OK', onPress: () => router.back() }]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Start Trip</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Record Trip Start</Text>
        <Text style={styles.subtitle}>Upload odometer photo and enter current reading</Text>

        <View style={styles.photoSection}>
          <Text style={styles.sectionTitle}>Odometer Photo</Text>
          {odometerPhoto ? (
            <View style={styles.photoContainer}>
              <Image source={{ uri: odometerPhoto }} style={styles.photo} />
              <TouchableOpacity style={styles.retakeButton} onPress={takeOdometerPhoto}>
                <Text style={styles.retakeButtonText}>Retake Photo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.photoButton} onPress={takeOdometerPhoto}>
              <Camera color="#6B7280" size={32} />
              <Text style={styles.photoButtonText}>Take Odometer Photo</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.sectionTitle}>Starting Kilometer</Text>
          <TextInput
            style={styles.kmInput}
            placeholder="Enter current KM reading (e.g., 10230)"
            value={startKm}
            onChangeText={setStartKm}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[styles.startButton, (!startKm || !odometerPhoto) && styles.disabledButton]}
          onPress={handleStartTrip}
          disabled={!startKm || !odometerPhoto}
        >
          <Text style={styles.startButtonText}>Start Trip</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 32,
  },
  photoSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 12,
  },
  photoButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
  },
  photoButtonText: {
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  photoContainer: {
    alignItems: 'center',
  },
  photo: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 12,
  },
  retakeButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  retakeButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
  },
  inputSection: {
    marginBottom: 32,
  },
  kmInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  startButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});