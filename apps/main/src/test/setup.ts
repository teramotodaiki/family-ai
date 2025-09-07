import '@testing-library/jest-native/extend-expect';

process.env.EXPO_PUBLIC_API_BASE_URL = 'http://localhost:3000';

Object.defineProperty(globalThis, 'fetch', {
  value: jest.fn(),
  writable: true,
});

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: jest.fn(() => 'dark'),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 44, bottom: 34, left: 0, right: 0 }),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    getParent: jest.fn(() => ({
      dispatch: jest.fn(),
    })),
    dispatch: jest.fn(),
  }),
  DrawerActions: {
    openDrawer: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  Stack: {
    Screen: ({ children }: { children: React.ReactNode }) => children,
  },
}));

jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
  MaterialIcons: 'MaterialIcons',
}));

jest.mock('expo-font', () => ({
  loadAsync: jest.fn(),
  isLoaded: jest.fn(() => true),
}));

jest.mock('expo', () => ({
  env: process.env,
}));

jest.mock('expo/virtual/env', () => ({
  env: process.env,
}));
