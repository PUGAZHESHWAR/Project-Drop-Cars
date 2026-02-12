import * as SecureStore from 'expo-secure-store';
import { emitSessionExpired } from './session';

export interface TokenValidationResult {
  isValid: boolean;
  token: string | null;
  error?: string;
}

/**
 * Validates if a Vehicle Owner token exists and is valid
 */
export async function validateVehicleOwnerToken(): Promise<TokenValidationResult> {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    const userData = await SecureStore.getItemAsync('userData');
    
    if (!token || !userData) {
      console.log('❌ Vehicle Owner token validation failed: Missing token or user data');
      return {
        isValid: false,
        token: null,
        error: 'No authentication token found. Please login first.'
      };
    }
    
    // Basic token format validation (JWT should have 3 parts separated by dots)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.log('❌ Vehicle Owner token validation failed: Invalid token format');
      await clearVehicleOwnerData();
      return {
        isValid: false,
        token: null,
        error: 'Invalid token format. Please login again.'
      };
    }
    
    console.log('✅ Vehicle Owner token validation passed');
    return {
      isValid: true,
      token: token
    };
  } catch (error) {
    console.error('❌ Vehicle Owner token validation error:', error);
    await clearVehicleOwnerData();
    return {
      isValid: false,
      token: null,
      error: 'Token validation failed. Please login again.'
    };
  }
}

/**
 * Validates if a Quick Driver token exists and is valid
 */
export async function validateDriverToken(): Promise<TokenValidationResult> {
  try {
    const token = await SecureStore.getItemAsync('driverAuthToken');
    const userData = await SecureStore.getItemAsync('driverAuthInfo');
    
    if (!token || !userData) {
      console.log('❌ Driver token validation failed: Missing token or user data');
      return {
        isValid: false,
        token: null,
        error: 'No driver authentication token found. Please login first.'
      };
    }
    
    // Basic token format validation (JWT should have 3 parts separated by dots)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.log('❌ Driver token validation failed: Invalid token format');
      await clearDriverData();
      return {
        isValid: false,
        token: null,
        error: 'Invalid driver token format. Please login again.'
      };
    }
    
    console.log('✅ Driver token validation passed');
    return {
      isValid: true,
      token: token
    };
  } catch (error) {
    console.error('❌ Driver token validation error:', error);
    await clearDriverData();
    return {
      isValid: false,
      token: null,
      error: 'Driver token validation failed. Please login again.'
    };
  }
}

/**
 * Clears Vehicle Owner authentication data and emits session expired
 */
export async function clearVehicleOwnerData(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('userData');
    console.log('🗑️ Cleared Vehicle Owner data');
    emitSessionExpired('Vehicle Owner session expired');
  } catch (error) {
    console.error('Error clearing Vehicle Owner data:', error);
  }
}

/**
 * Clears Quick Driver authentication data and emits session expired
 */
export async function clearDriverData(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync('driverAuthToken');
    await SecureStore.deleteItemAsync('driverAuthInfo');
    console.log('🗑️ Cleared Driver data');
    emitSessionExpired('Driver session expired');
  } catch (error) {
    console.error('Error clearing Driver data:', error);
  }
}

/**
 * Validates token before making API calls
 * Returns true if token is valid, false if invalid (and clears data)
 */
export async function validateTokenBeforeApiCall(userType: 'owner' | 'driver'): Promise<boolean> {
  if (userType === 'owner') {
    const result = await validateVehicleOwnerToken();
    if (!result.isValid) {
      console.log('❌ Vehicle Owner token invalid, preventing API call');
      return false;
    }
    return true;
  } else {
    const result = await validateDriverToken();
    if (!result.isValid) {
      console.log('❌ Driver token invalid, preventing API call');
      return false;
    }
    return true;
  }
}
