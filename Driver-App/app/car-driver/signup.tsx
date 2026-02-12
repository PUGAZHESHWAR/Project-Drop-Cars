import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useCarDriver } from '@/contexts/CarDriverContext';
import { CarDriverSignupRequest } from '@/services/driver/carDriverService';
import { ArrowLeft, User, Phone, MapPin, CreditCard, Car, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';

export default function CarDriverSignupScreen() {
  const { colors } = useTheme();
  const { signup, isLoading, error, clearError } = useCarDriver();
  const router = useRouter();

  // Form state
  const [formData, setFormData] = useState<CarDriverSignupRequest>({
    full_name: '',
    primary_number: '',
    secondary_number: '',
    address: '',
    aadhar_number: '',
    organization_id: '',
    password: '',
    email: '',
    license_number: '',
    experience_years: 0,
    vehicle_preferences: []
  });

  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field: keyof CarDriverSignupRequest, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    if (!formData.full_name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }

    if (!formData.primary_number.trim()) {
      Alert.alert('Error', 'Please enter your primary mobile number');
      return false;
    }

    if (formData.primary_number.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return false;
    }

    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter your address');
      return false;
    }

    if (!formData.aadhar_number.trim()) {
      Alert.alert('Error', 'Please enter your Aadhar number');
      return false;
    }

    if (formData.aadhar_number.length !== 12) {
      Alert.alert('Error', 'Please enter a valid 12-digit Aadhar number');
      return false;
    }

    if (!formData.organization_id.trim()) {
      Alert.alert('Error', 'Please enter your organization ID');
      return false;
    }

    if (!formData.password.trim()) {
      Alert.alert('Error', 'Please enter a password');
      return false;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return false;
    }

    if (formData.password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      clearError();
      await signup(formData);
      
      Alert.alert(
        'Success! 🎉',
        'Your account has been created successfully. You can now sign in.',
        [
          {
            text: 'OK',
            onPress: () => router.push('/car-driver/signin')
          }
        ]
      );
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Something went wrong. Please try again.');
    }
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    backButton: {
      padding: 8,
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontFamily: 'Inter-Bold',
      color: colors.text,
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    title: {
      fontSize: 28,
      fontFamily: 'Inter-Bold',
      color: colors.text,
      marginBottom: 8,
    },
    subtitle: {
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
      marginBottom: 32,
    },
    formSection: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: colors.text,
      marginBottom: 16,
    },
    inputContainer: {
      marginBottom: 16,
    },
    inputLabel: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.text,
      marginBottom: 8,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      fontFamily: 'Inter-Regular',
      color: colors.text,
    },
    passwordToggle: {
      padding: 4,
    },
    signupButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
      marginTop: 24,
      marginBottom: 16,
    },
    signupButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontFamily: 'Inter-SemiBold',
    },
    loadingButton: {
      opacity: 0.7,
    },
    signinLink: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 16,
    },
    signinText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: colors.textSecondary,
    },
    signinButton: {
      marginLeft: 4,
    },
    signinButtonText: {
      fontSize: 14,
      fontFamily: 'Inter-SemiBold',
      color: colors.primary,
    },
    errorText: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: colors.error,
      textAlign: 'center',
      marginTop: 16,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <View style={dynamicStyles.header}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={dynamicStyles.backButton}
        >
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text style={dynamicStyles.headerTitle}>Driver Signup</Text>
      </View>

      <ScrollView 
        style={dynamicStyles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={dynamicStyles.title}>Join as a Driver</Text>
        <Text style={dynamicStyles.subtitle}>
          Create your account to start driving with DropCars
        </Text>

        {/* Personal Information */}
        <View style={dynamicStyles.formSection}>
          <Text style={dynamicStyles.sectionTitle}>Personal Information</Text>
          
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>Full Name *</Text>
            <View style={dynamicStyles.inputWrapper}>
              <User color={colors.textSecondary} size={20} style={dynamicStyles.inputIcon} />
              <TextInput
                style={dynamicStyles.input}
                placeholder="Enter your full name"
                value={formData.full_name}
                onChangeText={(value) => handleInputChange('full_name', value)}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>Primary Mobile Number *</Text>
            <View style={dynamicStyles.inputWrapper}>
              <Phone color={colors.textSecondary} size={20} style={dynamicStyles.inputIcon} />
              <TextInput
                style={dynamicStyles.input}
                placeholder="Enter 10-digit mobile number"
                value={formData.primary_number}
                onChangeText={(value) => handleInputChange('primary_number', value)}
                keyboardType="phone-pad"
                maxLength={10}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>Secondary Mobile Number (Optional)</Text>
            <View style={dynamicStyles.inputWrapper}>
              <Phone color={colors.textSecondary} size={20} style={dynamicStyles.inputIcon} />
              <TextInput
                style={dynamicStyles.input}
                placeholder="Enter secondary mobile number"
                value={formData.secondary_number}
                onChangeText={(value) => handleInputChange('secondary_number', value)}
                keyboardType="phone-pad"
                maxLength={10}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>Email (Optional)</Text>
            <View style={dynamicStyles.inputWrapper}>
              <Mail color={colors.textSecondary} size={20} style={dynamicStyles.inputIcon} />
              <TextInput
                style={dynamicStyles.input}
                placeholder="Enter your email address"
                value={formData.email}
                onChangeText={(value) => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>Address *</Text>
            <View style={dynamicStyles.inputWrapper}>
              <MapPin color={colors.textSecondary} size={20} style={dynamicStyles.inputIcon} />
              <TextInput
                style={dynamicStyles.input}
                placeholder="Enter your complete address"
                value={formData.address}
                onChangeText={(value) => handleInputChange('address', value)}
                multiline
                numberOfLines={3}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* Identity Information */}
        <View style={dynamicStyles.formSection}>
          <Text style={dynamicStyles.sectionTitle}>Identity Information</Text>
          
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>Aadhar Number *</Text>
            <View style={dynamicStyles.inputWrapper}>
              <CreditCard color={colors.textSecondary} size={20} style={dynamicStyles.inputIcon} />
              <TextInput
                style={dynamicStyles.input}
                placeholder="Enter 12-digit Aadhar number"
                value={formData.aadhar_number}
                onChangeText={(value) => handleInputChange('aadhar_number', value)}
                keyboardType="numeric"
                maxLength={12}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>License Number (Optional)</Text>
            <View style={dynamicStyles.inputWrapper}>
              <Car color={colors.textSecondary} size={20} style={dynamicStyles.inputIcon} />
              <TextInput
                style={dynamicStyles.input}
                placeholder="Enter your driving license number"
                value={formData.license_number}
                onChangeText={(value) => handleInputChange('license_number', value)}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>Years of Experience (Optional)</Text>
            <View style={dynamicStyles.inputWrapper}>
              <Car color={colors.textSecondary} size={20} style={dynamicStyles.inputIcon} />
              <TextInput
                style={dynamicStyles.input}
                placeholder="Enter years of driving experience"
                value={formData.experience_years?.toString() || ''}
                onChangeText={(value) => handleInputChange('experience_years', parseInt(value) || 0)}
                keyboardType="numeric"
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>
        </View>

        {/* Account Information */}
        <View style={dynamicStyles.formSection}>
          <Text style={dynamicStyles.sectionTitle}>Account Information</Text>
          
          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>Organization ID *</Text>
            <View style={dynamicStyles.inputWrapper}>
              <User color={colors.textSecondary} size={20} style={dynamicStyles.inputIcon} />
              <TextInput
                style={dynamicStyles.input}
                placeholder="Enter your organization ID"
                value={formData.organization_id}
                onChangeText={(value) => handleInputChange('organization_id', value)}
                placeholderTextColor={colors.textSecondary}
              />
            </View>
          </View>

          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>Password *</Text>
            <View style={dynamicStyles.inputWrapper}>
              <Lock color={colors.textSecondary} size={20} style={dynamicStyles.inputIcon} />
              <TextInput
                style={dynamicStyles.input}
                placeholder="Enter password (min 6 characters)"
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                secureTextEntry={!showPassword}
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={dynamicStyles.passwordToggle}
              >
                {showPassword ? (
                  <EyeOff color={colors.textSecondary} size={20} />
                ) : (
                  <Eye color={colors.textSecondary} size={20} />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={dynamicStyles.inputContainer}>
            <Text style={dynamicStyles.inputLabel}>Confirm Password *</Text>
            <View style={dynamicStyles.inputWrapper}>
              <Lock color={colors.textSecondary} size={20} style={dynamicStyles.inputIcon} />
              <TextInput
                style={dynamicStyles.input}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor={colors.textSecondary}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={dynamicStyles.passwordToggle}
              >
                {showConfirmPassword ? (
                  <EyeOff color={colors.textSecondary} size={20} />
                ) : (
                  <Eye color={colors.textSecondary} size={20} />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {error && <Text style={dynamicStyles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[
            dynamicStyles.signupButton,
            isLoading && dynamicStyles.loadingButton
          ]}
          onPress={handleSignup}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={dynamicStyles.signupButtonText}>Create Account</Text>
          )}
        </TouchableOpacity>

        <View style={dynamicStyles.signinLink}>
          <Text style={dynamicStyles.signinText}>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => router.push('/car-driver/signin')}
            style={dynamicStyles.signinButton}
          >
            <Text style={dynamicStyles.signinButtonText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
