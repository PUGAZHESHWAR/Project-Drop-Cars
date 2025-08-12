import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { User, Phone, MapPin, ArrowRight } from 'lucide-react-native';

interface PersonalDetailsStepProps {
  data: any;
  onUpdate: (data: any) => void;
  onNext: () => void;
}

const languagesList = ["Tamil", "English", "Malayalam", "Hindi", "Telugu"];

export default function PersonalDetailsStep({ data, onUpdate, onNext }: PersonalDetailsStepProps) {
  const [name, setName] = useState(data.name || '');
  const [mobile, setMobile] = useState(data.mobile || '');
  const [address, setAddress] = useState(data.address || '');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(data.languages || []);

  const toggleLanguage = (lang: string) => {
    let updated;
    if (selectedLanguages.includes(lang)) {
      updated = selectedLanguages.filter(l => l !== lang);
    } else {
      updated = [...selectedLanguages, lang];
    }
    setSelectedLanguages(updated);
  };

  const handleNext = () => {
    if (!name || !mobile || !address || selectedLanguages.length === 0) {
      Alert.alert('Error', 'Please fill all fields and select at least one language');
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    const personalData = {
      name,
      mobile,
      address,
      languages: selectedLanguages
    };

    onUpdate(personalData);
    onNext();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Personal Details</Text>
      <Text style={styles.subtitle}>Let's start with your basic information</Text>

      <View style={styles.form}>
        {/* Name */}
        <View style={styles.inputGroup}>
          <User color="#6B7280" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Mobile */}
        <View style={styles.inputGroup}>
          <Phone color="#6B7280" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Mobile Number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        {/* Address */}
        <View style={styles.inputGroup}>
          <MapPin color="#6B7280" size={20} />
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            multiline
          />
        </View>

        {/* Languages */}
        <Text style={styles.label}>Select Spoken Languages</Text>
        {languagesList.map((lang) => (
          <TouchableOpacity
            key={lang}
            style={[styles.option, selectedLanguages.includes(lang) && styles.selected]}
            onPress={() => toggleLanguage(lang)}
          >
            <Text style={styles.optionText}>
              {selectedLanguages.includes(lang) ? '✔ ' : ''}{lang}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextButtonText}>Next</Text>
          <ArrowRight color="#FFFFFF" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 24, fontFamily: 'Inter-Bold', color: '#1F2937', marginBottom: 8 },
  subtitle: { fontSize: 14, fontFamily: 'Inter-Regular', color: '#6B7280', marginBottom: 32 },
  form: { flex: 1 },
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
  input: { flex: 1, marginLeft: 12, fontSize: 16, fontFamily: 'Inter-Medium', color: '#1F2937' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 10 },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 8,
  },
  selected: { backgroundColor: '#cce5ff', borderColor: '#3399ff' },
  optionText: { fontSize: 14 },
  nextButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  nextButtonText: { color: '#FFFFFF', fontSize: 16, fontFamily: 'Inter-SemiBold', marginRight: 8 },
});
