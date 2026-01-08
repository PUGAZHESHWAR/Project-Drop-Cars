import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  MapPin, 
  X, 
  Search,
  ArrowLeft,
  Navigation
} from 'lucide-react-native';
import { googleMapsService, PlacePrediction } from '../services/googleMaps';

interface LocationPickerProps {
  visible: boolean;
  onClose: () => void;
  onLocationSelect: (location: string) => void;
  title: string;
  placeholder: string;
  initialValue?: string;
}

export default function LocationPicker({
  visible,
  onClose,
  onLocationSelect,
  title,
  placeholder,
  initialValue = ''
}: LocationPickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [predictions, setPredictions] = useState<PlacePrediction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'Chennai, Tamil Nadu, India',
  ]);

  useEffect(() => {
    if (visible) {
      // Clear search query when opening to show recent searches
      setSearchQuery('');
      setPredictions([]);
    }
  }, [visible]);

  const searchLocations = async (query: string) => {
    if (query.length < 2) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);
    try {
      const results = await googleMapsService.getPlacePredictions(query);
      setPredictions(results);
    } catch (error) {
      console.error('Error searching locations:', error);
      setPredictions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.length > 2) {
      searchLocations(text);
    } else {
      setPredictions([]);
    }
  };

  const handleLocationSelect = (location: string) => {
    onLocationSelect(location);
    onClose();
    
    // Add to recent searches
    if (!recentSearches.includes(location)) {
      setRecentSearches(prev => [location, ...prev.slice(0, 4)]);
    }
  };

  const handleRecentSelect = (location: string) => {
    onLocationSelect(location);
    onClose();
  };

  const renderLocationItem = ({ item }: { item: PlacePrediction }) => (
    <TouchableOpacity
      style={styles.locationItem}
      onPress={() => handleLocationSelect(item.description)}
    >
      <MapPin size={20} color="#1E40AF" style={styles.locationIcon} />
      <View style={styles.locationTextContainer}>
        <Text style={styles.locationMainText}>
          {item.structured_formatting?.main_text || item.description.split(',')[0]}
        </Text>
        <Text style={styles.locationSubText}>
          {item.structured_formatting?.secondary_text || item.description.split(',').slice(1).join(',').trim()}
        </Text>
      </View>
      <Navigation size={16} color="#9CA3AF" />
    </TouchableOpacity>
  );

  const renderRecentItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.recentItem}
      onPress={() => handleRecentSelect(item)}
    >
      <MapPin size={16} color="#9AA0A6" style={styles.recentIcon} />
      <Text style={styles.recentText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Header */}
        <LinearGradient
          colors={['#1E40AF', '#3B82F6']}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={onClose} style={styles.backButton}>
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#6B7280" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={placeholder}
              value={searchQuery}
              onChangeText={handleSearch}
              placeholderTextColor="#9CA3AF"
              autoFocus={true}
            />
            {isLoading && (
              <ActivityIndicator size="small" color="#1E40AF" style={styles.loadingIndicator} />
            )}
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {searchQuery.length > 0 && predictions.length > 0 ? (
            // Search Results
            <FlatList
              data={predictions}
              renderItem={renderLocationItem}
              keyExtractor={(item) => item.place_id}
              showsVerticalScrollIndicator={false}
              style={styles.list}
            />
          ) : searchQuery.length > 0 && !isLoading ? (
            // No Results
            <View style={styles.noResultsContainer}>
              <MapPin size={48} color="#9AA0A6" />
              <Text style={styles.noResultsTitle}>No locations found</Text>
              <Text style={styles.noResultsSubtitle}>
                Try searching with different keywords or check your spelling
              </Text>
            </View>
          ) : (
            // Recent Searches
            <View style={styles.recentContainer}>
              <Text style={styles.recentTitle}>Recent Searches</Text>
              <FlatList
                data={recentSearches}
                renderItem={renderRecentItem}
                keyExtractor={(item, index) => `recent_${index}`}
                showsVerticalScrollIndicator={false}
                style={styles.list}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    padding: 8,
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8EAED',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E8EAED',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#202124',
  },
  loadingIndicator: {
    marginLeft: 12,
  },
  content: {
    flex: 1,
  },
  list: {
    flex: 1,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  locationIcon: {
    marginRight: 16,
  },
  locationTextContainer: {
    flex: 1,
  },
  locationMainText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#202124',
    marginBottom: 2,
  },
  locationSubText: {
    fontSize: 14,
    color: '#5F6368',
  },
  recentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#202124',
    marginBottom: 16,
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  recentIcon: {
    marginRight: 12,
  },
  recentText: {
    fontSize: 16,
    color: '#5F6368',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: '#5F6368',
    textAlign: 'center',
    lineHeight: 20,
  },
});
