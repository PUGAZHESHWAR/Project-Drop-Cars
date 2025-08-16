import axiosInstance from '@/app/api/axiosInstance';
import * as SecureStore from 'expo-secure-store';

// Authentication interfaces matching your backend
export interface LoginRequest {
  mobile_number: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  account_status: string;
  car_driver_count: number;
  car_details_count: number;
  user_data?: {
    id: string;
    full_name: string;
    primary_number: string;
    secondary_number?: string;
    address: string;
    aadhar_number: string;
    organization_id: string;
    languages: string[];
  };
}

export interface JWTVerificationResponse {
  verified: boolean;
  user_id: string;
  organization_id: string;
  token: string;
  message: string;
}

// User data interface
export interface UserData {
  id: string;
  fullName: string;
  primaryMobile: string;
  secondaryMobile?: string;
  address: string;
  aadharNumber: string;
  organizationId: string;
  languages: string[];
}

// Authentication service class
class AuthService {
  private static instance: AuthService;
  private token: string | null = null;
  private userData: UserData | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  // Login vehicle owner and get JWT token
  async loginVehicleOwner(mobileNumber: string, password: string): Promise<LoginResponse> {
    try {
      console.log('🔐 Starting vehicle owner login...');
      
      const response = await axiosInstance.post('/api/users/vehicleowner/login', {
        mobile_number: mobileNumber,
        password: password
      });
      
      console.log('✅ Login successful:', response.data);
      
      // Store the access token securely
      if (response.data.access_token) {
        await this.setToken(response.data.access_token);
        console.log('🔒 Access token stored securely');
        
        // Extract basic user data from token
        const basicUserInfo = await this.extractUserDataFromToken(response.data.access_token);
        
        // Fetch complete user profile from backend
        try {
          const completeUserProfile = await this.fetchUserProfileFromBackend(response.data.access_token);
          const userInfo = { ...basicUserInfo, ...completeUserProfile };
          await this.setUserData(userInfo);
          console.log('👤 Complete user data fetched and stored:', userInfo);
        } catch (profileError) {
          console.warn('⚠️ Could not fetch complete profile, using basic token data:', profileError);
          await this.setUserData(basicUserInfo);
        }
      }
      
      return response.data;
    } catch (error: any) {
      console.error('❌ Login failed:', error);
      
      if (error.response?.status === 401) {
        throw new Error('Invalid mobile number or password');
      } else if (error.response?.status === 400) {
        throw new Error(error.response.data?.detail || 'Login failed');
      } else {
        throw new Error(`Login failed: ${error.message || 'Unknown error occurred'}`);
      }
    }
  }

  // Set authentication token
  async setToken(token: string): Promise<void> {
    this.token = token;
    await SecureStore.setItemAsync('authToken', token);
  }

  // Get stored authentication token
  async getToken(): Promise<string | null> {
    if (!this.token) {
      this.token = await SecureStore.getItemAsync('authToken');
    }
    return this.token;
  }

  // Set user data
  async setUserData(userData: UserData): Promise<void> {
    this.userData = userData;
    await SecureStore.setItemAsync('userData', JSON.stringify(userData));
  }

  // Get stored user data
  async getUserData(): Promise<UserData | null> {
    if (!this.userData) {
      const storedData = await SecureStore.getItemAsync('userData');
      if (storedData) {
        this.userData = JSON.parse(storedData);
      }
    }
    return this.userData;
  }

