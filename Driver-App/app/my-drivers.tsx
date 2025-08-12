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
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, User, Phone, Plus, X, Upload, FileText } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

const dummyDrivers = [
  {
    id: '1',
    name: 'Kumar',
    mobile: '9876543211',
    aadhar: null,
    rcFront: null,
    rcBack: null,
    status: 'active'
  },
  {
    id: '2',
    name: 'Suresh',
    mobile: '9876543212',
    aadhar: 'uploaded',
    rcFront: 'uploaded',
    rcBack: 'uploaded',
    status: 'active'
  },
];

export default function MyDriversScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const router = useRouter();
  const [drivers, setDrivers] = useState(dummyDrivers);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDriver, setNewDriver] = useState({
    name: '',
    mobile: '',
    aadhar: null,
    rcFront: null,
    rcBack: null,
  });

  const pickDocument = async (documentType) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setNewDriver({
          ...newDriver,
          [documentType]: result.assets[0].uri
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const addDriver = () => {
    if (!newDriver.name || !newDriver.mobile) {
      Alert.alert('Error', 'Please enter driver name and mobile number');
      return;
    }

    if (newDriver.mobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    const driverToAdd = {
      id: Date.now().toString(),
      ...newDriver,
      status: 'active'
    };

    setDrivers([...drivers, driverToAdd]);
    setNewDriver({ name: '', mobile: '', aadhar: null, rcFront: null, rcBack: null });
    setShowAddModal(false);
    Alert.alert('Success', 'Driver added successfully');
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
    driverCard: {
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
    driverHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    driverName: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
    },
    statusBadge: {
      backgroundColor: colors.success,
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 8,
    },
    statusText: {
      fontSize: 10,
      fontFamily: 'Inter-SemiBold',
      color: '#FFFFFF',
    },
    driverDetails: {
      marginBottom: 12,
    },
    driverDetailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    driverDetailText: {
      marginLeft: 8,
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    documentsSection: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 12,
    },
    documentsTitle: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 8,
    },
    documentRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 4,
    },
    documentLabel: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
    },
    documentStatus: {
      fontSize: 12,
      fontFamily: 'Inter-SemiBold',
      color: colors.success,
    },
    pendingStatus: {
      color: colors.warning,
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
      maxHeight: '80%',
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
    documentSection: {
      marginBottom: 16,
    },
    documentButton: {
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 16,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      marginTop: 8,
    },
    uploadedButton: {
      borderColor: colors.success,
      backgroundColor: colors.success + '10',
      borderStyle: 'solid',
    },
    documentButtonText: {
      fontSize: 12,
      fontFamily: 'Inter-Medium',
      color: colors.textSecondary,
      marginTop: 8,
    },
    uploadedText: {
      color: colors.success,
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

  const DriverCard = ({ driver }) => (
    <View style={dynamicStyles.driverCard}>
      <View style={dynamicStyles.driverHeader}>
        <Text style={dynamicStyles.driverName}>{driver.name}</Text>
        <View style={dynamicStyles.statusBadge}>
          <Text style={dynamicStyles.statusText}>{driver.status.toUpperCase()}</Text>
        </View>
      </View>

      <View style={dynamicStyles.driverDetails}>
        <View style={dynamicStyles.driverDetailRow}>
          <Phone color={colors.textSecondary} size={16} />
          <Text style={dynamicStyles.driverDetailText}>{driver.mobile}</Text>
        </View>
      </View>

      <View style={dynamicStyles.documentsSection}>
        <Text style={dynamicStyles.documentsTitle}>Documents</Text>
        <View style={dynamicStyles.documentRow}>
          <Text style={dynamicStyles.documentLabel}>Aadhar:</Text>
          <Text style={[
            dynamicStyles.documentStatus,
            !driver.aadhar && dynamicStyles.pendingStatus
          ]}>
            {driver.aadhar ? 'Uploaded' : 'Pending'}
          </Text>
        </View>
        <View style={dynamicStyles.documentRow}>
          <Text style={dynamicStyles.documentLabel}>RC Front:</Text>
          <Text style={[
            dynamicStyles.documentStatus,
            !driver.rcFront && dynamicStyles.pendingStatus
          ]}>
            {driver.rcFront ? 'Uploaded' : 'Pending'}
          </Text>
        </View>
        <View style={dynamicStyles.documentRow}>
          <Text style={dynamicStyles.documentLabel}>RC Back:</Text>
          <Text style={[
            dynamicStyles.documentStatus,
            !driver.rcBack && dynamicStyles.pendingStatus
          ]}>
            {driver.rcBack ? 'Uploaded' : 'Pending'}
          </Text>
        </View>
      </View>
    </View>
  );

  const DocumentUpload = ({ label, documentKey }) => (
    <View style={dynamicStyles.documentSection}>
      <Text style={dynamicStyles.inputLabel}>{label}</Text>
      <TouchableOpacity
        style={[
          dynamicStyles.documentButton,
          newDriver[documentKey] && dynamicStyles.uploadedButton
        ]}
        onPress={() => pickDocument(documentKey)}
      >
        {newDriver[documentKey] ? (
          <FileText color={colors.success} size={24} />
        ) : (
          <Upload color={colors.textSecondary} size={24} />
        )}
        <Text style={[
          dynamicStyles.documentButtonText,
          newDriver[documentKey] && dynamicStyles.uploadedText
        ]}>
          {newDriver[documentKey] ? 'Document Uploaded' : `Upload ${label}`}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <View style={dynamicStyles.headerContent}>
          <Text style={dynamicStyles.headerTitle}>My Drivers</Text>
          <Text style={dynamicStyles.headerSubtitle}>Welcome back, {user?.name}!</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={dynamicStyles.content} showsVerticalScrollIndicator={false}>
        {drivers.map((driver) => (
          <DriverCard key={driver.id} driver={driver} />
        ))}

        <TouchableOpacity 
          style={dynamicStyles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus color="#FFFFFF" size={24} />
          <Text style={dynamicStyles.addButtonText}>Add New Driver</Text>
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
              <Text style={dynamicStyles.modalTitle}>Add New Driver</Text>
              <TouchableOpacity 
                onPress={() => setShowAddModal(false)}
                style={dynamicStyles.closeButton}
              >
                <X color={colors.textSecondary} size={24} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={dynamicStyles.inputGroup}>
                <Text style={dynamicStyles.inputLabel}>Driver Name</Text>
                <TextInput
                  style={dynamicStyles.input}
                  placeholder="Enter driver name"
                  value={newDriver.name}
                  onChangeText={(value) => setNewDriver({ ...newDriver, name: value })}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <View style={dynamicStyles.inputGroup}>
                <Text style={dynamicStyles.inputLabel}>Mobile Number</Text>
                <TextInput
                  style={dynamicStyles.input}
                  placeholder="Enter mobile number"
                  value={newDriver.mobile}
                  onChangeText={(value) => setNewDriver({ ...newDriver, mobile: value })}
                  keyboardType="phone-pad"
                  maxLength={10}
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              <Text style={[dynamicStyles.inputLabel, { marginBottom: 16 }]}>
                Optional Documents
              </Text>

              <DocumentUpload label="Aadhar Card" documentKey="aadhar" />
              <DocumentUpload label="RC Front" documentKey="rcFront" />
              <DocumentUpload label="RC Back" documentKey="rcBack" />

              <TouchableOpacity style={dynamicStyles.submitButton} onPress={addDriver}>
                <Text style={dynamicStyles.submitButtonText}>Add Driver</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}