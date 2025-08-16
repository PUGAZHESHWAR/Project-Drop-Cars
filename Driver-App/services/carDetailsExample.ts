import { 
  addCarDetails, 
  addCarDetailsWithLogin,
  verifyJWTToken,
  testCarDetailsDataStructure, 
  CarDetailsData,
  JWTVerificationResponse 
} from './signupService';

// Example usage of the car details API with JWT verification
export const exampleCarDetailsUsage = async () => {
  console.log('🚗 Example: Using Car Details API with JWT Verification');
  
  // Sample car data matching your Postman request
  const sampleCarData: CarDetailsData = {
    car_name: 'Toyota Camry',
    car_type: 'SEDAN',
    car_number: 'MH-12-AB-1234',
    organization_id: 'org_123',
    vehicle_owner_id: '2819b115-fbcc-42ec-a5b3-81633980d9ce',
    rc_front_img: 'file://path/to/rc_front.png',
    rc_back_img: 'file://path/to/rc_back.png',
    insurance_img: 'file://path/to/insurance.png',
    fc_img: 'file://path/to/fc.png',
    car_img: 'file://path/to/car.png'
  };

  try {
    // Test the data structure first
    console.log('🧪 Testing data structure...');
    const testResult = testCarDetailsDataStructure(sampleCarData);
    console.log('✅ Data structure test completed');

    // Call the API (uncomment when ready to test)
    // console.log('📤 Calling car details API...');
    // const response = await addCarDetails(sampleCarData);
    // console.log('✅ API Response:', response);

  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Example of using the enhanced API with JWT verification and automatic login
export const exampleCarDetailsWithLogin = async () => {
  console.log('🚗 Example: Using Car Details API with JWT Verification and Auto-Login');
  
  const sampleCarData: CarDetailsData = {
    car_name: 'Honda City',
    car_type: 'SEDAN',
    car_number: 'DL-01-AB-5678',
    organization_id: 'org_456',
    vehicle_owner_id: '3920c226-gcdd-53fd-b6c4-92744991e0df',
    rc_front_img: 'file://path/to/honda_rc_front.png',
    rc_back_img: 'file://path/to/honda_rc_back.png',
    insurance_img: 'file://path/to/honda_insurance.png',
    fc_img: 'file://path/to/honda_fc.png',
    car_img: 'file://path/to/honda_city.png'
  };

  const sampleUserData = {
    id: '3920c226-gcdd-53fd-b6c4-92744991e0df',
    fullName: 'John Doe',
    primaryMobile: '+919876543210',
    secondaryMobile: '+919876543211',
    paymentMethod: 'GPay',
    paymentNumber: '+919876543210',
    password: 'securepassword123',
    address: '123 Main Street, New Delhi',
    aadharNumber: '123456789012',
    organizationId: 'org_456',
    languages: ['English', 'Hindi'],
    documents: { aadharFront: 'file://path/to/aadhar.png' }
  };

  try {
    console.log('🧪 Testing data structure...');
    const testResult = testCarDetailsDataStructure(sampleCarData);
    console.log('✅ Data structure test completed');

    // Example of using the enhanced API with automatic login
    // console.log('📤 Calling enhanced car details API with JWT verification...');
    // const response = await addCarDetailsWithLogin(sampleCarData, sampleUserData, async (enhancedUser, token) => {
    //   console.log('🎉 Auto-login callback triggered');
    //   console.log('Enhanced User:', enhancedUser);
    //   console.log('Token:', token);
    //   
    //   // Here you would typically call your login function
    //   // await login(enhancedUser, token);
    // });
    // console.log('✅ Enhanced API Response:', response);

  } catch (error) {
    console.error('❌ Error:', error);
  }
};

// Example of JWT verification standalone
export const exampleJWTVerification = async (token: string) => {
  console.log('🔐 Example: JWT Token Verification');
  
  try {
    const verification = await verifyJWTToken(token);
    
    if (verification.verified) {
      console.log('✅ JWT Verification Successful');
      console.log('User ID:', verification.user_id);
      console.log('Organization ID:', verification.organization_id);
      console.log('Message:', verification.message);
      
      // Validate that values are greater than zero (meaningful)
      if (verification.user_id.length > 0 && verification.organization_id.length > 0) {
        console.log('✅ All verification values are meaningful');
        return verification;
      } else {
        throw new Error('JWT verification values are not meaningful');
      }
    } else {
      throw new Error('JWT verification failed');
    }
  } catch (error) {
    console.error('❌ JWT Verification Error:', error);
    throw error;
  }
};

// Example of how to handle the enhanced API response
export const handleEnhancedCarDetailsResponse = (response: any) => {
  if (response.status === 'success') {
    console.log('🎉 Car added successfully!');
    console.log('Car ID:', response.car_id);
    console.log('Message:', response.message);
    
    // Access the car details
    const carDetails = response.car_details;
    console.log('Car Details:', {
      name: carDetails.car_name,
      type: carDetails.car_type,
      number: carDetails.car_number,
      rcFrontUrl: carDetails.rc_front_img_url,
      rcBackUrl: carDetails.rc_back_img_url,
      insuranceUrl: carDetails.insurance_img_url,
      fcUrl: carDetails.fc_img_url,
      carUrl: carDetails.car_img_url
    });
    
    // Check if JWT verification data exists
    if (response.jwt_verification) {
      console.log('🔐 JWT Verification Data:', response.jwt_verification);
      console.log('User ID:', response.jwt_verification.user_id);
      console.log('Organization ID:', response.jwt_verification.organization_id);
      console.log('Verified:', response.jwt_verification.verified);
    }
  } else {
    console.log('⚠️ API returned non-success status:', response.status);
  }
};

// Enhanced validation function with JWT considerations
export const validateCarDetailsWithJWT = (carData: CarDetailsData, token?: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Required text fields
  if (!carData.car_name?.trim()) errors.push('Car name is required');
  if (!carData.car_type?.trim()) errors.push('Car type is required');
  if (!carData.car_number?.trim()) errors.push('Car number is required');
  if (!carData.organization_id?.trim()) errors.push('Organization ID is required');
  if (!carData.vehicle_owner_id?.trim()) errors.push('Vehicle owner ID is required');
  
  // Required images
  if (!carData.rc_front_img) errors.push('RC front image is required');
  if (!carData.rc_back_img) errors.push('RC back image is required');
  if (!carData.insurance_img) errors.push('Insurance image is required');
  if (!carData.fc_img) errors.push('FC image is required');
  if (!carData.car_img) errors.push('Car image is required');
  
  // Car type validation
  const validCarTypes = ['SEDAN', 'HATCHBACK', 'SUV', 'INNOVA', 'INNOVA CRYSTA', 'OTHER'];
  if (!validCarTypes.includes(carData.car_type)) {
    errors.push(`Car type must be one of: ${validCarTypes.join(', ')}`);
  }
  
  // Car number format validation (basic)
  const carNumberRegex = /^[A-Z]{2}-\d{2}-[A-Z]{2}-\d{4}$/;
  if (!carNumberRegex.test(carData.car_number)) {
    errors.push('Car number must be in format: XX-XX-XX-XXXX (e.g., MH-12-AB-1234)');
  }
  
  // JWT token validation (if provided)
  if (token && token.trim().length === 0) {
    errors.push('JWT token is required for verification');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Example of creating FormData manually (if needed)
export const createCarDetailsFormData = (carData: CarDetailsData): FormData => {
  const formData = new FormData();
  
  // Append text fields
  formData.append('car_name', carData.car_name);
  formData.append('car_type', carData.car_type);
  formData.append('car_number', carData.car_number);
  formData.append('organization_id', carData.organization_id);
  formData.append('vehicle_owner_id', carData.vehicle_owner_id);
  
  // Append image files
  if (carData.rc_front_img) {
    formData.append('rc_front_img', {
      uri: carData.rc_front_img,
      type: 'image/png',
      name: 'rc_front.png'
    } as any);
  }
  
  if (carData.rc_back_img) {
    formData.append('rc_back_img', {
      uri: carData.rc_back_img,
      type: 'image/png',
      name: 'rc_back.png'
    } as any);
  }
  
  if (carData.insurance_img) {
    formData.append('insurance_img', {
      uri: carData.insurance_img,
      type: 'image/png',
      name: 'insurance.png'
    } as any);
  }
  
  if (carData.fc_img) {
    formData.append('fc_img', {
      uri: carData.fc_img,
      type: 'image/png',
      name: 'fc.png'
    } as any);
  }
  
  if (carData.car_img) {
    formData.append('car_img', {
      uri: carData.car_img,
      type: 'image/png',
      name: 'car.png'
    } as any);
  }
  
  return formData;
};

// Example of complete workflow with JWT verification
export const completeCarRegistrationWorkflow = async (carData: CarDetailsData, userData: any) => {
  console.log('🚀 Starting Complete Car Registration Workflow');
  
  try {
    // Step 1: Validate input data
    const validation = validateCarDetailsWithJWT(carData);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }
    console.log('✅ Step 1: Data validation passed');
    
    // Step 2: Test data structure
    const testResult = testCarDetailsDataStructure(carData);
    console.log('✅ Step 2: Data structure test passed');
    
    // Step 3: Register car with JWT verification and auto-login
    const response = await addCarDetailsWithLogin(carData, userData, async (enhancedUser, token) => {
      console.log('🎉 Auto-login callback executed');
      console.log('Enhanced User Data:', enhancedUser);
      console.log('JWT Token:', token);
      
      // Here you would integrate with your authentication system
      // await yourAuthSystem.login(enhancedUser, token);
    });
    
    console.log('✅ Step 3: Car registration with JWT verification completed');
    
    // Step 4: Handle response
    handleEnhancedCarDetailsResponse(response);
    
    return response;
    
  } catch (error) {
    console.error('❌ Workflow failed:', error);
    throw error;
  }
};

export default {
  exampleCarDetailsUsage,
  exampleCarDetailsWithLogin,
  exampleJWTVerification,
  handleEnhancedCarDetailsResponse,
  validateCarDetailsWithJWT,
  createCarDetailsFormData,
  completeCarRegistrationWorkflow
};
