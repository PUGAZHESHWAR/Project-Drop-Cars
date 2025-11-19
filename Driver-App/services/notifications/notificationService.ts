import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as SecureStore from 'expo-secure-store';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationData {
  title: string;
  body: string;
  data?: any;
  sound?: boolean;
  priority?: 'default' | 'normal' | 'high';
}

export interface OrderNotificationData {
  orderId: string;
  pickup: string;
  drop: string;
  customerName: string;
  customerMobile: string;
  distance: number;
  fare: number;
  orderType: 'new' | 'assigned' | 'completed' | 'cancelled';
}

class NotificationService {
  private static instance: NotificationService;
  private expoPushToken: string | null = null;

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Initialize notification service
  async initialize(): Promise<void> {
    try {
      console.log('🔔 Initializing notification service...');

      // Request permissions
      await this.requestPermissions();
      
      // Get push tokens (Expo will work even if Firebase fails)
      await this.getPushToken();

      // Set up notification listeners
      this.setupNotificationListeners();

      console.log('✅ Notification service initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize notification service:', error);
    }
  }

  // Request notification permissions
  private async requestPermissions(): Promise<void> {
    try {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        if (finalStatus !== 'granted') {
          console.warn('⚠️ Notification permissions not granted');
          return;
        }
        
        console.log('✅ Notification permissions granted');
      } else {
        console.log('📱 Running on simulator, skipping permission request');
      }
    } catch (error) {
      console.error('❌ Error requesting notification permissions:', error);
    }
  }

  // Get Expo push token
  private async getPushToken(): Promise<void> {
    try {
      if (Device.isDevice) {
        console.log('🔍 Requesting Expo push token...');
        const token = await Notifications.getExpoPushTokenAsync();
        
        this.expoPushToken = token.data;
        console.log('📱 ===== EXPO PUSH TOKEN =====');
        console.log('📱 Token:', this.expoPushToken);
        console.log('📱 ============================');
        
        // Store token securely
        await SecureStore.setItemAsync('expoPushToken', this.expoPushToken);

        // Persist to backend notification table if available
        try {
          const { upsertNotificationSettings } = await import('./notificationApi');
          // Default permissions to true on first registration; backend will upsert
          await upsertNotificationSettings({ permission1: true, permission2: true, token: this.expoPushToken });
          console.log('✅ Expo token saved to notifications API');
        } catch (e: any) {
          const msg = (e && typeof e === 'object' && 'message' in e) ? (e as any).message : String(e);
          console.warn('⚠️ Could not upsert notifications settings (non-blocking):', msg);
        }
      } else {
        console.log('📱 Running on simulator, skipping Expo push token');
      }
    } catch (error) {
      console.error('❌ Error getting push token:', error);
    }
  }

  // Set up notification listeners
  private setupNotificationListeners(): void {
    // Handle notification received while app is in foreground
    Notifications.addNotificationReceivedListener((notification) => {
      console.log('📱 Notification received in foreground:', notification);
      this.handleNotificationReceived(notification);
    });

    // Handle notification response (when user taps notification)
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('👆 Notification response received:', response);
      this.handleNotificationResponse(response);
    });
  }

  // Handle notification received
  private handleNotificationReceived(notification: Notifications.Notification): void {
    const { title, body, data } = notification.request.content;
    console.log('📱 Notification received:', { title, body, data });
    
    // You can add custom logic here for handling notifications
    // For example, updating UI, playing sounds, etc.
  }

  // Handle notification response (user tap)
  private handleNotificationResponse(response: Notifications.NotificationResponse): void {
    const { title, body, data } = response.notification.request.content;
    console.log('👆 Notification tapped:', { title, body, data });
    
    // Handle navigation or other actions based on notification data
    if (data?.orderId) {
      // Navigate to order details or take appropriate action
      console.log('🚗 Navigating to order:', data.orderId);
    }
  }

  // Firebase handling removed while backend notifications are not implemented

  // Send local notification
  async sendLocalNotification(notification: NotificationData): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: notification.sound !== false,
          priority: notification.priority || 'high',
        },
        trigger: null, // Send immediately
      });
      
      console.log('✅ Local notification sent:', notification.title);
    } catch (error) {
      console.error('❌ Failed to send local notification:', error);
    }
  }

  // Send new order notification
  async sendNewOrderNotification(orderData: OrderNotificationData): Promise<void> {
    try {
      const notification: NotificationData = {
        title: '🚗 New Order Available!',
        body: `From ${orderData.pickup} to ${orderData.drop} • ₹${orderData.fare}`,
        data: orderData,
        sound: true,
        priority: 'high',
      };
      
      await this.sendLocalNotification(notification);
      console.log('✅ New order notification sent for order:', orderData.orderId);
    } catch (error) {
      console.error('❌ Failed to send new order notification:', error);
    }
  }

  // Send order assigned notification
  async sendOrderAssignedNotification(orderData: OrderNotificationData): Promise<void> {
    try {
      const notification: NotificationData = {
        title: '✅ Order Assigned!',
        body: `You have been assigned to ${orderData.customerName}'s trip`,
        data: orderData,
        sound: true,
        priority: 'normal',
      };
      
      await this.sendLocalNotification(notification);
      console.log('✅ Order assigned notification sent for order:', orderData.orderId);
    } catch (error) {
      console.error('❌ Failed to send order assigned notification:', error);
    }
  }

  // Send order completed notification
  async sendOrderCompletedNotification(orderData: OrderNotificationData): Promise<void> {
    try {
      const notification: NotificationData = {
        title: '🎉 Trip Completed!',
        body: `You've earned ₹${orderData.fare} for this trip`,
        data: orderData,
        sound: true,
        priority: 'normal',
      };
      
      await this.sendLocalNotification(notification);
      console.log('✅ Order completed notification sent for order:', orderData.orderId);
    } catch (error) {
      console.error('❌ Failed to send order completed notification:', error);
    }
  }

  // Get stored push token
  async getStoredPushToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('expoPushToken');
    } catch (error) {
      console.error('❌ Error getting stored push token:', error);
      return null;
    }
  }

  // Debug method to print all tokens
  async printAllTokens(): Promise<void> {
    try {
      console.log('🔍 ===== DEBUGGING TOKENS =====');
      
      // Get stored tokens
      const storedExpoToken = await this.getStoredPushToken();
      
      console.log('📱 Stored Expo Token:', storedExpoToken);
      
      console.log('🔍 ============================');
    } catch (error) {
      console.error('❌ Error printing tokens:', error);
    }
  }

  // Manual method to force token retrieval
  async forceTokenRetrieval(): Promise<void> {
    try {
      console.log('🔄 Force retrieving tokens...');
      
      // Force get Expo token (this should work)
      await this.getPushToken();
      // Print all tokens
      await this.printAllTokens();
      
      console.log('✅ Force token retrieval completed');
    } catch (error) {
      console.error('❌ Error in force token retrieval:', error);
    }
  }

  // Simple method to get just Expo token (fallback)
  async getExpoTokenOnly(): Promise<string | null> {
    try {
      if (Device.isDevice) {
        console.log('🔍 Getting Expo push token only...');
        const token = await Notifications.getExpoPushTokenAsync();
        
        this.expoPushToken = token.data;
        console.log('📱 ===== EXPO PUSH TOKEN ONLY =====');
        console.log('📱 Token:', this.expoPushToken);
        console.log('📱 =================================');
        
        return this.expoPushToken;
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting Expo token:', error);
      return null;
    }
  }

  // Clear all notifications
  async clearAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
      console.log('✅ All notifications cleared');
    } catch (error) {
      console.error('❌ Failed to clear notifications:', error);
    }
  }

  // Get notification permissions status
  async getPermissionsStatus(): Promise<Notifications.NotificationPermissionsStatus> {
    try {
      return await Notifications.getPermissionsAsync();
    } catch (error) {
      console.error('❌ Error getting permissions status:', error);
      // Return a fallback object with a valid PermissionStatus type
      return { status: 'undetermined', granted: false, expires: 'never' } as Notifications.NotificationPermissionsStatus;
    }
  }

  // Check if notifications are enabled
  async areNotificationsEnabled(): Promise<boolean> {
    try {
      const status = await this.getPermissionsStatus();
      return status.granted;
    } catch (error) {
      console.error('❌ Error checking notification status:', error);
      return false;
    }
  }
}

// Export singleton instance
export const notificationService = NotificationService.getInstance();
