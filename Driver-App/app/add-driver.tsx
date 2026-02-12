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
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeft, User, Save, Upload, CheckCircle, FileText, Image, Phone, Lock, MapPin, CreditCard } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { addDriverDetails, DriverDetails } from '@/services/driver/driverService';
import * as ImagePicker from 'expo-image-picker';
import axiosInstance from '@/app/api/axiosInstance';
// Local MIME type resolver to avoid extra dependency
const guessMimeTypeFromUri = (uri: string): string => {
  try {
    const lower = (uri || '').toLowerCase();
    if (lower.endsWith('.png')) return 'image/png';
    if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) return 'image/jpeg';
    if (lower.endsWith('.heic')) return 'image/heic';
    if (lower.endsWith('.webp')) return 'image/webp';
    return 'image/jpeg';
  } catch {
    return 'image/jpeg';
  }
};

export default function AddDriverScreen() {
  const [driverData, setDriverData] = useState({
    full_name: '',
    primary_number: '',
    secondary_number: '',
    password: '',
    licence_number: '',
    adress: '',
  });
  
  const [driverImages, setDriverImages] = useState({
    licence_front_img: '',
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const router = useRouter();
  const { user } = useAuth();
  const { colors } = useTheme();

  // Function to check account status and redirect accordingly
  const checkAccountStatusAndRedirect = async () => {
    try {
      // Get current user data to check account status
      const response = await axiosInstance.post('/api/users/vehicleowner/login', {
        mobile_number: user?.primaryMobile || '',
        password: user?.password || ''
      });

      const accountStatus = response.data.account_status;
      const carCount = response.data.car_details_count ?? 0;
      const driverCount = response.data.car_driver_count ?? 0;

      console.log('🔍 After driver addition - Account status:', accountStatus);
      console.log('🔍 After driver addition - Car count:', carCount);
      console.log('🔍 After driver addition - Driver count:', driverCount);

      // Check if user needs to add more documents
      if (carCount === 0) {
        // No cars - redirect to add car
        console.log('🚗 No cars, redirecting to add car page');
        router.replace('/add-car');
        return;
      }

      if (driverCount === 0) {
        // Still no drivers (shouldn't happen, but just in case)
        console.log('👤 Still no drivers, staying on add driver page');
        return;
      }

      // Both cars and drivers are added, check account status
      if (accountStatus?.toLowerCase() !== 'active') {
        // Documents uploaded but account is not active - show verification page
        console.log('⏳ Documents uploaded but account not active, redirecting to verification');
        router.replace('/login');
        return;
      }

      // Everything is ready - go to dashboard
      console.log('✅ Everything ready, proceeding to dashboard');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('❌ Error checking account status:', error);
      // Fallback to dashboard if check fails
      router.replace('/(tabs)');
    }
  };

  // Simple input handlers
  const handleInputChange = (field: string, value: string) => {
    // Clear error if exists
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    setDriverData(prev => ({ ...prev, [field]: value }));
  };

  // Simple validation - just check if fields are not empty
  const validateAllFields = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!driverData.full_name.trim()) newErrors.full_name = 'Full name is required';
    if (!driverData.primary_number.trim()) newErrors.primary_number = 'Primary phone number is required';
    if (!driverData.password.trim()) newErrors.password = 'Password is required';
    if (!driverData.licence_number.trim()) newErrors.licence_number = 'Driving licence number is required';
    if (!driverData.adress.trim()) newErrors.adress = 'Address is required';
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };

  const pickImage = async (imageKey: string) => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setDriverImages(prev => ({
          ...prev,
          [imageKey]: result.assets[0].uri
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const ImageUploadField = ({ 
    title, 
    description, 
    imageKey, 
    isRequired = true 
  }: { 
    title: string; 
    description: string; 
    imageKey: string; 
    isRequired?: boolean;
  }) => {
    const imageUri = driverImages[imageKey as keyof typeof driverImages];
    const isUploaded = !!imageUri;
    
    return (
      <TouchableOpacity
        style={[styles.imageUploadField, isUploaded && styles.uploadedField]}
        onPress={() => pickImage(imageKey)}
      >
        <View style={styles.imageUploadLeft}>
          <View style={[styles.imageUploadIcon, isUploaded && styles.uploadedIcon]}>
            {isUploaded ? (
              <CheckCircle color="#FFFFFF" size={20} />
            ) : (
              <Image color="#6B7280" size={20} />
            )}
          </View>
          <View style={styles.imageUploadText}>
            <Text style={styles.imageUploadTitle}>
              {title} {isRequired && <Text style={styles.required}>*</Text>}
            </Text>
            <Text style={styles.imageUploadDescription}>{description}</Text>
          </View>
        </View>
        <Upload color={isUploaded ? "#10B981" : "#6B7280"} size={20} />
      </TouchableOpacity>
    );
  };

  const handleSave = async () => {
    // Clear previous errors
    setErrors({});

    // Simple validation - just check if fields are not empty
    if (!validateAllFields()) {
      Alert.alert('Validation Error', 'Please fill all required fields');
      return;
    }

    // Only licence_front_img is required by backend for this endpoint
    if (!driverImages.licence_front_img) {
      Alert.alert('Error', 'Please upload Licence Front image');
      return;
    }

    try {
      setIsLoading(true);
      console.log('👤 Starting driver registration process...');
      // Verify auth before submitting (VO-protected endpoint)
      try {
        const authCheck = await axiosInstance.get('/api/users/vehicle-owner/me');
        if (!authCheck || authCheck.status !== 200) {
          Alert.alert('Authentication Required', 'Please log in again to continue.');
          return;
        }
      } catch (authErr: any) {
        console.error('🔒 Auth preflight failed:', authErr?.response?.status, authErr?.response?.data);
        Alert.alert('Authentication Required', 'Session expired or invalid. Please log in again.');
        return;
      }
      // Helpers
      const toTenDigit = (phone: string) => {
        const digits = (phone || '').replace(/\D/g, '');
        if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
        return digits.slice(-10);
      };

      // Normalize
      const primary = toTenDigit(driverData.primary_number.trim());
      const secondary = driverData.secondary_number ? toTenDigit(driverData.secondary_number.trim()) : '';

      // Validations
      if (!/^[6-9]\d{9}$/.test(primary)) {
        setErrors(prev => ({ ...prev, primary_number: 'Enter valid 10-digit Indian mobile number' }));
        Alert.alert('Validation Error', 'Enter valid 10-digit Indian mobile number');
        return;
      }
      if (secondary && !/^[6-9]\d{9}$/.test(secondary)) {
        setErrors(prev => ({ ...prev, secondary_number: 'Enter valid 10-digit Indian mobile number' }));
        Alert.alert('Validation Error', 'Secondary number invalid');
        return;
      }
      if (driverData.adress.trim().length < 10) {
        setErrors(prev => ({ ...prev, adress: 'Address must be at least 10 characters' }));
        Alert.alert('Validation Error', 'Address must be at least 10 characters');
        return;
      }
      if (driverData.password.trim().length < 6) {
        setErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
        Alert.alert('Validation Error', 'Password must be at least 6 characters');
        return;
      }
      if (!driverImages.licence_front_img) {
        Alert.alert('Error', 'Please upload Licence Front image');
        return;
      }

      // Build multipart form
      const uri = driverImages.licence_front_img;
      const name = uri.split('/').pop() || 'license.jpg';
      const type = guessMimeTypeFromUri(uri) || 'image/jpeg';

      const form = new FormData();
      form.append('full_name', driverData.full_name.trim());
      form.append('primary_number', primary);
      if (secondary) form.append('secondary_number', secondary);
      form.append('password', driverData.password.trim());
      form.append('licence_number', driverData.licence_number.trim().toUpperCase());
      form.append('adress', driverData.adress.trim());
      if (user?.organizationId) form.append('organization_id', user.organizationId);
      if (user?.id) form.append('vehicle_owner_id', user.id);
      form.append('licence_front_img', { uri, name, type } as any);

      console.log('🚀 Submitting driver signup (multipart)...');
      const res = await axiosInstance.post('/api/users/cardriver/signup', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });
      console.log('✅ Driver registration completed successfully!', res.data);

      Alert.alert('Success', 'Driver details added successfully!', [
        { 
          text: 'OK', 
          onPress: () => {
            setIsLoading(false);
            checkAccountStatusAndRedirect();
          }
        },
      ]);
    } catch (err: any) {
      console.error('❌ Error during driver registration:', err);
      setIsLoading(false);
      const detail = err?.response?.data?.detail;
      if (Array.isArray(detail)) {
        console.error('🔍 Backend validation error:', JSON.stringify(detail));
        Alert.alert('Validation Failed', detail.map((d: any) => d?.msg || JSON.stringify(d)).join('\n'));
      } else {
        console.error('❌ API Error:', JSON.stringify({
          status: err?.response?.status,
          data: err?.response?.data || err?.message,
        }));
        Alert.alert('Error', err?.response?.data?.detail || 'Failed to add driver details');
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={[styles.backButton, isLoading && styles.backButtonDisabled]}
          disabled={isLoading}
        >
          <ArrowLeft color={isLoading ? colors.textSecondary : colors.text} size={24} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Add Your First Driver</Text>
        <View style={styles.stepIndicator}>
          <Text style={styles.stepText}>Step 2/3</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeSection}>
          <Text style={[styles.welcomeTitle, { color: colors.text }]}>Driver Registration</Text>
          <Text style={styles.welcomeSubtitle}>
            Hi {user?.fullName}, let's add your first driver to complete the setup.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Driver Details</Text>
          
          <View style={[styles.inputGroup, { backgroundColor: colors.surface, borderColor: colors.border }] }>
            <User color="#6B7280" size={20} />
            <TextInput
              style={[styles.input, { color: colors.text }, errors.full_name && styles.inputError]}
              placeholder="Full Name (e.g., John Doe)"
              value={driverData.full_name}
              onChangeText={(text) => handleInputChange('full_name', text)}
            />
          </View>
          {errors.full_name && <Text style={styles.errorText}>{errors.full_name}</Text>}

          <View style={[styles.inputGroup, { backgroundColor: colors.surface, borderColor: colors.border }] }>
            <Phone color="#6B7280" size={20} />
            <TextInput
              style={[styles.input, { color: colors.text }, errors.primary_number && styles.inputError]}
              placeholder="Primary Mobile Number (+91XXXXXXXXXX)"
              value={driverData.primary_number}
              onChangeText={(text) => handleInputChange('primary_number', text)}
              keyboardType="phone-pad"
            />
          </View>
          {errors.primary_number && <Text style={styles.errorText}>{errors.primary_number}</Text>}
          <Text style={styles.helpText}>
            Enter your mobile number exactly as you want it stored
          </Text>

          <View style={[styles.inputGroup, { backgroundColor: colors.surface, borderColor: colors.border }] }>
            <Phone color="#6B7280" size={20} />
            <TextInput
              style={[styles.input, { color: colors.text }, errors.secondary_number && styles.inputError]}
              placeholder="Secondary Mobile Number (Optional)"
              value={driverData.secondary_number}
              onChangeText={(text) => handleInputChange('secondary_number', text)}
              keyboardType="phone-pad"
            />
          </View>

          <View style={[styles.inputGroup, { backgroundColor: colors.surface, borderColor: colors.border }] }>
            <Lock color="#6B7280" size={20} />
            <TextInput
              style={[styles.input, { color: colors.text }, errors.password && styles.inputError]}
              placeholder="Password"
              value={driverData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              secureTextEntry
            />
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <View style={[styles.inputGroup, { backgroundColor: colors.surface, borderColor: colors.border }] }>
            <CreditCard color="#6B7280" size={20} />
            <TextInput
              style={[styles.input, { color: colors.text }, errors.licence_number && styles.inputError]}
              placeholder="Driving Licence Number (e.g., MH-12-1990-1234567)"
              value={driverData.licence_number}
              onChangeText={(text) => handleInputChange('licence_number', text)}
              autoCapitalize="characters"
            />
          </View>
          {errors.licence_number && <Text style={styles.errorText}>{errors.licence_number}</Text>}
          <Text style={styles.helpText}>
            Enter your driving licence number exactly as it appears on your licence
          </Text>

          <View style={[styles.inputGroup, { backgroundColor: colors.surface, borderColor: colors.border }] }>
            <MapPin color="#6B7280" size={20} />
            <TextInput
              style={[styles.input, { color: colors.text }, errors.adress && styles.inputError]}
              placeholder="Address (e.g., 123 Main Street, Mumbai, Maharashtra)"
              value={driverData.adress}
              onChangeText={(text) => handleInputChange('adress', text)}
              multiline
              numberOfLines={3}
            />
          </View>
          {errors.adress && <Text style={styles.errorText}>{errors.adress}</Text>}

          <Text style={styles.sectionTitle}>Required Document</Text>
          <Text style={styles.sectionSubtitle}>
            Please upload a clear image of your driving license
          </Text>

          <ImageUploadField
            title="Driving Licence Front Image"
            description="Front side of driving licence"
            imageKey="licence_front_img"
            isRequired={true}
          />

          <TouchableOpacity 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <ActivityIndicator color="#FFFFFF" size="small" />
                <Text style={styles.saveButtonText}>Saving Driver...</Text>
              </>
            ) : (
              <>
                <Save color="#FFFFFF" size={20} />
                <Text style={styles.saveButtonText}>Save Driver & Continue</Text>
              </>
            )}
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
  backButtonDisabled: {
    opacity: 0.5,
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
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 16,
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
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  helpText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Inter-Regular',
  },
  imageUploadField: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  uploadedField: {
    borderColor: '#10B981',
    borderWidth: 2,
  },
  imageUploadLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageUploadIcon: {
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    padding: 8,
  },
  uploadedIcon: {
    backgroundColor: '#10B981',
  },
  imageUploadText: {
    marginLeft: 12,
  },
  imageUploadTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#1F2937',
  },
  required: {
    color: '#EF4444',
  },
  imageUploadDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 4,
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
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
});

