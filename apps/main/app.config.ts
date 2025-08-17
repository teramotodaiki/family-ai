import type { ExpoConfig } from '@expo/config';

const config: ExpoConfig = {
  name: 'main',
  scheme: 'familyai',
  slug: 'main',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  // Dev Client では New Architecture を有効化（worklets/TurboModules 用）
  newArchEnabled: true,
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff'
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.familyai.main',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: 'com.familyai.main',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff'
    },
    edgeToEdgeEnabled: true
  },
  web: {
    favicon: './assets/favicon.png'
  },
  extra: {
    eas: {
      projectId: 'b7e6d4fd-fdd5-4b4b-9d6e-fa483887dee5'
    }
  },
  experiments: { typedRoutes: true },
  plugins: ['expo-router']
};

export default config;
