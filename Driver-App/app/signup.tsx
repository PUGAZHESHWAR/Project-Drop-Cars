import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import PersonalDetailsStep from '@/components/signup/PersonalDetailsStep';
import DocumentsStep from '@/components/signup/DocumentsStep';
import SuccessScreen from '@/components/SuccessScreen';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';
import { loginVehicleOwner } from '@/services/auth/authService';

export default function SignupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<{
    personalDetails: {
      fullName?: string;
      primaryMobile?: string;
      secondaryMobile?: string;
      password?: string;
      address?: string;
      aadharNumber?: string;
      organizationId?: string;
      languages?: string[];
    };
    documents: any;
  }>({
    personalDetails: {},
    documents: {},
  });
  const [signupResponse, setSignupResponse] = useState<any>(null);
  const router = useRouter();

  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({ ...prev, [step]: data }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSignupSuccess = (response: any) => {
    setSignupResponse(response);
    nextStep();
  };

  const handleContinue = async () => {
    try {
      // Call login API to get the counts
      const cleanMobile = String(formData.personalDetails.primaryMobile || '').replace(/^\+91/, '');
      const loginResponse = await loginVehicleOwner(cleanMobile, formData.personalDetails.password || '');

      // Decide next step based on counts from login response
      const carCount = loginResponse.car_details_count ?? 0;
      const driverCount = loginResponse.car_driver_count ?? 0;

      let nextRoute = '/(tabs)';
      if (carCount === 0) {
        nextRoute = '/add-car';
      } else if (driverCount === 0) {
        nextRoute = '/add-driver';
      }

      // Navigate to the appropriate page
      if (nextRoute === '/add-car') {
        router.replace('/add-car');
      } else if (nextRoute === '/add-driver') {
        router.replace('/add-driver');
      } else {
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      // If login fails, still navigate to add-car as fallback
      router.replace('/add-car');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalDetailsStep
            data={formData.personalDetails}
            onUpdate={(data) => updateFormData('personalDetails', data)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <DocumentsStep
            data={formData.documents}
            onUpdate={(data) => updateFormData('documents', data)}
            onBack={previousStep}
            formData={formData}
            onSignupSuccess={handleSignupSuccess}
          />
        );
      case 3:
        return (
          <SuccessScreen
            message="Your account has been created successfully! Now let's set up your vehicle and driver details."
            onContinue={handleContinue}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#1F2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Registration</Text>
        <View style={styles.headerRight}>
          {currentStep < 3 && (
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>{currentStep}/3</Text>
            </View>
          )}
        </View>
      </View>

      {currentStep < 3 && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
        </View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {renderStep()}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  debugButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
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
  progressBar: {
    height: 4,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 20,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
});