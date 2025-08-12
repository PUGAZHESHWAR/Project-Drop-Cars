import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, Upload, Check, FileText } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

interface DocumentsStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onBack: () => void;
  formData: any;
}

const documentTypes = [
  { key: 'aadharFront', label: 'Aadhar Front', required: true },
  { key: 'aadharBack', label: 'Aadhar Back', required: true },
  { key: 'rcFront', label: 'RC Front', required: true },
  { key: 'rcBack', label: 'RC Back', required: true },
  { key: 'insurance', label: 'Insurance', required: true },
  { key: 'fitnessCertificate', label: 'Fitness Certificate', required: true },
  { key: 'permit', label: 'Permit', required: true },
];

export default function DocumentsStep({ data, onUpdate, onBack, formData }: DocumentsStepProps) {
  const [documents, setDocuments] = useState(data);
  const { login } = useAuth();
  const router = useRouter();

  const pickDocument = async (documentKey: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const updatedDocuments = {
          ...documents,
          [documentKey]: result.assets[0].uri
        };
        setDocuments(updatedDocuments);
        onUpdate(updatedDocuments);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleSubmit = async () => {
    const requiredDocs = documentTypes.filter(doc => doc.required);
    const missingDocs = requiredDocs.filter(doc => !documents[doc.key]);

    if (missingDocs.length > 0) {
      Alert.alert('Error', 'Please upload all required documents');
      return;
    }

    try {
      // Create complete user profile
      const completeUserData = {
        id: Date.now().toString(),
        ...formData.personalDetails,
        cars: formData.carDetails,
        documents: documents,
      };

      await login(completeUserData, 'registration-jwt-token');
      router.replace('/(tabs)');
      Alert.alert('Success', 'Registration completed successfully!');
    } catch (error) {
      Alert.alert('Error', 'Registration failed. Please try again.');
    }
  };

  const DocumentUpload = ({ docType }) => {
    const isUploaded = documents[docType.key];
    
    return (
      <TouchableOpacity
        style={[styles.documentCard, isUploaded && styles.uploadedCard]}
        onPress={() => pickDocument(docType.key)}
      >
        <View style={styles.documentLeft}>
          <View style={[styles.documentIcon, isUploaded && styles.uploadedIcon]}>
            {isUploaded ? (
              <Check color="#FFFFFF" size={20} />
            ) : (
              <FileText color="#6B7280" size={20} />
            )}
          </View>
          <View>
            <Text style={styles.documentTitle}>{docType.label}</Text>
            <Text style={styles.documentStatus}>
              {isUploaded ? 'Uploaded' : 'Required'}
            </Text>
          </View>
        </View>
        <Upload color={isUploaded ? "#10B981" : "#6B7280"} size={20} />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Documents</Text>
      <Text style={styles.subtitle}>Upload your required documents</Text>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {documentTypes.map((docType) => (
          <DocumentUpload key={docType.key} docType={docType} />
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft color="#6B7280" size={20} />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
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
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
});