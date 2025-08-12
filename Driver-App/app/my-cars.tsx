import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { ArrowLeft, Car, Plus, X, Check } from 'lucide-react-native';

const carTypes = ['Sedan', 'Hatchback', 'SUV', 'Innova', 'Innova Crysta', 'Other'];

export default function MyCarsScreen() {
  const { user, setUser } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCar, setNewCar] = useState({ name: '', type: '', registration: '' });

  const addCar = () => {
    if (!newCar.name || !newCar.type || !newCar.registration) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const carToAdd = {
      id: Date.now().toString(),
      ...newCar,
      isDefault: user?.cars?.length === 0,
    };

    const updatedUser = {
      ...user,
      cars: [...(user?.cars || []), carToAdd]
    };

    setUser(updatedUser);
    setNewCar({ name: '', type: '', registration: '' });
    setShowAddModal(false);
    Alert.alert('Success', 'Car added successfully');
  };

  const setDefaultCar = (carId) => {
    const updatedCars = user?.cars?.map(car => ({
      ...car,
      isDefault: car.id === carId
    }));

    setUser({ ...user, cars: updatedCars });
    Alert.alert('Success', 'Default car updated');
  };



  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerContent: {
      alignItems: 'center',
    },
    headerTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 2,
    },
    headerSubtitle: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    carCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    carHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    carName: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    defaultBadge: {
      backgroundColor: colors.success,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    defaultText: {
      fontSize: 10,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    carDetails: {
      marginBottom: 12,
    },
    carDetailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 4,
    },
    carDetailLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    carDetailValue: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    carActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    actionButton: {
      backgroundColor: colors.background,
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    defaultButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    actionButtonText: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: colors.textSecondary,
    },
    defaultButtonText: {
      color: '#FFFFFF',
    },
    addButton: {
      backgroundColor: colors.primary,
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      marginTop: 20,
    },
    addButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
      marginTop: 8,
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      width: '90%',
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    modalTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    closeButton: {
      padding: 8,
    },
    inputGroup: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 8,
    },
    input: {
      backgroundColor: colors.background,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      borderWidth: 1,
      borderColor: colors.border,
    },
    typeSelector: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    typeButton: {
      backgroundColor: colors.background,
      borderRadius: 8,
      paddingHorizontal: 12,
      paddingVertical: 8,
      marginRight: 8,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedTypeButton: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    typeButtonText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    selectedTypeButtonText: {
      color: '#FFFFFF',
    },
    submitButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 20,
    },
    submitButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
  });

  const CarCard = ({ car }) => (
    <View style={dynamicStyles.carCard}>
      <View style={dynamicStyles.carHeader}>
        <Text style={dynamicStyles.carName}>{car.name}</Text>
        {car.isDefault && (
          <View style={dynamicStyles.defaultBadge}>
            <Text style={dynamicStyles.defaultText}>DEFAULT</Text>
          </View>
        )}
      </View>

      <View style={dynamicStyles.carDetails}>
        <View style={dynamicStyles.carDetailRow}>
          <Text style={dynamicStyles.carDetailLabel}>Type:</Text>
          <Text style={dynamicStyles.carDetailValue}>{car.type}</Text>
        </View>
        <View style={dynamicStyles.carDetailRow}>
          <Text style={dynamicStyles.carDetailLabel}>Registration:</Text>
          <Text style={dynamicStyles.carDetailValue}>{car.registration}</Text>
        </View>
      </View>

      <View style={dynamicStyles.carActions}>
        {!car.isDefault && (
          <TouchableOpacity 
            style={[dynamicStyles.actionButton, dynamicStyles.defaultButton]}
            onPress={() => setDefaultCar(car.id)}
          >
            <Text style={[dynamicStyles.actionButtonText, dynamicStyles.defaultButtonText]}>
              Set Default
            </Text>
          </TouchableOpacity>
        )}

      </View>
    </View>
  );

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <View style={dynamicStyles.headerContent}>
          <Text style={dynamicStyles.headerTitle}>My Cars</Text>
          <Text style={dynamicStyles.headerSubtitle}>Welcome back, {user?.name}!</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {user?.cars?.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}

        <TouchableOpacity 
          style={dynamicStyles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus color="#FFFFFF" size={24} />
          <Text style={dynamicStyles.addButtonText}>Add New Car</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={showAddModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={dynamicStyles.modalOverlay}>
          <View style={dynamicStyles.modalContent}>
            <View style={dynamicStyles.modalHeader}>
              <Text style={dynamicStyles.modalTitle}>Add New Car</Text>
              <TouchableOpacity 
                onPress={() => setShowAddModal(false)}
                style={dynamicStyles.closeButton}
              >
                <X color={colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>

            <View style={dynamicStyles.inputGroup}>
              <Text style={dynamicStyles.inputLabel}>Car Name</Text>
              <TextInput
                style={dynamicStyles.input}
                placeholder="e.g., Tata Nexon"
                value={newCar.name}
                onChangeText={(value) => setNewCar({ ...newCar, name: value })}
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={dynamicStyles.inputGroup}>
              <Text style={dynamicStyles.inputLabel}>Car Type</Text>
              <View style={dynamicStyles.typeSelector}>
                {carTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      dynamicStyles.typeButton,
                      newCar.type === type && dynamicStyles.selectedTypeButton
                    ]}
                    onPress={() => setNewCar({ ...newCar, type })}
                  >
                    <Text style={[
                      dynamicStyles.typeButtonText,
                      newCar.type === type && dynamicStyles.selectedTypeButtonText
                    ]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={dynamicStyles.inputGroup}>
              <Text style={dynamicStyles.inputLabel}>Registration Number</Text>
              <TextInput
                style={dynamicStyles.input}
                placeholder="e.g., TN10BZ1234"
                value={newCar.registration}
                onChangeText={(value) => setNewCar({ ...newCar, registration: value.toUpperCase() })}
                autoCapitalize="characters"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <TouchableOpacity style={dynamicStyles.submitButton} onPress={addCar}>
              <Text style={dynamicStyles.submitButtonText}>Add Car</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );
}