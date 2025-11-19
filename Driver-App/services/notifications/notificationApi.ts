import axiosInstance from '@/app/api/axiosInstance';
import { authService } from '@/services/auth/authService';

export interface NotificationResponse {
  sub: string;
  permission1: boolean;
  permission2: boolean;
  token: string;
}

export async function getNotificationSettings(): Promise<NotificationResponse | null> {
  try {
    const headers = await authService.getAuthHeaders();
    const res = await axiosInstance.get('/api/notifications/', { headers });
    return res.data as NotificationResponse;
  } catch (e: any) {
    if (e?.response?.status === 404) return null;
    throw e;
  }
}

export async function upsertNotificationSettings(payload: { permission1: boolean; permission2: boolean; token: string }): Promise<NotificationResponse> {
  const headers = await authService.getAuthHeaders();
  const res = await axiosInstance.post('/api/notifications/', payload, { headers });
  return res.data as NotificationResponse;
}

export async function updateNotificationPermissions(payload: { permission1?: boolean; permission2?: boolean }): Promise<NotificationResponse> {
  const headers = await authService.getAuthHeaders();
  const res = await axiosInstance.patch('/api/notifications/permissions/', payload, { headers });
  return res.data as NotificationResponse;
}
