import { useColorScheme } from 'react-native';

export type Theme = 'light' | 'dark';

export type Colors = {
  background: string;
  surface: string;
  border: string;
  text: string;
  muted: string;
  inputBg: string;
  accent: string;
  bubbleUserBg: string;
  bubbleAiBg: string;
  headerTint: string;
};

export function useTheme(): { theme: Theme; colors: Colors } {
  const scheme = useColorScheme();
  const theme: Theme = scheme === 'dark' ? 'dark' : 'light';

  const colors: Colors =
    theme === 'dark'
      ? {
          background: '#000',
          surface: '#0f0f0f',
          border: '#1a1a1a',
          text: '#fff',
          muted: '#888',
          inputBg: '#1a1a1a',
          accent: '#fff',
          bubbleUserBg: '#1a1a1a',
          bubbleAiBg: '#0f0f0f',
          headerTint: '#fff',
        }
      : {
          background: '#fff',
          surface: '#f5f5f5',
          border: '#e5e5e5',
          text: '#111',
          muted: '#666',
          inputBg: '#f0f0f0',
          accent: '#000',
          bubbleUserBg: '#e6e6e6',
          bubbleAiBg: '#f0f0f0',
          headerTint: '#000',
        };

  return { theme, colors };
}
