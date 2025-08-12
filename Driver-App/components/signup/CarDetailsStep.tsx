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
import { Car, Plus, ArrowRight, ArrowLeft, X } from 'lucide-react-native';

const carTypes = ['Sedan', 'Hatchback', 'SUV', 'Innova', 'Innova Crysta', 'Other'];

interface CarDetailsStepProps {
  data: any[];
  onUpdate: (data: any[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function CarDetailsStep({ data, onUpdate, onNext, onBack }: CarDetailsStepProps) {
  const [cars, setCars] = useState(data.length > 0 ? data : [{ id: '1', name: '', type: '', registration: '', isDefault: true }]);

  const updateCar = (index: number, field: string, value: string) => {
    const updatedCars = [...cars];
    updatedCars[index] = { ...updatedCars[index], [field]: value };
    setCars(updatedCars);
  };

  const addCar = () => {
    const newCar = {
      id: Date.now().toString(),
      name: '',
      type: '',
      registration: '',
      isDefault: false
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

  const handleNext = () => {
    const isValid = cars.every(car => car.name && car.type && car.registration);
    
    if (!isValid) {
      Alert.alert('Error', 'Please fill all car details');
      return;
    }

    onUpdate(cars);
    onNext();
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
      <Text style={styles.subtitle}>Add your vehicle information</Text>

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
                placeholder="Car Name (e.g., Tata Nexon)"
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
                placeholder="Registration Number"
                value={car.registration}
                onChangeText={(value) => updateCar(index, 'registration', value.toUpperCase())}
                autoCapitalize="characters"
              />
            </View>

            <Text style={styles.photoNote}>Car photo can be uploaded later</Text>
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

        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
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
  photoNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    fontStyle: 'italic',
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
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
});