import axiosInstance from '@/app/api/axiosInstance';
import authService, { getAuthHeaders } from '../auth/authService';

// Order interface for pending orders
export interface PendingOrder {
  id: string;
  order_id: string;
  pickup_location: string;
  drop_location: string;
  pickup_drop_location: string; // Added for compatibility
  pick_near_city?: string; // City hint for multicity discovery ("ALL" or specific city)
  near_city?: string; // Alternate backend field name
  send_to?: string; // e.g., 'NEAR_CITY'
  distance: number;
  trip_distance: number; // Added for compatibility
  estimated_price: number;
  cost_per_km: number; // Added for compatibility
  customer_name: string;
  customer_mobile: string;
  customer_number: string; // Added for compatibility
  car_type: string;
  trip_type: string;
  start_date_time: string;
  status: string;
  created_at: string;
  updated_at: string;
  driver_allowance: number; // Added for compatibility
  permit_charges: number; // Added for compatibility
  hill_charges: number; // Added for compatibility
  toll_charges: number; // Added for compatibility
}

// Available driver interface
export interface AvailableDriver {
  id: string;
  full_name: string;
  primary_number: string;
  secondary_number?: string;
  address: string;
  aadhar_number: string;
  status: string;
  is_available: boolean;
  current_assignment?: any;
  updated_at: string;
  created_at: string;
  driver_status?: string;
  adress?: string; // Alternative spelling
  licence_number?: string; // Alternative field name
}

// Available car interface
export interface AvailableCar {
  id: string;
  car_name: string;
  car_number: string;
  car_type: string;
  is_available: boolean;
  current_assignment?: any;
  car_status?: string;
  status?: string;
}

