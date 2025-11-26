// Environment Configuration
export const ENV = {
  // Development environment
  development: {
    API_BASE_URL: 'https://drop-cars-api-1049299844333.asia-south2.run.app',
    // API_BASE_URL: 'http://192.168.1.11:8000',
    // API_BASE_URL: 'http://172.20.10.7:8000',
    DEBUG: true,
    LOG_LEVEL: 'debug',
  },
  
  // Production environment
  // 34.126.222.137
  production: {
    API_BASE_URL: 'https://drop-cars-api-1049299844333.asia-south2.run.app', // Update this
    DEBUG: false,
    LOG_LEVEL: 'error',
  },
  
  // Staging environment
  staging: {
    API_BASE_URL: 'https://drop-cars-api-1049299844333.asia-south2.run.app', // Update this
    DEBUG: true,
    LOG_LEVEL: 'info',
  },
};

// Get current environment (default to development)
const getCurrentEnv = () => {
  // You can set this via environment variable or build configuration
  return process.env.NODE_ENV || 'development';
};

// Export current environment config
export const currentEnv = ENV[getCurrentEnv() as keyof typeof ENV];

// Helper function to get API base URL for current environment
export const getCurrentApiBaseUrl = (): string => {
  return currentEnv.API_BASE_URL;
};

// Helper function to check if in debug mode
export const isDebugMode = (): boolean => {
  return currentEnv.DEBUG;
};

// Helper function to get log level
export const getLogLevel = (): string => {
  return currentEnv.LOG_LEVEL;
};
