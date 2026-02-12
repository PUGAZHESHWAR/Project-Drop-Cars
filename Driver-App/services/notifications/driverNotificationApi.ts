import axiosDriver from '@/app/api/axiosDriver';

export interface NotificationResponse {
  sub: string;
  permission1: boolean;
  permission2: boolean;
  token: string;
}

export async function getDriverNotificationSettings(): Promise<NotificationResponse | null> {
  try {
    const response = await axiosDriver.get('/api/notifications/');
    return response.data as NotificationResponse;
  } catch (error: any) {
    if (error?.response?.status === 404) return null;
    throw error;
  }
}

export async function upsertDriverNotificationSettings(payload: { 
  permission1: boolean; 
  permission2: boolean; 
  token: string 
}): Promise<NotificationResponse> {
  const response = await axiosDriver.post('/api/notifications/', payload);
  return response.data as NotificationResponse;
}

export async function updateDriverNotificationPermissions(payload: { 
  permission1?: boolean; 
  permission2?: boolean 
}): Promise<NotificationResponse> {
  // For drivers, use POST to the main endpoint since PATCH might not be supported
  // We need to get the current token first, then update with new permissions
  try {
    // First, get current settings to preserve the token
    const currentSettings = await getDriverNotificationSettings();
    const token = currentSettings?.token || '';
    
    // Update with new permissions and existing token
    const updatePayload = {
      permission1: payload.permission1 ?? currentSettings?.permission1 ?? true,
      permission2: payload.permission2 ?? currentSettings?.permission2 ?? true,
      token: token
    };
    
    console.log('🔄 Updating driver notification permissions:', updatePayload);
    const response = await axiosDriver.post('/api/notifications/', updatePayload);
    return response.data as NotificationResponse;
  } catch (error: any) {
    console.error('❌ Failed to update driver notification permissions:', error);
    throw error;
  }
}