// Get pending orders for vehicle owner - using only /api/orders/vehicle_owner/pending
export const getPendingOrders = async (): Promise<PendingOrder[]> => {
  console.log('📋 Fetching pending orders for vehicle owner...');
  
  try {
    const token = await authService.getToken();
    if (!token) {
      throw new Error('No authentication token found. Please login first.');
    }

    const response = await axiosInstance.get('/api/orders/vehicle_owner/pending', {                                                       
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.data) {
      console.log('assignmeent service  loaded ')
      console.log('✅ Pending orders fetched successfully:', response.data.length, 'orders');
      return response.data;
    }

    return [];
  } catch (error: any) {
    console.error('❌ Failed to fetch pending orders:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    } else if (error.response?.status === 404) {
      throw new Error('Pending orders endpoint not found.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else {
      throw new Error(error.message || 'Failed to fetch pending orders');
    }
  }
};

// Get driver assignments with details (for compatibility)
export const getDriverAssignmentsWithDetails = async (driverId: string): Promise<any[]> => {
  try {
    console.log('📋 Fetching driver assignments with details for driver:', driverId);
    if (!driverId || driverId === 'undefined' || driverId === 'null') {
      console.warn('⚠️ Skipping driver assignments fetch: invalid driverId');
    return [];
    }
    const authHeaders = await getAuthHeaders();
    
    const response = await axiosInstance.get(`/api/assignments/driver/${driverId}`, {
      headers: authHeaders
    });

    return response.data || [];
  } catch (error: any) {
    console.error('❌ Failed to fetch driver assignments:', error);
    return [];
  }
};

// Fetch assignments for driver (for compatibility)
export const fetchAssignmentsForDriver = async (driverId: string): Promise<any[]> => {
  try {
    console.log('📋 Fetching assignments for driver:', driverId);
    return await getDriverAssignmentsWithDetails(driverId);
  } catch (error: any) {
    console.error('❌ Failed to fetch assignments for driver:', error);
    return [];
  }
};

// Get order assignments (for compatibility)
export const getOrderAssignments = async (orderId: string): Promise<any[]> => {
  try {
    console.log('📋 Fetching order assignments for order:', orderId);
    const authHeaders = await getAuthHeaders();
    
    const response = await axiosInstance.get(`/api/assignments/order/${orderId}`, {
      headers: authHeaders
    });

    return response.data || [];
  } catch (error: any) {
    console.error('❌ Failed to fetch order assignments:', error);
    return [];
      }
};

// Get future rides with details (for compatibility)
export const getFutureRidesWithDetails = async (): Promise<any[]> => {
  try {
    console.log('🚗 Fetching future rides with details...');
    const authHeaders = await getAuthHeaders();
    
    const response = await axiosInstance.get('/api/orders/vehicle_owner/future', {
      headers: authHeaders
    });

    return response.data || [];
  } catch (error: any) {
    console.error('❌ Failed to fetch future rides with details:', error);
    return [];
  }
};

// Fetch available drivers (for compatibility)
export const fetchAvailableDrivers = async (): Promise<AvailableDriver[]> => {
  try {
    console.log('👥 Fetching available drivers from assignment service...');
    const authHeaders = await getAuthHeaders();
    
    const response = await axiosInstance.get('/api/users/available-drivers', {
      headers: authHeaders
    });

    const allDrivers = response.data || [];
    
    // Filter out drivers with PROCESSING or OFFLINE status - they should not be available for assignment
    const availableDrivers = allDrivers.filter((driver: AvailableDriver) => {
      const driverStatus = driver.driver_status || driver.status;
      const isProcessing = driverStatus === 'PROCESSING' || driverStatus === 'processing';
      const isOffline = driverStatus === 'OFFLINE' || driverStatus === 'offline' || driverStatus === 'BLOCKED' || driverStatus === 'blocked';
      
      if (isProcessing) {
        console.log(`🚫 Excluding driver ${driver.full_name} (${driver.id}) - status: ${driverStatus} (Under verification)`);
      }
      
      if (isOffline) {
        console.log(`🚫 Excluding driver ${driver.full_name} (${driver.id}) - status: ${driverStatus} (Not available)`);
      }
      
      // Only include drivers who are ONLINE, DRIVING, or other active statuses
      const isAvailable = !isProcessing && !isOffline;
      return isAvailable;
    });
    
    console.log(`✅ Filtered ${allDrivers.length} drivers to ${availableDrivers.length} available drivers (excluded PROCESSING and OFFLINE drivers)`);
    return availableDrivers;
  } catch (error: any) {
    console.error('❌ Failed to fetch available drivers:', error);
    return [];
  }
};

// Fetch available cars (for compatibility)
export const fetchAvailableCars = async (): Promise<AvailableCar[]> => {
  try {
    console.log('🚗 Fetching available cars from assignment service...');
    const authHeaders = await getAuthHeaders();
    
    const response = await axiosInstance.get('/api/users/available-cars', {
      headers: authHeaders
    });

    return response.data || [];
  } catch (error: any) {
    console.error('❌ Failed to fetch available cars:', error);
    return [];
  }
};

// Check order availability (for compatibility)
export const checkOrderAvailability = async (orderId: string): Promise<boolean> => {
  try {
    console.log('🔍 Checking order availability for order:', orderId);
    const authHeaders = await getAuthHeaders();
    
    const response = await axiosInstance.get(`/api/orders/${orderId}/availability`, {
      headers: authHeaders
    });

    return response.data?.available || false;
  } catch (error: any) {
    console.error('❌ Failed to check order availability:', error);
      return false;
  }
};

export const acceptOrder = async (orderData: { order_id: string | number }): Promise<any> => {
  try {
    const orderIdNum = typeof orderData.order_id === 'string' ? Number(orderData.order_id) : orderData.order_id;
    console.log('✅ Accepting order via /api/assignments/acceptorder:', { order_id: orderIdNum });
    const authHeaders = await getAuthHeaders();
    const response = await axiosInstance.post('/api/assignments/acceptorder', { order_id: orderIdNum }, { headers: authHeaders });
    console.log('✅ Order accepted successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to accept order:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw error;
  }
};

export const updateAssignmentStatus = async (assignmentId: string, status: string): Promise<any> => {
  try {
    console.log('🔄 Updating assignment status:', { assignmentId, status });
    const authHeaders = await getAuthHeaders();
    
    const response = await axiosInstance.put(`/api/assignments/${assignmentId}/status`, {
      status: status
    }, {
      headers: authHeaders
    });

    console.log('✅ Assignment status updated successfully:', response.data);
      return response.data;
  } catch (error: any) {
    console.error('❌ Failed to update assignment status:', error);
    throw error;
  }
};

// Trip start/end functions are handled in carDriverService.ts with correct endpoints
// /api/assignments/driver/start-trip/{orderId} and /api/assignments/driver/end-trip/{orderId}

export const assignCarDriverToOrder = async (orderId: string | number, driverId: string, carId: string): Promise<any> => {
  try {
    console.log('🔗 Assigning car and driver to order:', { orderId, driverId, carId });
    const authHeaders = await getAuthHeaders();
    
    const payload = {
      driver_id: driverId,
      car_id: carId
    };
    
    const response = await axiosInstance.patch(`/api/assignments/${orderId}/assign-car-driver`, payload, {
      headers: authHeaders
    });
    
    console.log('✅ Car and driver assigned successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ Failed to assign car and driver:', {
      message: error?.message,
      status: error?.response?.status,
      data: error?.response?.data,
    });
    throw error;
  }
};
