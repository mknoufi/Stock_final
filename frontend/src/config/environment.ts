/**
 * Environment Configuration Manager
 * Handles dynamic backend URL configuration for different environments
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createLogger } from '../services/logging';

const log = createLogger('EnvironmentConfig');

const STORAGE_KEYS = {
  CONNECTION_INFO: 'connection_info',
  BACKEND_CONFIG: 'backend_config'
};

interface BackendConfig {
  backendUrl: string;
  apiTimeout: number;
  frontendPort: number;
  environment: 'development' | 'staging' | 'production' | 'lan';
  lastUpdated: string;
}

interface EnvironmentDetection {
  environment: BackendConfig['environment'];
  backendUrl: string;
  isSimulator: boolean;
  isExpoGo: boolean;
  networkInfo: {
    type: 'wifi' | 'cellular' | 'none' | 'unknown';
    isConnected: boolean;
  };
}

class EnvironmentConfig {
  private static instance: EnvironmentConfig;
  private currentConfig: BackendConfig | null = null;
  private configChangeListeners: ((config: BackendConfig) => void)[] = [];

  private constructor() {
    this.initializeConfig();
  }

  static getInstance(): EnvironmentConfig {
    if (!EnvironmentConfig.instance) {
      EnvironmentConfig.instance = new EnvironmentConfig();
    }
    return EnvironmentConfig.instance;
  }

  /**
   * Initialize configuration with environment detection
   */
  private async initializeConfig(): Promise<void> {
    try {
      // Load saved configuration
      const savedConfig = await this.loadSavedConfig();
      if (savedConfig) {
        this.currentConfig = savedConfig;
        log.info('Loaded saved configuration', savedConfig);
      }

      // Detect current environment
      const detection = await this.detectEnvironment();
      const config = await this.buildConfigFromDetection(detection);

      // Save and apply configuration
      await this.setConfig(config);
      log.info('Environment configuration initialized', config);
    } catch (error) {
      log.error('Failed to initialize environment config', error);
      // Use fallback configuration
      this.setFallbackConfig();
    }
  }

  /**
   * Detect current environment and network state
   */
  private async detectEnvironment(): Promise<EnvironmentDetection> {
    const environment: BackendConfig['environment'] = this.detectEnvironmentType();
    const backendUrl = await this.detectBackendUrl();
    
    // Safety check for platform properties
    const iosPlatform = Constants.platform?.ios as any;
    const isSimulator = Platform.OS === 'ios' && !iosPlatform?.model;
    const isExpoGo = Constants.appOwnership === 'expo' && !Constants.isDevice;
    
    // Basic network detection
    const networkInfo = {
      type: 'unknown' as const,
      isConnected: true // Will be updated by actual network state
    };

    return {
      environment,
      backendUrl,
      isSimulator,
      isExpoGo,
      networkInfo
    };
  }

  /**
   * Detect environment type
   */
  private detectEnvironmentType(): BackendConfig['environment'] {
    // Check explicit environment variable
    if (process.env.NODE_ENV) {
      const env = process.env.NODE_ENV.toLowerCase();
      if (env === 'production') return 'production';
      if (env === 'staging') return 'staging';
    }

    // Check if running in Expo Go
    if (Constants.appOwnership === 'expo' && !Constants.isDevice) {
      return 'development'; // Expo Go is development-like
    }

    // Check if running in simulator
    const iosPlatform = Constants.platform?.ios as any;
    if (Platform.OS === 'ios' && !iosPlatform?.model) {
      return 'development';
    }

    // Default to LAN for real devices
    return 'lan';
  }

  /**
   * Detect backend URL with fallback chain
   */
  private async detectBackendUrl(): Promise<string> {
    // 1. Environment override (highest priority)
    const envUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
    if (envUrl) {
      log.info('Using environment override for backend URL', envUrl);
      return envUrl;
    }

    // 2. Expo config override
    const expoConfigUrl = Constants.expoConfig?.extra?.backendUrl;
    if (expoConfigUrl && typeof expoConfigUrl === 'string') {
      log.info('Using Expo config override for backend URL', expoConfigUrl);
      return expoConfigUrl;
    }

    // 3. Try to load from backend_port.json
    try {
      const response = await fetch('http://localhost/backend_port.json');
      if (response.ok) {
        const portData = await response.json();
        if (portData.url) {
          log.info('Using backend URL from port file', portData.url);
          return portData.url;
        }
      }
    } catch (error) {
      log.debug('Could not load backend_port.json', error);
    }

    // 4. Try common development URLs
    const developmentUrls = [
      'http://localhost:8001',
      'http://127.0.0.1:8001',
      'http://192.168.1.2:8001',
      'http://10.0.2.2:8001'
    ];

    for (const url of developmentUrls) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);

        const response = await fetch(`${url}/api/health`, { 
          method: 'GET',
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          log.info('Found healthy backend at', url);
          return url;
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          log.debug(`Backend health check failed for ${url}`, error);
        }
      }
    }

    // 5. Default fallback
    const fallbackUrl = 'http://localhost:8001';
    log.warn('Using fallback backend URL', fallbackUrl);
    return fallbackUrl;
  }

  /**
   * Build configuration from environment detection
   */
  private async buildConfigFromDetection(detection: EnvironmentDetection): Promise<BackendConfig> {
    return {
      backendUrl: detection.backendUrl,
      apiTimeout: detection.isExpoGo ? 15000 : 30000, // Shorter timeout for Expo Go
      frontendPort: this.detectFrontendPort(detection),
      environment: detection.environment,
      lastUpdated: new Date().toISOString()
    };
  }

  /**
   * Detect appropriate frontend port
   */
  private detectFrontendPort(detection: EnvironmentDetection): number {
    if (detection.environment === 'production') {
      return 443; // HTTPS in production
    }
    
    if (detection.isExpoGo) {
      return 8081; // Default Expo Go port
    }
    
    if (detection.isSimulator) {
      return 19006; // Common simulator port
    }
    
    return 8081; // Default LAN port
  }

  /**
   * Load saved configuration
   */
  private async loadSavedConfig(): Promise<BackendConfig | null> {
    try {
      const configJson = await AsyncStorage.getItem(STORAGE_KEYS.BACKEND_CONFIG);
      if (configJson) {
        return JSON.parse(configJson);
      }
    } catch (error) {
      log.debug('Failed to load saved configuration', error);
    }
    return null;
  }

  /**
   * Save configuration to storage
   */
  private async saveConfig(config: BackendConfig): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.BACKEND_CONFIG, JSON.stringify(config));
      this.notifyConfigChange(config);
    } catch (error) {
      log.error('Failed to save configuration', error);
    }
  }

  /**
   * Set fallback configuration
   */
  private setFallbackConfig(): void {
    const fallbackConfig: BackendConfig = {
      backendUrl: 'http://localhost:8001',
      apiTimeout: 30000,
      frontendPort: 8081,
      environment: 'lan',
      lastUpdated: new Date().toISOString()
    };

    this.currentConfig = fallbackConfig;
    this.saveConfig(fallbackConfig);
  }

  /**
   * Set configuration and notify listeners
   */
  private async setConfig(config: BackendConfig): Promise<void> {
    this.currentConfig = config;
    await this.saveConfig(config);
  }

  /**
   * Get current configuration
   */
  public getConfig(): BackendConfig | null {
    return this.currentConfig;
  }

  /**
   * Update backend URL and re-detect
   */
  public async updateBackendUrl(): Promise<BackendConfig> {
    log.info('Updating backend URL configuration...');
    
    const detection = await this.detectEnvironment();
    const config = await this.buildConfigFromDetection(detection);
    
    await this.setConfig(config);
    return config;
  }

  /**
   * Add configuration change listener
   */
  public addConfigChangeListener(listener: (config: BackendConfig) => void): void {
    this.configChangeListeners.push(listener);
    
    if (this.currentConfig) {
      listener(this.currentConfig);
    }
  }

  /**
   * Remove configuration change listener
   */
  public removeConfigChangeListener(listener: (config: BackendConfig) => void): void {
    const index = this.configChangeListeners.indexOf(listener);
    if (index > -1) {
      this.configChangeListeners.splice(index, 1);
    }
  }

  /**
   * Notify configuration change listeners
   */
  private notifyConfigChange(config: BackendConfig): void {
    this.configChangeListeners.forEach(listener => {
      try {
        listener(config);
      } catch (error) {
        log.error('Error in config change listener', error);
      }
    });
  }
}

export default EnvironmentConfig;
export type { BackendConfig, EnvironmentDetection };