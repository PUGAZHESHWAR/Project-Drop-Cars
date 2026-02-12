import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { Car, Plus, ArrowRight, ArrowLeft, X, Upload, CheckCircle, FileText } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { addCarDetails, CarDetailsData } from '@/services/auth/signupService';

const carTypes = ['HATCHBACK', 'SEDAN', 'NEW SEDAN', 'SUV', 'INNOVA', 'INNOVA CRYSTA'];

interface CarDetailsStepProps {
  data: any[];
  onUpdate: (data: any[]) => void;
  onNext: () => void;
  onBack: () => void;
  vehicleOwnerId?: string;
  organizationId?: string;
}

export default function CarDetailsStep({ data, onUpdate, onNext, onBack, vehicleOwnerId, organizationId }: CarDetailsStepProps) {
  const [cars, setCars] = useState(data.length > 0 ? data : [{ 
    id: '1', 
    name: '', 
    type: '', 
    registration: '', 
    isDefault: true,
    rcFrontImg: null,
    rcBackImg: null,
    insuranceImg: null,
    fcImg: null,
    carImg: null
  }]);
  const [loading, setLoading] = useState(false);

  const updateCar = (index: number, field: string, value: string) => {
    const updatedCars = [...cars];
    updatedCars[index] = { ...updatedCars[index], [field]: value };
    setCars(updatedCars);
  };

  const updateCarImage = (index: number, field: string, imageUri: string) => {
    const updatedCars = [...cars];
    updatedCars[index] = { ...updatedCars[index], [field]: imageUri };
    setCars(updatedCars);
  };

  const addCar = () => {
    const newCar = {
      id: Date.now().toString(),
      name: '',
      type: '',
      registration: '',
      isDefault: false,
      rcFrontImg: null,
      rcBackImg: null,
      insuranceImg: null,
      fcImg: null,
      carImg: null
    };
    setCars([...cars, newCar]);
  };

  const removeCar = (index: number) => {
    if (cars.length === 1) {
      Alert.alert('Error', 'At least one car is required');
      return;
    }
    const updatedCars = cars.filter((_, i) => i !== index);
    setCars(updatedCars);
  };

  const pickImage = async (index: number, field: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        updateCarImage(index, field, result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleNext = async () => {
    const isValid = cars.every(car => 
      car.name && 
      car.type && 
      car.registration &&
      car.rcFrontImg &&
      car.rcBackImg &&
      car.insuranceImg &&
      car.fcImg &&
      car.carImg
    );
    
    if (!isValid) {
      Alert.alert('Error', 'Please fill all car details and upload all required images');
      return;
    }

    // Validate car data structure
    const firstCar = cars[0];
    console.log('Validating car data structure for:', firstCar.name);

    console.log('Car data validation completed');

    // For now, just update and proceed
    // In a real app, you might want to call the API here
    onUpdate(cars);
    onNext();
  };

  const ImageUpload = ({ car, index, field, label, required }: { 
    car: any; 
    index: number; 
    field: string; 
    label: string; 
    required: boolean; 
  }) => {
    const imageUri = car[field];
    const isUploaded = !!imageUri;
    
    return (
      <TouchableOpacity
        style={[styles.imageUploadCard, isUploaded && styles.uploadedImageCard]}
        onPress={() => pickImage(index, field)}
      >
        <View style={styles.imageUploadLeft}>
          <View style={[styles.imageUploadIcon, isUploaded && styles.uploadedImageIcon]}>
            {isUploaded ? (
              <CheckCircle color="#FFFFFF" size={20} />
            ) : (
              <FileText color="#6B7280" size={20} />
            )}
          </View>
          <View>
            <Text style={styles.imageUploadTitle}>{label}</Text>
            <Text style={styles.imageUploadStatus}>
              {isUploaded ? 'Uploaded' : required ? 'Required' : 'Optional'}
            </Text>
          </View>
        </View>
        <Upload color={isUploaded ? "#10B981" : "#6B7280"} size={20} />
      </TouchableOpacity>
    );
  };

  const CarTypeSelector = ({ selectedType, onSelect }) => (
    <View style={styles.typeSelector}>
      {carTypes.map((type) => (
        <TouchableOpacity
          key={type}
          style={[
            styles.typeButton,
            selectedType === type && styles.selectedTypeButton
          ]}
          onPress={() => onSelect(type)}
        >
          <Text style={[
            styles.typeButtonText,
            selectedType === type && styles.selectedTypeButtonText
          ]}>
            {type}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Car Details</Text>
      <Text style={styles.subtitle}>Add your vehicle information and upload required documents</Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cars.map((car, index) => (
          <View key={car.id} style={styles.carCard}>
            <View style={styles.carHeader}>
              <Text style={styles.carTitle}>
                Car {index + 1}
                {car.isDefault && <Text style={styles.defaultLabel}> (Default)</Text>}
              </Text>
              {cars.length > 1 && (
                <TouchableOpacity onPress={() => removeCar(index)} style={styles.removeButton}>
                  <X color="#EF4444" size={20} />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.inputGroup}>
              <Car color="#6B7280" size={20} />
              <TextInput
                style={styles.input}
                placeholder="Car Name (e.g., Toyota Camry)"
                value={car.name}
                onChangeText={(value) => updateCar(index, 'name', value)}
              />
            </View>

            <Text style={styles.fieldLabel}>Car Type</Text>
            <CarTypeSelector
              selectedType={car.type}
              onSelect={(type) => updateCar(index, 'type', type)}
            />

            <View style={styles.inputGroup}>
              <Text style={styles.inputIcon}>REG</Text>
              <TextInput
                style={styles.input}
                placeholder="Registration Number (e.g., MH-12-AB-1234)"
                value={car.registration}
                onChangeText={(value) => updateCar(index, 'registration', value.toUpperCase())}
                autoCapitalize="characters"
              />
            </View>

            <Text style={styles.fieldLabel}>Required Documents</Text>
            
            <ImageUpload 
              car={car} 
              index={index} 
              field="rcFrontImg" 
              label="RC Front Image" 
              required={true} 
            />
            
            <ImageUpload 
              car={car} 
              index={index} 
              field="rcBackImg" 
              label="RC Back Image" 
              required={true} 
            />
            
            <ImageUpload 
              car={car} 
              index={index} 
              field="insuranceImg" 
              label="Insurance Image" 
              required={true} 
            />
            
            <ImageUpload 
              car={car} 
              index={index} 
              field="fcImg" 
              label="FC Image" 
              required={true} 
            />
            
            <ImageUpload 
              car={car} 
              index={index} 
              field="carImg" 
              label="Car Image" 
              required={true} 
            />
          </View>
        ))}

        <TouchableOpacity style={styles.addCarButton} onPress={addCar}>
          <Plus color="#3B82F6" size={20} />
          <Text style={styles.addCarButtonText}>Add Another Car</Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#6B7280" size={20} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.nextButton, loading && styles.nextButtonDisabled]} 
          onPress={handleNext}
          disabled={loading}
        >
          <Text style={styles.nextButtonText}>
            {loading ? 'Processing...' : 'Next'}
          </Text>
          <ArrowRight color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    marginBottom: 24,
  },
  content: {
    flex: 1,
  },
  carCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  carTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  defaultLabel: {
    color: '#3B82F6',
    fontSize: 12,
  },
  removeButton: {
    padding: 4,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  inputIcon: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#6B7280',
    width: 20,
    textAlign: 'center',
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginBottom: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  typeButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedTypeButton: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  typeButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  selectedTypeButtonText: {
    color: '#FFFFFF',
  },
  imageUploadCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  uploadedImageCard: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  imageUploadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  imageUploadIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  uploadedImageIcon: {
    backgroundColor: '#10B981',
  },
  imageUploadTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  imageUploadStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
  },
  addCarButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#3B82F6',
    borderStyle: 'dashed',
    marginBottom: 24,
  },
  addCarButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#3B82F6',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  backButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  nextButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
});