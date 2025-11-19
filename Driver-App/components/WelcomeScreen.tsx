import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
  ScrollView,
  Modal,
} from 'react-native';
import { PanGestureHandler, State } from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Car, 
  MapPin, 
  Star, 
  ArrowRight, 
  CheckCircle,
  Clock,
  TrendingUp,
  X,
  Users,
  Shield,
  Zap,
  Heart
} from 'lucide-react-native';

const { width, height } = Dimensions.get('window');


interface WelcomeScreenProps {
  onComplete: () => void;
}

export default function WelcomeScreen({ onComplete }: WelcomeScreenProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const termsAndConditions = `
Terms and Conditions – Drop Cars

Effective Date: from 2025 November

Welcome to Drop Cars. These Terms and Conditions ("Terms") govern your use of the Drop Cars mobile application and related services (collectively, the "App"). By registering or using the App, you agree to comply with and be bound by these Terms. Please read them carefully.

1. Definitions

"App" refers to the Drop Cars mobile application and related services.

"Vehicle Owner" means the registered owner of a vehicle who offers ride services using their own vehicle and driver.

"Driver" refers to the person assigned by the Vehicle Owner to operate the vehicle.

"Customer" means the individual booking rides through the App.

"We," "Us," or "Company" refers to Drop Cars and its administrators.

2. Eligibility

Vehicle Owners must:

• Own validly registered vehicles with all required permits and insurance.
• Employ or assign licensed drivers who meet legal driving requirements.
• Ensure vehicles are in safe, roadworthy condition.

3. Registration and Account

• Vehicle Owners must create an account on the App using accurate and verifiable details.
• The Company reserves the right to verify information and suspend or terminate accounts found to be fraudulent or misleading.

4. Services Provided

• Drop Cars acts as a technology platform connecting customers with vehicle owners for ride bookings.
• The Company does not own vehicles or employ drivers.
• All rides and payments are facilitated through the App, but the service agreement for transportation is between the customer and the vehicle owner.

5. Payments and Settlements

• All ride payments are processed through the App's payment gateway.
• After service completion, payment will be automatically settled to the vehicle owner's registered account, after deducting applicable service charges or commissions.
• The Company is not responsible for any disputes between vehicle owners and drivers regarding internal payments or settlements.
• Taxes, tolls, and additional charges (if applicable) must comply with government laws and policies.

6. Vehicle Owner Responsibilities

Vehicle Owners must:

• Ensure their drivers follow traffic laws and maintain courteous behavior.
• Keep the vehicle clean, insured, and regularly serviced.
• Immediately report accidents, breakdowns, or incidents involving customers.
• Not engage in unlawful or unsafe transportation activities through the App.

7. Driver Conduct

Drivers must:

• Possess a valid driving license and required documents.
• Refrain from alcohol, drugs, or any illegal activity while operating the vehicle.
• Follow all safety and traffic regulations.
• Treat passengers respectfully and maintain professionalism at all times.

8. Commission and Fees

• The Company may charge a commission or service fee on each completed ride.
• Fees may vary based on service type or promotional offers and are subject to change with prior notice.

9. Liability

• The Company is not liable for any accidents, damages, or losses arising from rides booked through the App.
• The Vehicle Owner and Driver are solely responsible for compliance with local laws and passenger safety.
• The Company provides technology support only and is not a transport service provider.

10. Data and Privacy

• User data (vehicle details, contact info, payment details) will be stored and used as per the Drop Cars Privacy Policy.
• The Company ensures reasonable security measures to protect user information.

11. Suspension or Termination

The Company reserves the right to:

• Suspend or terminate any account found violating these Terms or engaging in fraudulent activity.
• Withhold payments for review in case of reported disputes or fraudulent transactions.

12. Amendments

• Drop Cars may modify these Terms from time to time. Any updates will be notified through the App or website. Continued use after such updates constitutes acceptance of the revised Terms.

13. Governing Law

• These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in [Your City/State].

14. Contact Us

For any queries or support, contact us at:
📧 support@dropcars.com
📞 1234567890
`;
  
  // Animation values
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(50)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.8)).current;
  const welcomeSteps = [
    {
      icon: <CheckCircle size={80} color="#FFFFFF" />,
      title: `Welcome to Drop Cars, ${user?.fullName || 'Driver'}!`,
      subtitle: "Your Professional Journey Starts Here",
      description: "Drop Cars is India's premier vehicle rental platform connecting vehicle owners with customers. Start earning by providing reliable transportation services.",
      backgroundColor: '#10B981'
    },
    {
      icon: <Car size={80} color="#FFFFFF" />,
      title: "Step 1: Add Cars & Drivers",
      subtitle: "Register Your Fleet & Team",
      description: "Add your vehicles with details like model, year, and capacity. Register drivers with their licenses and contact information. Build your fleet to accept more bookings.",
      backgroundColor: '#3B82F6'
    },
    {
      icon: <MapPin size={80} color="#FFFFFF" />,
      title: "Step 2: Accept Bookings",
      subtitle: "View & Accept Available Orders",
      description: "Browse pending bookings on your dashboard. Each booking shows pickup/drop locations, customer details, and fare. Accept orders that match your schedule and route.",
      backgroundColor: '#8B5CF6'
    },
    {
      icon: <Users size={80} color="#FFFFFF" />,
      title: "Step 3: Assign Driver & Vehicle",
      subtitle: "Match Orders with Your Resources",
      description: "After accepting an order, assign one of your registered drivers and vehicles. Ensure your driver is available and vehicle is ready for the trip.",
      backgroundColor: '#F59E0B'
    },
    {
      icon: <Clock size={80} color="#FFFFFF" />,
      title: "Step 4: Track Trip Progress",
      subtitle: "Monitor Real-time Trip Status",
      description: "Your assigned driver can start/end trips with odometer readings. Track trip progress, distance covered, and fare calculation in real-time.",
      backgroundColor: '#EF4444'
    },
    {
      icon: <TrendingUp size={80} color="#FFFFFF" />,
      title: "Step 5: Earn & Grow",
      subtitle: "Maximize Your Revenue",
      description: "Earn from every completed trip. Build your reputation with quality service. Access detailed analytics and expand your fleet to increase earnings.",
      backgroundColor: '#10B981'
    },
    {
      icon: <Shield size={80} color="#FFFFFF" />,
      title: "Terms and Conditions",
      subtitle: "Drop Cars",
      description: "Please read and accept our Terms and Conditions to continue using the app.",
      backgroundColor: '#8B5CF6'
    }
  ];

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const nextStep = () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // On the last step, check if terms are accepted
      if (termsAccepted) {
        onComplete();
      } else {
        // Show alert to accept terms
        setShowTermsModal(true);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSwipeGesture = (event: any) => {
    const { translationX, state } = event.nativeEvent;
    
    if (state === State.END) {
      if (translationX > 50 && currentStep > 0) {
        // Swipe right - go to previous step
        prevStep();
      } else if (translationX < -50 && currentStep < welcomeSteps.length - 1) {
        // Swipe left - go to next step
        nextStep();
      }
    }
  };

  const currentStepData = welcomeSteps[currentStep];

  return (
    <SafeAreaView style={styles.container}>
      <PanGestureHandler onHandlerStateChange={onSwipeGesture}>
        <Animated.View style={[styles.container, { backgroundColor: currentStepData.backgroundColor }]}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            {welcomeSteps.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.progressDot, 
                  index === currentStep && styles.progressDotActive
                ]} 
              />
            ))}
          </View>
        </View>

        {/* Main Content */}
        <View style={styles.content}>
          <Animated.View 
            style={[
              styles.iconContainer,
              {
                opacity: fadeAnim,
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            {currentStepData.icon}
          </Animated.View>

          <Animated.View 
            style={[
              styles.textContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <Text style={styles.title}>{currentStepData.title}</Text>
            <Text style={styles.subtitle}>{currentStepData.subtitle}</Text>
            <Text style={styles.description}>{currentStepData.description}</Text>
          </Animated.View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          {/* Terms and Conditions Section - Only show on last step */}
          {currentStep === welcomeSteps.length - 1 && (
            <View style={styles.termsSection}>
              <TouchableOpacity 
                style={styles.termsCheckbox}
                onPress={() => setTermsAccepted(!termsAccepted)}
                activeOpacity={0.7}
              >
                <View style={[
                  styles.checkbox,
                  termsAccepted && styles.checkboxChecked
                ]}>
                  {termsAccepted && <CheckCircle size={16} color="#FFFFFF" />}
                </View>
                <Text style={styles.termsText}>
                  I have read and agree to the{' '}
                  <Text 
                    style={styles.termsLink}
                    onPress={() => setShowTermsModal(true)}
                  >
                    Terms and Conditions
                  </Text>
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.navigationButtons}>
            {currentStep > 0 && (
              <TouchableOpacity 
                style={styles.prevButton} 
                onPress={prevStep}
                activeOpacity={0.8}
              >
                <ArrowRight size={20} color="#FFFFFF" style={{ transform: [{ rotate: '180deg' }] }} />
                <Text style={styles.prevButtonText}>Previous</Text>
              </TouchableOpacity>
            )}
            
            <TouchableOpacity 
              style={[
                styles.nextButton,
                currentStep === welcomeSteps.length - 1 && !termsAccepted && styles.nextButtonDisabled
              ]} 
              onPress={nextStep}
              activeOpacity={0.8}
              disabled={currentStep === welcomeSteps.length - 1 && !termsAccepted}
            >
              <Text style={styles.nextButtonText}>
                {currentStep === welcomeSteps.length - 1 ? 'Get Started' : 'Next'}
              </Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.stepIndicator}>
            <Text style={styles.stepText}>
              {currentStep + 1} of {welcomeSteps.length}
            </Text>
            <Text style={styles.swipeHint}>
              ← Swipe left/right to navigate →
            </Text>
          </View>
        </View>
        </Animated.View>
      </PanGestureHandler>

      {/* Terms and Conditions Modal */}
      <Modal
        visible={showTermsModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTermsModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Terms and Conditions
              </Text>
              <TouchableOpacity 
                onPress={() => setShowTermsModal(false)}
                style={styles.closeButton}
              >
                <X color="#666666" size={24} />
              </TouchableOpacity>
            </View>
            
            <ScrollView 
              style={styles.modalContent}
              showsVerticalScrollIndicator={true}
            >
              <Text style={styles.termsModalText}>
                {termsAndConditions}
              </Text>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressDotActive: {
    backgroundColor: '#FFFFFF',
    width: 24,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 24,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 24,
    opacity: 0.9,
  },
  featureDescription: {
    fontSize: 18,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  prevButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    flex: 0.4,
  },
  prevButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  nextButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    flex: 0.5,
  },
  nextButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginRight: 8,
  },
  stepIndicator: {
    alignItems: 'center',
  },
  stepText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  swipeHint: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  termsSection: {
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  termsCheckbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.6)',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  termsText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    flex: 1,
    lineHeight: 20,
  },
  termsLink: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
    textDecorationLine: 'underline',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height * 0.8,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  termsModalText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 22,
  },
});
