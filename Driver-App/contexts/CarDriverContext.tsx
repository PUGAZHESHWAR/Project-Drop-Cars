import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  CarDriverResponse,
  CarDriverSignupRequest,
  CarDriverSigninRequest,
  CarDriverAuthResponse,
  CarDriverStatusResponse,
  signupCarDriver,
  signinCarDriver,
  setDriverOnline,
  setDriverOffline,
  getCarDriver,
  // getDriversByOrganization, // removed: organization APIs not supported
  getCarDriverByMobile,
  updateCarDriverProfile,
  deleteCarDriver,
  searchDrivers
} from '@/services/driver/carDriverService';

interface CarDriverContextType {
  // Driver state
  driver: CarDriverResponse | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Authentication methods
  signup: (request: CarDriverSignupRequest) => Promise<void>;
  signin: (request: CarDriverSigninRequest) => Promise<void>;
  signout: () => Promise<void>;
  
  // Status management
  goOnline: () => Promise<void>;
  goOffline: () => Promise<void>;
  
  // Profile management
  updateProfile: (updates: Partial<CarDriverResponse>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  
  // Data fetching
  refreshDriverData: () => Promise<void>;
  getDriversForOrganization: (organizationId: string) => Promise<CarDriverResponse[]>; // deprecated
  searchDriversByFilters: (filters: any) => Promise<CarDriverResponse[]>;
  
  // Utility methods
  clearError: () => void;
  clearAllData: () => void;
}

const CarDriverContext = createContext<CarDriverContextType | undefined>(undefined);

interface CarDriverProviderProps {
  children: ReactNode;
}

export const CarDriverProvider: React.FC<CarDriverProviderProps> = ({ children }) => {
  const [driver, setDriver] = useState<CarDriverResponse | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load stored driver data on app start
  useEffect(() => {
    loadStoredDriverData();
  }, []);

  const loadStoredDriverData = async () => {
    try {
      setIsLoading(true);
      
      // Fast local storage check only - no API calls on startup
      const storedDriver = await AsyncStorage.getItem('carDriver');
      const storedToken = await AsyncStorage.getItem('carDriverToken');
      
      if (storedDriver && storedToken) {
        const driverData = JSON.parse(storedDriver);
        setDriver(driverData);
        setIsAuthenticated(true);
        console.log('✅ Stored driver data loaded (fast startup):', driverData.full_name);
      } else {
        console.log('ℹ️ No stored driver data found, driver needs to login');
      }
    } catch (error) {
      console.error('❌ Failed to load stored driver data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const storeDriverData = async (driverData: CarDriverResponse, token: string) => {
    try {
      await AsyncStorage.setItem('carDriver', JSON.stringify(driverData));
      await AsyncStorage.setItem('carDriverToken', token);
      console.log('✅ Driver data stored successfully');
    } catch (error) {
      console.error('❌ Failed to store driver data:', error);
    }
  };

  const clearStoredData = async () => {
    try {
      await AsyncStorage.removeItem('carDriver');
      await AsyncStorage.removeItem('carDriverToken');
      console.log('✅ Stored driver data cleared');
    } catch (error) {
      console.error('❌ Failed to clear stored driver data:', error);
    }
  };

  const signup = async (request: CarDriverSignupRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('👤 Starting car driver signup...');
      const response: CarDriverAuthResponse = await signupCarDriver(request);
      
      if (response.success && response.driver && response.token) {
        setDriver(response.driver);
        setIsAuthenticated(true);
        await storeDriverData(response.driver, response.token);
        console.log('✅ Car driver signup successful');
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error: any) {
      console.error('❌ Car driver signup failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signin = async (request: CarDriverSigninRequest): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔐 Starting car driver signin...');
      const response: CarDriverAuthResponse = await signinCarDriver(request);
      
      if (response.success && response.driver && response.token) {
        setDriver(response.driver);
        setIsAuthenticated(true);
        await storeDriverData(response.driver, response.token);
        console.log('✅ Car driver signin successful');
      } else {
        throw new Error(response.message || 'Signin failed');
      }
    } catch (error: any) {
      console.error('❌ Car driver signin failed:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signout = async (): Promise<void> => {
    try {
      setIsLoading(true);
      
      // Set driver offline before signing out
      if (driver) {
        try {
          await setDriverOffline(driver.id);
          console.log('✅ Driver set offline before signout');
        } catch (error) {
          console.warn('⚠️ Failed to set driver offline:', error);
        }
      }
      
      setDriver(null);
      setIsAuthenticated(false);
      await clearStoredData();
      console.log('✅ Car driver signout successful');
    } catch (error) {
      console.error('❌ Car driver signout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const goOnline = async (): Promise<void> => {
    if (!driver) {
      throw new Error('No driver logged in');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🟢 Setting driver online...');
      const response: CarDriverStatusResponse = await setDriverOnline(driver.id);
      
      if (response.success) {
        // Update local driver status
        setDriver(prev => prev ? { ...prev, status: 'online' } : null);
        console.log('✅ Driver set online successfully');
      } else {
        throw new Error(response.message || 'Failed to set driver online');
      }
    } catch (error: any) {
      console.error('❌ Failed to set driver online:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const goOffline = async (): Promise<void> => {
    if (!driver) {
      throw new Error('No driver logged in');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔴 Setting driver offline...');
      const response: CarDriverStatusResponse = await setDriverOffline(driver.id);
      
      if (response.success) {
        // Update local driver status
        setDriver(prev => prev ? { ...prev, status: 'offline' } : null);
        console.log('✅ Driver set offline successfully');
      } else {
        throw new Error(response.message || 'Failed to set driver offline');
      }
    } catch (error: any) {
      console.error('❌ Failed to set driver offline:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<CarDriverResponse>): Promise<void> => {
    if (!driver) {
      throw new Error('No driver logged in');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('✏️ Updating driver profile...');
      const updatedDriver = await updateCarDriverProfile(driver.id, updates);
      
      setDriver(updatedDriver);
      await storeDriverData(updatedDriver, await AsyncStorage.getItem('carDriverToken') || '');
      console.log('✅ Driver profile updated successfully');
    } catch (error: any) {
      console.error('❌ Failed to update driver profile:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAccount = async (): Promise<void> => {
    if (!driver) {
      throw new Error('No driver logged in');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🗑️ Deleting driver account...');
      await deleteCarDriver(driver.id);
      
      setDriver(null);
      setIsAuthenticated(false);
      await clearStoredData();
      console.log('✅ Driver account deleted successfully');
    } catch (error: any) {
      console.error('❌ Failed to delete driver account:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const refreshDriverData = async (): Promise<void> => {
    if (!driver) {
      throw new Error('No driver logged in');
    }

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🔄 Refreshing driver data...');
      const freshDriver = await getCarDriver(driver.id);
      
      setDriver(freshDriver);
      await storeDriverData(freshDriver, await AsyncStorage.getItem('carDriverToken') || '');
      console.log('✅ Driver data refreshed successfully');
    } catch (error: any) {
      console.error('❌ Failed to refresh driver data:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getDriversForOrganization = async (_organizationId: string): Promise<CarDriverResponse[]> => {
    console.warn('getDriversForOrganization is deprecated: organization APIs are not available');
    return [];
  };

  const searchDriversByFilters = async (filters: any): Promise<CarDriverResponse[]> => {
    try {
      console.log('🔍 Searching drivers with filters:', filters);
      const drivers = await searchDrivers(filters);
      console.log('✅ Drivers search successful:', drivers.length);
      return drivers;
    } catch (error: any) {
      console.error('❌ Failed to search drivers:', error);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const clearAllData = () => {
    console.log('🧹 Clearing all car driver data...');
    setDriver(null);
    setIsAuthenticated(false);
    setError(null);
    console.log('✅ All car driver data cleared');
  };

  const value: CarDriverContextType = {
    driver,
    isAuthenticated,
    isLoading,
    error,
    signup,
    signin,
    signout,
    goOnline,
    goOffline,
    updateProfile,
    deleteAccount,
    refreshDriverData,
    getDriversForOrganization,
    searchDriversByFilters,
    clearError,
    clearAllData
  };

  return (
    <CarDriverContext.Provider value={value}>
      {children}
    </CarDriverContext.Provider>
  );
};

export const useCarDriver = (): CarDriverContextType => {
  const context = useContext(CarDriverContext);
  if (context === undefined) {
    throw new Error('useCarDriver must be used within a CarDriverProvider');
  }
  return context;
};
