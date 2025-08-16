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
import { ArrowLeft, User, Phone, MapPin, Hash, Upload, Save } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import * as ImagePicker from 'expo-image-picker';



export default function AddDriverScreen() {
  const [driverData, setDriverData] = useState({
    name: '',
    mobile: '',
    address: '',
    aadharNumber: '',
    licenseNumber: '',
    experience: '',
  });
  const [documents, setDocuments] = useState({
    aadharFront: '',
    aadharBack: '',
    licenseFront: '',
    licenseBack: '',
    profilePhoto: '',
  });
  const router = useRouter();
  const { user } = useAuth();

  const pickDocument = async (documentKey: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setDocuments(prev => ({
          ...prev,
          [documentKey]: result.assets[0].uri
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSave = () => {
    if (!driverData.name || !driverData.mobile || !driverData.address || !driverData.aadharNumber) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }



    if (!documents.aadharFront || !documents.licenseFront) {
      Alert.alert('Error', 'Please upload required documents');
      return;
    }

    // Here you would typically save to API
    // For now, we'll just navigate to the next step
    Alert.alert(
      'Success', 
      'Driver added successfully! Your documents are now under review.',
      [
        {
          text: 'OK',
          onPress: () => router.push('/documents-review')
        }
      ]
    );
  };

  const DocumentUpload = ({ docType, required = false }: { 
    docType: { key: keyof typeof documents; label: string }; 
    required?: boolean; 
  }) => {
    const isUploaded = documents[docType.key];
    
    return (
      <TouchableOpacity
        style={[styles.documentCard, isUploaded && styles.uploadedCard]}
        onPress={() => pickDocument(docType.key)}
      >
        <View style={styles.documentLeft}>
          <View style={[styles.documentIcon, isUploaded && styles.uploadedIcon]}>
            {isUploaded ? (
              <Upload color="#FFFFFF" size={20} />
            ) : (
              <Upload color="#6B7280" size={20} />
            )}
          </View>
          <View>
            <Text style={styles.documentTitle}>{docType.label}</Text>
            <Text style={styles.documentStatus}>
              {isUploaded ? 'Uploaded' : required ? 'Required' : 'Optional'}
            </Text>
          </View>
        </View>
        <Upload color={isUploaded ? "#10B981" : "#6B7280"} size={20} />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Your First Driver</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 2/3</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Driver Profile Setup</Text>
          <Text style={styles.welcomeSubtitle}>
            Now let's add your first driver. This person will be driving your car.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Driver Personal Details</Text>
          
          <View style={styles.inputGroup}>
            <User color="#6B7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Driver Full Name"
              value={driverData.name}
              onChangeText={(text) => setDriverData(prev => ({ ...prev, name: text }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <Phone color="#6B7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Driver Mobile Number"
              value={driverData.mobile}
              onChangeText={(text) => setDriverData(prev => ({ ...prev, mobile: text }))}
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <MapPin color="#6B7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Driver Address"
              value={driverData.address}
              onChangeText={(text) => setDriverData(prev => ({ ...prev, address: text }))}
              multiline
              numberOfLines={3}
            />
          </View>

          <View style={styles.inputGroup}>
            <Hash color="#6B7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Driver Aadhar Number"
              value={driverData.aadharNumber}
              onChangeText={(text) => setDriverData(prev => ({ ...prev, aadharNumber: text }))}
              keyboardType="numeric"
              maxLength={12}
            />
          </View>

          <View style={styles.inputGroup}>
            <Hash color="#6B7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Driver License Number"
              value={driverData.licenseNumber}
              onChangeText={(text) => setDriverData(prev => ({ ...prev, licenseNumber: text }))}
            />
          </View>

          <View style={styles.inputGroup}>
            <User color="#6B7280" size={20} />
            <TextInput
              style={styles.input}
              placeholder="Years of Driving Experience"
              value={driverData.experience}
              onChangeText={(text) => setDriverData(prev => ({ ...prev, experience: text }))}
              keyboardType="numeric"
              maxLength={2}
            />
          </View>



          <Text style={styles.sectionTitle}>Required Documents</Text>
          
          <DocumentUpload 
            docType={{ key: 'aadharFront', label: 'Aadhar Front Image' }} 
            required={true} 
          />
          <DocumentUpload 
            docType={{ key: 'aadharBack', label: 'Aadhar Back Image' }} 
            required={true} 
          />
          <DocumentUpload 
            docType={{ key: 'licenseFront', label: 'Driving License Front' }} 
            required={true} 
          />
          <DocumentUpload 
            docType={{ key: 'licenseBack', label: 'Driving License Back' }} 
            required={false} 
          />
          <DocumentUpload 
            docType={{ key: 'profilePhoto', label: 'Driver Profile Photo' }} 
            required={false} 
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Save color="#FFFFFF" size={20} />
            <Text style={styles.saveButtonText}>Save Driver & Continue</Text>
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
    marginTop: 24,
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
  documentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  uploadedCard: {
    borderColor: '#10B981',
    backgroundColor: '#F0FDF4',
  },
  documentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  uploadedIcon: {
    backgroundColor: '#10B981',
  },
  documentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  documentStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
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


