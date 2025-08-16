import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CheckCircle, Clock, FileText, Car, User, Home } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function DocumentsReviewScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const handleGoToDashboard = () => {
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.iconContainer}>
            <CheckCircle color="#10B981" size={48} />
          </View>
          <Text style={styles.title}>Setup Complete!</Text>
          <Text style={styles.subtitle}>
            Great job, {user?.fullName}! You've successfully completed your initial setup.
          </Text>
        </View>

        {/* Progress Summary */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>What We've Completed</Text>
          
          <View style={styles.progressItem}>
            <View style={styles.progressIcon}>
              <CheckCircle color="#10B981" size={24} />
            </View>
            <View style={styles.progressContent}>
              <Text style={styles.progressTitle}>Account Created</Text>
              <Text style={styles.progressDescription}>
                Your account owner profile has been successfully created
              </Text>
            </View>
          </View>

          <View style={styles.progressItem}>
            <View style={styles.progressIcon}>
              <CheckCircle color="#10B981" size={24} />
            </View>
            <View style={styles.progressContent}>
              <Text style={styles.progressTitle}>Car Added</Text>
              <Text style={styles.progressDescription}>
                Your first car has been registered in the system
              </Text>
            </View>
          </View>

          <View style={styles.progressItem}>
            <View style={styles.progressIcon}>
              <CheckCircle color="#10B981" size={24} />
            </View>
            <View style={styles.progressContent}>
              <Text style={styles.progressTitle}>Driver Profile Created</Text>
              <Text style={styles.progressDescription}>
                Driver profile and documents have been submitted
              </Text>
            </View>
          </View>
        </View>

        {/* Documents Review Status */}
        <View style={styles.reviewSection}>
          <Text style={styles.sectionTitle}>Documents Under Review</Text>
          
          <View style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <Clock color="#F59E0B" size={24} />
              <Text style={styles.reviewTitle}>Review in Progress</Text>
            </View>
            <Text style={styles.reviewDescription}>
              Our verification team is currently reviewing your submitted documents. 
              This process typically takes 24-48 hours.
            </Text>
            
            <View style={styles.documentList}>
              <View style={styles.documentItem}>
                <FileText color="#6B7280" size={16} />
                <Text style={styles.documentText}>Account Owner Documents</Text>
                <Text style={styles.documentStatus}>Under Review</Text>
              </View>
              
              <View style={styles.documentItem}>
                <FileText color="#6B7280" size={16} />
                <Text style={styles.documentText}>Driver Documents</Text>
                <Text style={styles.documentStatus}>Under Review</Text>
              </View>
              
              <View style={styles.documentItem}>
                <FileText color="#6B7280" size={16} />
                <Text style={styles.documentText}>Car Registration</Text>
                <Text style={styles.documentStatus}>Under Review</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Next Steps */}
        <View style={styles.nextStepsSection}>
          <Text style={styles.sectionTitle}>What Happens Next?</Text>
          
          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>1</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Document Verification</Text>
              <Text style={styles.stepDescription}>
                Our team will verify all submitted documents and information
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>2</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Account Activation</Text>
              <Text style={styles.stepDescription}>
                Once verified, your account will be activated for full access
              </Text>
            </View>
          </View>

          <View style={styles.stepItem}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>3</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>Start Your Journey</Text>
              <Text style={styles.stepDescription}>
                You'll receive a notification when you can start using Drop Cars
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleGoToDashboard}>
            <Home color="#FFFFFF" size={20} />
            <Text style={styles.primaryButtonText}>Go to Dashboard</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryButton}>
            <Text style={styles.secondaryButtonText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        {/* Footer Note */}
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            You'll receive email and SMS notifications about your verification status. 
            Please check your email regularly.
          </Text>
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
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0FDF4',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  progressSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 20,
  },
  progressItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  progressIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  progressContent: {
    flex: 1,
  },
  progressTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  progressDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  reviewSection: {
    marginBottom: 32,
  },
  reviewCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#92400E',
    marginLeft: 12,
  },
  reviewDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    lineHeight: 20,
    marginBottom: 20,
  },
  documentList: {
    gap: 12,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    borderRadius: 8,
    padding: 12,
  },
  documentText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#92400E',
    marginLeft: 8,
  },
  documentStatus: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#F59E0B',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  nextStepsSection: {
    marginBottom: 32,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  actionSection: {
    marginBottom: 32,
    gap: 16,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  footerNote: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});


