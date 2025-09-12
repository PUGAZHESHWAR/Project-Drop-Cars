import axiosInstance from '@/app/api/axiosInstance';
import { getAuthHeaders } from '@/services/authService';

export interface CarDetail {
  id: string;
  car_name: string;
  car_type: string;
  car_number: string;
  car_brand: string;
  car_model: string;
  car_year: number;
  organization_id: string;
  vehicle_owner_id: string;
  rc_front_img_url?: string;
  rc_back_img_url?: string;
  insurance_img_url?: string;
  fc_img_url?: string;
  car_img_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DriverDetail {
  id: string;
  full_name: string;
  primary_number: string;
  secondary_number?: string;
  address: string;
  aadhar_number: string;
  organization_id: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface VehicleOwnerDetails {
  id: string;
  full_name: string;
  primary_mobile: string;
  secondary_mobile?: string;
  wallet_balance: number;
  organization_id: string;
  address: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardData {
  user_info: VehicleOwnerDetails;
  cars: CarDetail[];
  drivers: DriverDetail[];
  summary: {
    total_cars: number;
    total_drivers: number;
    wallet_balance: number;
  };
}

export const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    console.log('Fetching dashboard data...');
    
    const authHeaders = await getAuthHeaders();
    console.log('🔐 Using JWT token:', authHeaders.Authorization?.substring(0, 20) + '...');

    // 1. Fetch vehicle owner details
    console.log('👤 Fetching vehicle owner details...');
    const ownerResponse = await axiosInstance.get('/api/users/vehicle-owner/me', {
      headers: authHeaders
    });

    if (!ownerResponse.data) {
      throw new Error('Failed to fetch vehicle owner details');
    }

    const ownerDetails: VehicleOwnerDetails = ownerResponse.data;
    console.log('✅ Vehicle owner details received:', ownerDetails);

    // 2. Fetch all cars for the vehicle owner (prioritize org endpoint, then available-cars fallback)
    let cars: CarDetail[] = [];
    try {
      console.log('🚗 Fetching all cars for vehicle owner...');
      
      const carEndpoints = [
        `/api/users/cardetails/organization/${ownerDetails.organization_id}`, // 200 OK in logs
        `/api/assignments/available-cars`, // fallback, 200 OK
        `/api/users/vehicle-owner/${ownerDetails.id}/cars`, // may be 404 depending on backend version
      ];
      
      for (const endpoint of carEndpoints) {
        try {
          console.log(`🔍 Trying car endpoint: ${endpoint}`);
          const carsResponse = await axiosInstance.get(endpoint, {
            headers: authHeaders
          });
          
          if (carsResponse.data && Array.isArray(carsResponse.data)) {
            cars = carsResponse.data;
            console.log(`✅ Cars fetched from ${endpoint}:`, cars.length, 'cars');
            break; // Use the first successful endpoint
          }
        } catch (endpointError: any) {
          console.log(`❌ Car endpoint ${endpoint} failed:`, endpointError.response?.status || endpointError.message);
          continue; // Try next endpoint
        }
      }
      
      if (cars.length === 0) {
        console.warn('⚠️ No cars found from any endpoint');
      }
    } catch (error) {
      console.error('❌ All car endpoints failed:', error);
    }

    // 3. Fetch all drivers for the vehicle owner (prioritize org endpoint, then available-drivers fallback)
    let drivers: DriverDetail[] = [];
    try {
      console.log('👤 Fetching all drivers for vehicle owner...');
      
      const driverEndpoints = [
        `/api/users/cardriver/organization/${ownerDetails.organization_id}`, // 200 OK in logs
        `/api/assignments/available-drivers`, // fallback, 200 OK
        `/api/users/vehicle-owner/${ownerDetails.id}/drivers`, // may be 404 depending on backend version
      ];
      
      for (const endpoint of driverEndpoints) {
        try {
          console.log(`🔍 Trying driver endpoint: ${endpoint}`);
          const driversResponse = await axiosInstance.get(endpoint, {
            headers: authHeaders
          });
          
          if (driversResponse.data && Array.isArray(driversResponse.data)) {
            drivers = driversResponse.data;
            console.log(`✅ Drivers fetched from ${endpoint}:`, drivers.length, 'drivers');
            break; // Use the first successful endpoint
          }
        } catch (endpointError: any) {
          console.log(`❌ Driver endpoint ${endpoint} failed:`, endpointError.response?.status || endpointError.message);
          continue; // Try next endpoint
        }
      }
      
      if (drivers.length === 0) {
        console.warn('⚠️ No drivers found from any endpoint');
      }
    } catch (error) {
      console.error('❌ All driver endpoints failed:', error);
    }

    const dashboardData: DashboardData = {
      user_info: ownerDetails,
      cars,
      drivers,
      summary: {
        total_cars: cars.length,
        total_drivers: drivers.length,
        wallet_balance: ownerDetails.wallet_balance
      }
    };

    console.log('Dashboard data assembled:', {
      user: dashboardData.user_info,
      carCount: dashboardData.cars.length,
      driverCount: dashboardData.drivers.length,
      walletBalance: dashboardData.user_info.wallet_balance
    });

    return dashboardData;

  } catch (error: any) {
    console.error('❌ Failed to fetch dashboard data:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(error.message || 'Failed to fetch dashboard data');
    }
  }
};

export const refreshDashboardData = async (): Promise<DashboardData> => {
  console.log('🔄 Refreshing dashboard data...');
  return fetchDashboardData();
};

/**
 * Force refresh dashboard data (useful after adding new cars/drivers)
 */
export const forceRefreshDashboardData = async (): Promise<DashboardData> => {
  console.log('🔄 Force refreshing dashboard data...');
  
  // Clear any cached data and fetch fresh data
  try {
    const freshData = await fetchDashboardData();
    console.log('✅ Dashboard data force refreshed successfully');
    return freshData;
  } catch (error) {
    console.error('❌ Force refresh failed:', error);
    throw error;
  }
};


// New function to fetch pending orders
export interface PendingOrder {
  order_id: number;
  vendor_id: string;
  trip_type: string;
  car_type: string;
  pickup_drop_location: {
    pickup: string;
    drop: string;
  };
  start_date_time: string;
  customer_name: string;
  customer_number: string;
  cost_per_km: number;
  extra_cost_per_km: number;
  driver_allowance: number;
  extra_driver_allowance: number;
  permit_charges: number;
  extra_permit_charges: number;
  hill_charges: number;
  toll_charges: number;
  pickup_notes?: string;
  trip_status: string;
  pick_near_city: string;
  trip_distance: number;
  trip_time: string;
  platform_fees_percent: number;
  created_at: string;
}

export const fetchPendingOrders = async (): Promise<PendingOrder[]> => {
  try {
    console.log('📋 Fetching pending orders...');
    
    const authHeaders = await getAuthHeaders();
    console.log('🔐 Using JWT token for pending orders:', authHeaders.Authorization?.substring(0, 20) + '...');
    // Fetch pending orders directly
    const response = await axiosInstance.get('/api/orders/pending-all', {
      headers: authHeaders
    });

    if (response.data) {
      console.log('✅ Pending orders fetched:', response.data.length, 'orders');
      // Filter by status: keep only truly pending orders
      const filtered = response.data.filter((order: any) => {
        const rawStatus = (order.trip_status || order.status || '').toString();
        const status = rawStatus.trim().toUpperCase();
        // Backend status set includes: COMPLETED, ACCEPTED, IN_PROGRESS, PENDING
        // We only show PENDING here
        const isPending = status === 'PENDING';
        if (!isPending) {
          // Omit ACCEPTED / IN_PROGRESS / COMPLETED from pending list
          return false;
        }
        return true;
      });
      console.log('✅ Filtered pending orders:', filtered.length);
      return filtered;
    }

    return [];
  } catch (error: any) {
    console.error('❌ Failed to fetch pending orders:', error);
    
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please login again.');
    } else if (error.response?.status === 500) {
      throw new Error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    } else if (error.code === 'ERR_NETWORK') {
      throw new Error('Network error. Please check your internet connection.');
    } else {
      throw new Error(error.message || 'Failed to fetch pending orders');
    }
  }
};
