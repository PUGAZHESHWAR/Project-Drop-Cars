import axiosInstance from '@/app/api/axiosInstance';
import { authService, getAuthHeaders, loginVehicleOwner as authLoginVehicleOwner } from './authService';

// Re-export for compatibility
export const loginVehicleOwner = authLoginVehicleOwner;

// Single API call interface matching your working Postman request
export interface SignupData {
  full_name: string;
  primary_number: string;
  secondary_number?: string;
  password: string;
  address: string;
  aadhar_number: string;
  organization_id: string;
  aadhar_front_img: any; // File object for FormData
  
}

export interface SignupResponse {
  message: string;
  user_id: string;
  aadhar_img_url: string;
  status: string;
}

// Single signup API call using FormData for file upload
export const signupAccount = async (personalData: any, documents: any): Promise<SignupResponse> => {
  console.log('🚀 Starting signup process with FormData...');
  console.log('📤 Personal data received:', JSON.stringify(personalData, null, 2));
  console.log('📤 Documents received:', JSON.stringify(documents, null, 2));
  
  const maxRetries = 3;
  let lastError: any;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Attempt ${attempt}/${maxRetries}...`);
      
      // Create FormData for multipart/form-data upload
      const formData = new FormData();
      
      // Append the image file
      if (documents.aadharFront) {
        const imageUri = documents.aadharFront;
        const imageName = imageUri.split('/').pop() || 'aadhar.jpg';
        const imageType = imageUri.endsWith('.png') ? 'image/png' : 'image/jpeg';
        
        formData.append('aadhar_front_img', {
          uri: imageUri,
          type: imageType,
          name: imageName
        } as any);
        
        console.log('🖼️ Image appended to FormData:', { uri: imageUri, type: imageType, name: imageName });
      }
      
      // Helper function to format phone numbers for backend - send 10 digits only
      const formatPhoneForBackend = (phone: string): string => {
        if (!phone || !phone.trim()) return '';
        
        console.log('📱 Original phone number:', phone);
        
        // Remove +91 prefix and any non-digit characters, keep only digits
        let cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '').trim();
        
        console.log('📱 After removing +91 and non-digits:', cleanPhone);
        
        if (!cleanPhone) return '';
        
        // Return only the last 10 digits (in case there are more)
        const finalPhone = cleanPhone.slice(-10);
        
        console.log('📱 Final formatted phone (10 digits):', finalPhone);
        
        return finalPhone;
      };

       // Validate required fields before sending
       const fullName = personalData.fullName?.trim();
       const primaryNumber = formatPhoneForBackend(personalData.primaryMobile || '');
       const password = personalData.password?.trim();
       const address = personalData.address?.trim();
       const aadharNumber = personalData.aadharNumber?.trim();
       
       if (!fullName) {
         throw new Error('Full name is required');
       }
       if (!primaryNumber || primaryNumber.length !== 10) {
         throw new Error('Valid 10-digit primary mobile number is required');
       }
       if (!password || password.length < 6) {
         throw new Error('Password must be at least 6 characters long');
       }
       if (!address) {
         throw new Error('Address is required');
       }
       if (!aadharNumber || aadharNumber.length !== 12) {
         throw new Error('Valid 12-digit Aadhar number is required');
       }

       // Append all other fields
       formData.append('full_name', fullName);
       formData.append('primary_number', primaryNumber);
       // Only append secondary_number if it has a value, otherwise skip it entirely
       const formattedSecondary = formatPhoneForBackend(personalData.secondaryMobile || '');
       if (formattedSecondary && formattedSecondary.length === 10) {
         formData.append('secondary_number', formattedSecondary);
       }
       // Don't append anything if secondary number is empty - let backend handle it as optional
       formData.append('password', password);
       formData.append('address', address);
       formData.append('aadhar_number', aadharNumber);
       formData.append('organization_id', personalData.organizationId || 'org_001');
      
      console.log('📤 FormData created with fields:', {
        full_name: fullName,
        primary_number: primaryNumber,
        secondary_number: formattedSecondary || 'Not provided (skipped)',
        password: password,
        address: address,
        aadhar_number: aadharNumber,
        organization_id: personalData.organizationId || 'org_001',
        aadhar_front_img: documents.aadharFront ? 'File attached' : 'No file'
      });
      
      console.log('📱 Phone number validation:', {
        original_primary: personalData.primaryMobile,
        formatted_primary: primaryNumber,
        original_secondary: personalData.secondaryMobile,
        formatted_secondary: formattedSecondary || 'Not provided'
      });
      
      // Log the actual FormData entries for debugging
      console.log('🔍 FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value);
      }
      
      // Make the API call with FormData
      const response = await axiosInstance.post('/api/users/vehicleowner/signup', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000, // 2 minutes timeout for file uploads
      });
      
      console.log('✅ Signup API response received:', {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
        headers: response.headers
      });
      
      // Validate response data
      if (!response.data || response.data.status !== 'success') {
        throw new Error('Invalid response from server - missing or invalid status');
      }
      
      return response.data;
      
    } catch (error: any) {
      lastError = error;
      console.error(`❌ Signup attempt ${attempt} failed:`, {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL,
          timeout: error.config?.timeout
        }
      });
      
      // Log detailed backend error for 400 status
      if (error.response?.status === 400) {
        console.error('❌ Backend validation error details:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });
        
        // Check for specific error messages and provide user-friendly messages
        const errorData = error.response.data;
        if (errorData && typeof errorData === 'object') {
          const errorMessage = errorData.detail || errorData.message || errorData.error || '';
          
          if (errorMessage.toLowerCase().includes('mobile') && errorMessage.toLowerCase().includes('exist')) {
            throw new Error('This mobile number is already registered. Please use a different mobile number or try logging in.');
          } else if (errorMessage.toLowerCase().includes('aadhar') && errorMessage.toLowerCase().includes('exist')) {
            throw new Error('This Aadhar number is already registered. Please use a different Aadhar number.');
          } else if (errorMessage.toLowerCase().includes('email') && errorMessage.toLowerCase().includes('exist')) {
            throw new Error('This email is already registered. Please use a different email.');
          } else if (errorMessage.toLowerCase().includes('validation') || errorMessage.toLowerCase().includes('required')) {
            throw new Error(`Please check your information: ${errorMessage}`);
          } else if (errorMessage) {
            throw new Error(errorMessage);
          }
        }
      }

      // If we got a successful response but axios treated it as an error
      if (error.response?.status >= 200 && error.response?.status < 300 && error.response?.data) {
        console.log('🔄 Converting error response to success response');
        return error.response.data;
      }

      // Don't retry on validation errors or client errors
      if (error.response?.status >= 400 && error.response?.status < 500) {
        console.log('🚫 Client error, not retrying');
        break;
      }

      // Wait before retrying (exponential backoff)
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // All retries failed, throw the last error
  console.error('❌ All signup attempts failed');
  
  // Provide specific error messages based on error type
  if (lastError.code === 'ECONNABORTED') {
    throw new Error('Request timeout - server is taking too long to respond. Please try again.');
  } else if (lastError.code === 'ERR_NETWORK') {
    throw new Error('Network error - please check your internet connection and try again.');
  } else if (lastError.code === 'ENOTFOUND') {
    throw new Error('Server not found - please check if the backend server is running.');
  } else if (lastError.response?.status === 422) {
    const errorDetails = lastError.response.data?.detail || lastError.response.data?.message || 'Invalid data provided';
    console.error('🔍 422 Validation Error Details:', errorDetails);
    throw new Error(`Validation error: ${errorDetails}. Check all required fields.`);
  } else if (lastError.response?.status === 400) {
    throw new Error(`Bad request: ${lastError.response.data?.message || 'Invalid data provided'}`);
  } else if (lastError.response?.status === 500) {
    throw new Error('Server error - please try again later or contact support.');
  } else if (lastError.response?.data?.message) {
    throw new Error(lastError.response.data.message);
  } else {
    throw new Error(`Signup failed: ${lastError.message || 'Unknown error occurred'}`);
  }
};

// Test function to check API connectivity
export const testSignupConnection = async () => {
  try {
    console.log('🧪 Testing signup endpoint connectivity...');
    const response = await axiosInstance.get('/api/users/vehicleowner/signup');
    console.log('✅ Signup endpoint accessible:', response.status);
    return true;
  } catch (error: any) {
    console.error('❌ Signup endpoint test failed:', error.message);
    return false;
  }
};

// Test function to validate data structure
export const testSignupDataStructure = (personalData: any, documents: any) => {
  console.log('🧪 Testing signup data structure for FormData...');
  
  const testData = {
    full_name: personalData.fullName || '',
    primary_number: personalData.primaryMobile || '',
    secondary_number: personalData.secondaryMobile || '',
    password: personalData.password || '',
    address: personalData.address || '',
    aadhar_number: personalData.aadharNumber || '',
    organization_id: personalData.organizationId || 'org_001',
    aadhar_front_img: documents.aadharFront ? 'File will be attached' : 'No file',
  };
  
  console.log('📊 Data Structure Test:');
  console.log('✅ Required fields present:', {
    full_name: !!testData.full_name,
    primary_number: !!testData.primary_number,
    password: !!testData.password,
    address: !!testData.address,
    aadhar_number: !!testData.aadhar_number,
    organization_id: !!testData.organization_id,
    aadhar_front_img: !!documents.aadharFront,
  });
  
  console.log('🔍 Field values:');
  Object.entries(testData).forEach(([key, value]) => {
    if (key !== 'aadhar_front_img') {
      console.log(`  ${key}: ${typeof value} = "${value}"`);
    } else {
      console.log(`  ${key}: ${documents.aadharFront ? 'File attached' : 'No file'}`);
    }
  });
  
  console.log('🖼️ Image details:', {
    uri: documents.aadharFront,
    type: documents.aadharFront ? (documents.aadharFront.endsWith('.png') ? 'image/png' : 'image/jpeg') : 'N/A',
    name: documents.aadharFront ? documents.aadharFront.split('/').pop() : 'N/A'
  });
  
  return testData;
};

// Convenience helper: perform signup then login to get JWT
export const signupAndLogin = async (personalData: any, documents: any) => {
  // First, perform signup
  const signupResponse = await signupAccount(personalData, documents);
  if (signupResponse.status !== 'success') {
    throw new Error('Signup did not complete successfully');
  }

  // Use the SAME phone number format for login as used in signup - send 10 digits only
  // Apply the same formatting function to ensure consistency
  const formatPhoneForBackend = (phone: string): string => {
    if (!phone || !phone.trim()) return '';
    // Remove +91 prefix and any non-digit characters, keep only 10 digits
    const cleanPhone = phone.replace(/^\+91/, '').replace(/\D/g, '').trim();
    if (!cleanPhone) return '';
    // Return only the last 10 digits (in case there are more)
    return cleanPhone.slice(-10);
  };
  
  const mobileForLogin = formatPhoneForBackend(personalData.primaryMobile || '');
  
  console.log('🔐 Using consistent phone format for login:', {
    original: personalData.primaryMobile,
    formatted: mobileForLogin
  });

  // Then, login to obtain JWT token
  const loginResponse = await authLoginVehicleOwner(mobileForLogin, personalData.password);

  return { signup: signupResponse, login: loginResponse };
};

// Car Details API interface matching your Postman request exactly
export interface CarDetailsData {
  car_name: string;
  car_type: string;
  car_number: string;
  organization_id: string;
  vehicle_owner_id: string;
  rc_front_img: any; // File object for FormData
  rc_back_img: any; // File object for FormData
  insurance_img: any; // File object for FormData
  fc_img: any; // File object for FormData
  car_img: any; // File object for FormData
}

// Enhanced JWT verification interface matching your backend
export interface JWTVerificationResponse {
  verified: boolean;
  user_id: string;
  organization_id: string;
  token: string;
  message: string;
}

// Login response interface matching your backend
export interface LoginResponse {
  access_token: string;
  token_type: string;
  account_status: string;
  car_driver_count: number;
  car_details_count: number;
}

// Enhanced car details response with JWT verification
export interface CarDetailsResponse {
  message: string;
  car_id: string;
  status: string;
  car_details: {
    car_name: string;
    car_type: string;
    car_number: string;
    organization_id: string;
    vehicle_owner_id: string;
    rc_front_img_url: string;
    rc_back_img_url: string;
    insurance_img_url: string;
    fc_img_url: string;
    car_img_url: string;
  };
  jwt_verification?: JWTVerificationResponse;
}


// JWT verification function (now properly integrated with your backend)
export const verifyJWTToken = async (token: string): Promise<JWTVerificationResponse> => {
  try {
    console.log('🔐 Verifying JWT token...');
    
    // Use the token to make an authenticated request to a protected endpoint
    // This will verify the token is valid
    const response = await axiosInstance.get('/api/users/cardetails/organization/test', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    // If we get here, the token is valid
    // Extract user info from the token or make another call to get user details
    const userInfo = await getUserInfoFromToken(token);
    
    return {
      verified: true,
      user_id: userInfo.user_id,
      organization_id: userInfo.organization_id,
      token: token,
      message: 'Token verified successfully'
    };
  } catch (error: any) {
    console.error('❌ JWT verification failed:', error);
    
    if (error.response?.status === 401) {
      throw new Error('JWT token is invalid or expired');
    } else if (error.response?.status === 403) {
      throw new Error('Access denied - insufficient permissions');
    } else {
      throw new Error(`JWT verification failed: ${error.message || 'Unknown error'}`);
    }
  }
};

// Helper function to get user info from token
const getUserInfoFromToken = async (token: string) => {
  try {
    // Decode JWT token to get user info (this is a simplified approach)
    // In production, you might want to make an API call to get user details
    const tokenParts = token.split('.');
    if (tokenParts.length === 3) {
      const payload = JSON.parse(atob(tokenParts[1]));
      return {
        user_id: payload.sub || payload.user_id || 'unknown',
        organization_id: payload.organization_id || payload.org_id || 'unknown'
      };
    }
    throw new Error('Invalid token format');
  } catch (error) {
    console.error('❌ Failed to decode token:', error);
    return {
      user_id: 'unknown',
      organization_id: 'unknown'
    };
  }
};

// Enhanced car details API call with proper JWT authentication
export const addCarDetails = async (carData: CarDetailsData): Promise<CarDetailsResponse> => {
  console.log('🚗 Starting car details registration with JWT authentication...');
  console.log('📤 Car data received:', JSON.stringify(carData, null, 2));
  
  try {
    // Verify we have a valid token
    const token = await authService.getToken();
    if (!token) {
      throw new Error('No authentication token found. Please login first.');
    }
    
    // Create FormData for multipart/form-data upload
    const formData = new FormData();
    
    // Helper function to append image files
    const appendImageFile = (fieldName: string, imageUri: string, defaultName: string) => {
      if (imageUri) {
        const imageName = imageUri.split('/').pop() || defaultName;
        const imageType = imageUri.endsWith('.png') ? 'image/png' : 'image/jpeg';
        
        formData.append(fieldName, {
          uri: imageUri,
          type: imageType,
          name: imageName
        } as any);
        
        console.log(`🖼️ ${fieldName} appended to FormData:`, { uri: imageUri, type: imageType, name: imageName });
      } else {
        console.log(`⚠️ ${fieldName} not provided, skipping...`);
      }
    };
    
    // Append all image files
    appendImageFile('rc_front_img', carData.rc_front_img, 'rc_front.jpg');
    appendImageFile('rc_back_img', carData.rc_back_img, 'rc_back.jpg');
    appendImageFile('insurance_img', carData.insurance_img, 'insurance.jpg');
    appendImageFile('fc_img', carData.fc_img, 'fc.jpg');
    appendImageFile('car_img', carData.car_img, 'car.jpg');
    
    // Append text fields exactly as shown in Postman
    formData.append('car_name', carData.car_name || '');
    formData.append('car_type', carData.car_type || '');
    formData.append('car_number', carData.car_number || '');
    formData.append('organization_id', carData.organization_id || '');
    formData.append('vehicle_owner_id', carData.vehicle_owner_id || '');
    
    console.log('📤 FormData created with fields:', {
      car_name: carData.car_name,
      car_type: carData.car_type,
      car_number: carData.car_number,
      organization_id: carData.organization_id,
      vehicle_owner_id: carData.vehicle_owner_id,
      rc_front_img: carData.rc_front_img ? 'File attached' : 'No file',
      rc_back_img: carData.rc_back_img ? 'File attached' : 'No file',
      insurance_img: carData.insurance_img ? 'File attached' : 'No file',
      fc_img: carData.fc_img ? 'File attached' : 'No file',
      car_img: carData.car_img ? 'File attached' : 'No file'
    });
    
    // Make the API call with FormData and JWT authentication
    // Endpoint: /api/users/cardetails/signup (matches Postman exactly)
    const authHeaders = await getAuthHeaders();
    
    console.log('🔍 Request details:', {
      url: '/api/users/cardetails/signup',
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
        ...authHeaders
      },
      formDataKeys: ['car_name', 'car_type', 'car_number', 'organization_id', 'vehicle_owner_id', 'rc_front_img', 'rc_back_img', 'insurance_img', 'fc_img', 'car_img']
    });
    
    const response = await axiosInstance.post('/api/users/cardetails/signup', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        ...authHeaders
      },
    });
    
    console.log('✅ Car details API response received:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    
    // Check if the response is successful before validating
    if (response.status !== 200 && response.status !== 201) {
      const errorDetails = response.data?.detail || response.data?.message || 'Backend validation failed';
      console.error('🔍 Backend validation error:', {
        status: response.status,
        details: errorDetails,
        fullResponse: response.data
      });
      throw new Error(`Backend validation failed: ${errorDetails}`);
    }
    
    // Validate response data - ensure values are meaningful
    const responseData = response.data;
    
    // Check if response has success status
    if (responseData.status !== 'success') {
      throw new Error(`Backend returned non-success status: ${responseData.status}`);
    }
    
    // Validate car_id (should be a valid string)
    if (!responseData.car_id || typeof responseData.car_id !== 'string' || responseData.car_id.trim().length === 0) {
      throw new Error('Invalid car ID received from server');
    }
    
    // Validate image_urls object exists
    if (!responseData.image_urls || typeof responseData.image_urls !== 'object') {
      throw new Error('Image URLs not received from server');
    }
    
    const imageUrls = responseData.image_urls;
    
    // Validate all required image URLs exist and are valid
    const requiredImageFields = [
      'rc_front_img_url', 
      'rc_back_img_url', 
      'insurance_img_url', 
      'fc_img_url', 
      'car_img_url'
    ];
    
    for (const field of requiredImageFields) {
      if (!imageUrls[field] || typeof imageUrls[field] !== 'string' || imageUrls[field].trim().length === 0) {
        throw new Error(`${field.replace(/_/g, ' ')} not received from server`);
      }
    }
    
    console.log('✅ All response values validated successfully');
    console.log('✅ Car ID:', responseData.car_id);
    console.log('✅ Image URLs received:', Object.keys(imageUrls));
    
    return responseData;
  } catch (error: any) {
    console.error('❌ Car details registration failed with error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        baseURL: error.config?.baseURL,
        timeout: error.config?.timeout
      }
    });

    // Provide specific error messages based on error type
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout - server is taking too long to respond. Please try again.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error - please check your internet connection and try again.');
    } else if (error.code === 'ENOTFOUND') {
      throw new Error('Server not found - please check if the backend server is running.');
    } else if (error.response?.status === 401) {
      throw new Error('Authentication failed - please login again to get a valid token.');
    } else if (error.response?.status === 403) {
      throw new Error('Access denied - insufficient permissions for this operation.');
    } else if (error.response?.status === 422) {
      const errorDetails = error.response.data?.detail || error.response.data?.message || 'Invalid data provided';
      console.error('🔍 422 Validation Error Details:', errorDetails);
      throw new Error(`Validation error: ${errorDetails}. Check all required fields.`);
    } else if (error.response?.status === 400) {
      throw new Error(`Bad request: ${error.response.data?.message || 'Invalid data provided'}`);
    } else if (error.response?.status === 500) {
      throw new Error('Server error - please try again later or contact support.');
    } else if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    } else {
      throw new Error(`Car details registration failed: ${error.message || 'Unknown error occurred'}`);
    }
  }
};

// Enhanced car details API with JWT verification and automatic login
export const addCarDetailsWithLogin = async (
  carData: CarDetailsData, 
  userData: any, 
  onLoginSuccess: (user: any, token: string) => void
): Promise<CarDetailsResponse> => {
  try {
    console.log('🚗 Starting car details registration with automatic login...');
    
    // First, add car details (this will use the stored JWT token)
    const carResponse = await addCarDetails(carData);
    
    if (carResponse.status === 'success') {
      console.log('✅ Car details added successfully, proceeding with JWT verification...');
      
      // Get the JWT token from secure storage
      const token = await authService.getToken();
      
      if (token) {
        // Verify the JWT token
        const jwtVerification = await verifyJWTToken(token);
        
        if (jwtVerification.verified && 
            jwtVerification.user_id && 
            jwtVerification.organization_id &&
            jwtVerification.user_id.length > 0 &&
            jwtVerification.organization_id.length > 0) {
          
          console.log('✅ JWT verification successful, proceeding with automatic login...');
          
          // Create enhanced user object with car information
          const enhancedUser = {
            ...userData,
            id: jwtVerification.user_id,
            organizationId: jwtVerification.organization_id,
            cars: [{
              id: carResponse.car_id,
              name: carData.car_name,
              type: carData.car_type,
              number: carData.car_number,
              rcFrontUrl: carResponse.car_details.rc_front_img_url,
              rcBackUrl: carResponse.car_details.rc_back_img_url,
              insuranceUrl: carResponse.car_details.insurance_img_url,
              fcUrl: carResponse.car_details.fc_img_url,
              carUrl: carResponse.car_details.car_img_url
            }]
          };
          
          // Call the login success callback
          onLoginSuccess(enhancedUser, token);
          
          console.log('🎉 Automatic login completed successfully');
          
          // Return enhanced response with JWT verification data
          return {
            ...carResponse,
            jwt_verification: jwtVerification
          };
        } else {
          throw new Error('JWT verification failed - invalid user or organization data');
        }
      } else {
        throw new Error('No authentication token found');
      }
    } else {
      throw new Error('Car details registration was not successful');
    }
  } catch (error: any) {
    console.error('❌ Car details with login failed:', error);
    throw error;
  }
};

// Test function to check car details API connectivity
export const testCarDetailsConnection = async () => {
  try {
    console.log('🧪 Testing car details endpoint connectivity...');
    const response = await axiosInstance.get('/api/users/cardetails/signup');
    console.log('✅ Car details endpoint accessible:', response.status);
    return true;
  } catch (error: any) {
    console.error('❌ Car details endpoint test failed:', error.message);
    return false;
  }
};

// Test function to validate car details data structure
export const testCarDetailsDataStructure = (carData: CarDetailsData) => {
  console.log('🧪 Testing car details data structure for FormData...');
  
  const testData = {
    car_name: carData.car_name || '',
    car_type: carData.car_type || '',
    car_number: carData.car_number || '',
    organization_id: carData.organization_id || '',
    vehicle_owner_id: carData.vehicle_owner_id || '',
    rc_front_img: carData.rc_front_img ? 'File will be attached' : 'No file',
    rc_back_img: carData.rc_back_img ? 'File will be attached' : 'No file',
    insurance_img: carData.insurance_img ? 'File will be attached' : 'No file',
    fc_img: carData.fc_img ? 'File will be attached' : 'No file',
    car_img: carData.car_img ? 'File will be attached' : 'No file',
  };
  
  console.log('📊 Car Details Data Structure Test:');
  console.log('✅ Required fields present:', {
    car_name: !!testData.car_name,
    car_type: !!testData.car_type,
    car_number: !!testData.car_number,
    organization_id: !!testData.organization_id,
    vehicle_owner_id: !!testData.vehicle_owner_id,
    rc_front_img: !!carData.rc_front_img,
    rc_back_img: !!carData.rc_back_img,
    insurance_img: !!carData.insurance_img,
    fc_img: !!carData.fc_img,
    car_img: !!carData.car_img,
  });
  
  console.log('🔍 Field values:');
  Object.entries(testData).forEach(([key, value]) => {
    if (key.includes('_img')) {
      console.log(`  ${key}: ${carData[key as keyof CarDetailsData] ? 'File attached' : 'No file'}`);
    } else {
      console.log(`  ${key}: ${typeof value} = "${value}"`);
    }
  });
  
  console.log('🖼️ Image details:');
  const imageFields = ['rc_front_img', 'rc_back_img', 'insurance_img', 'fc_img', 'car_img'];
  imageFields.forEach(field => {
    const imageUri = carData[field as keyof CarDetailsData];
    if (imageUri) {
      console.log(`  ${field}:`, {
        uri: imageUri,
        type: imageUri.endsWith('.png') ? 'image/png' : 'image/jpeg',
        name: imageUri.split('/').pop()
      });
    } else {
      console.log(`  ${field}: No image provided`);
    }
  });
  
  return testData;
};