  // Clear authentication token and user data
  async clearToken(): Promise<void> {
    this.token = null;
    this.userData = null;
    await SecureStore.deleteItemAsync('authToken');
    await SecureStore.deleteItemAsync('userData');
  }

  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    const token = await this.getToken();
    return !!token;
  }

  // Extract user data from JWT token
  private async extractUserDataFromToken(token: string): Promise<UserData> {
    try {
      const tokenParts = token.split('.');
      if (tokenParts.length === 3) {
        const payload = JSON.parse(atob(tokenParts[1]));
        
        // Extract user information from token payload
        const userData: UserData = {
          id: payload.sub || payload.user_id || payload.vehicle_owner_id || '',
          fullName: payload.full_name || payload.name || '',
          primaryMobile: payload.primary_number || payload.mobile || '',
          secondaryMobile: payload.secondary_number || '',
          address: payload.address || '',
          aadharNumber: payload.aadhar_number || '',
          organizationId: payload.organization_id || payload.org_id || '',
          languages: payload.languages || payload.spoken_languages || []
        };
        
        console.log('🔍 Extracted user data from token:', userData);
        return userData;
      }
      throw new Error('Invalid token format');
    } catch (error) {
      console.error('❌ Failed to extract user data from token:', error);
      
      // Return minimal user data if token decoding fails
      return {
        id: '',
        fullName: '',
        primaryMobile: '',
        secondaryMobile: '',
        address: '',
        aadharNumber: '',
        organizationId: '',
        languages: []
      };
    }
  }

  // Verify JWT token by making an authenticated request
  async verifyToken(): Promise<JWTVerificationResponse> {
    try {
      console.log('🔐 Verifying JWT token...');
      
      const token = await this.getToken();
      if (!token) {
        throw new Error('No authentication token found');
      }

      // Make an authenticated request to verify the token
      // Using a protected endpoint to validate the token
      const response = await axiosInstance.get('/api/users/cardetails/organization/test', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // If we get here, the token is valid
      // Get user data from stored data
      const userData = await this.getUserData();
      
      return {
        verified: true,
        user_id: userData?.id || '',
        organization_id: userData?.organizationId || '',
        token: token,
        message: 'Token verified successfully'
      };
    } catch (error: any) {
      console.error('❌ JWT verification failed:', error);
      
      if (error.response?.status === 401) {
        // Token is invalid, clear it
        await this.clearToken();
        throw new Error('JWT token is invalid or expired');
      } else if (error.response?.status === 403) {
        throw new Error('Access denied - insufficient permissions');
      } else {
        throw new Error(`JWT verification failed: ${error.message || 'Unknown error'}`);
      }
    }
  }

  // Get authenticated headers for API requests
  async getAuthHeaders(): Promise<{ Authorization: string }> {
    const token = await this.getToken();
    if (!token) {
      throw new Error('No authentication token found. Please login first.');
    }
    return {
      'Authorization': `Bearer ${token}`
    };
  }

  // Refresh token if needed (for future implementation)
  async refreshToken(): Promise<boolean> {
    try {
      // This would call a refresh endpoint if your backend supports it
      // For now, we'll just verify the current token
      await this.verifyToken();
      return true;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      return false;
    }
  }

  // Logout user
  async logout(): Promise<void> {
    try {
      await this.clearToken();
      console.log('✅ User logged out successfully');
    } catch (error) {
      console.error('❌ Logout failed:', error);
    }
  }

  // Get user profile information
  async getUserProfile(): Promise<any> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axiosInstance.get('/api/users/vehicleowner/profile', { headers });
      return response.data;
    } catch (error: any) {
      console.error('❌ Failed to get user profile:', error);
      throw new Error('Failed to retrieve user profile');
    }
  }

  // Get complete user data for forms
  async getCompleteUserData(): Promise<UserData> {
    const userData = await this.getUserData();
    if (!userData) {
      throw new Error('No user data found. Please login again.');
    }
    return userData;
  }

  // Fetch complete user profile from backend
  private async fetchUserProfileFromBackend(token: string): Promise<Partial<UserData>> {
    try {
      console.log('🔍 Fetching complete user profile from backend...');
      
      const response = await axiosInstance.get('/api/users/vehicleowner/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data) {
        console.log('✅ User profile fetched:', response.data);
        
        // Map backend response to our UserData format
        return {
          fullName: response.data.full_name || response.data.name || '',
          primaryMobile: response.data.primary_number || response.data.mobile || '',
          secondaryMobile: response.data.secondary_number || '',
          address: response.data.address || '',
          aadharNumber: response.data.aadhar_number || '',
          languages: response.data.languages || response.data.spoken_languages || []
        };
      }
      
      return {};
    } catch (error: any) {
      console.error('❌ Failed to fetch user profile:', error);
      throw new Error('Could not fetch complete user profile');
    }
  }
}

// Export singleton instance
export const authService = AuthService.getInstance();

// Export individual functions for backward compatibility
export const loginVehicleOwner = (mobileNumber: string, password: string) => 
  authService.loginVehicleOwner(mobileNumber, password);

export const verifyJWTToken = (token: string) => authService.verifyToken();
export const isAuthenticated = () => authService.isAuthenticated();
export const getAuthHeaders = () => authService.getAuthHeaders();
export const logout = () => authService.logout();
export const getUserProfile = () => authService.getUserProfile();
export const getCompleteUserData = () => authService.getCompleteUserData();

export default authService;
