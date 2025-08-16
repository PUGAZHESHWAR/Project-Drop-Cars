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
import ConnectionTest from '@/components/ConnectionTest';
import { ArrowLeft } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function SignupScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showConnectionTest, setShowConnectionTest] = useState(false);
  const [formData, setFormData] = useState({
    personalDetails: {},
    documents: {},
  });
  const router = useRouter();

  const updateFormData = (step: string, data: any) => {
    setFormData(prev => ({ ...prev, [step]: data }));
  };

  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    if (showConnectionTest) {
      return <ConnectionTest />;
    }

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
          <TouchableOpacity 
            onPress={() => setShowConnectionTest(!showConnectionTest)}
            style={styles.debugButton}
          >
            <Text style={styles.debugButtonText}>
              {showConnectionTest ? 'Hide Debug' : 'Debug API'}
            </Text>
          </TouchableOpacity>
          {!showConnectionTest && (
            <View style={styles.stepIndicator}>
              <Text style={styles.stepText}>{currentStep}/2</Text>
            </View>
          )}
        </View>
      </View>

      {!showConnectionTest && (
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${(currentStep / 2) * 100}%` }]} />
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
  debugButton: {
    backgroundColor: '#F59E0B',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
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