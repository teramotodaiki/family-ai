import { renderHook } from '@testing-library/react-native';
import { useTheme } from './theme';

jest.mock('react-native/Libraries/Utilities/useColorScheme', () => ({
  default: jest.fn(),
}));

describe('useTheme', () => {
  it('should return dark theme when color scheme is dark', () => {
    const { useColorScheme } = require('react-native');
    useColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
    expect(result.current.colors.background).toBe('#000');
    expect(result.current.colors.text).toBe('#fff');
    expect(result.current.colors.accent).toBe('#fff');
  });

  it('should return light theme when color scheme is light', () => {
    const { useColorScheme } = require('react-native');
    useColorScheme.mockReturnValue('light');

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
    expect(result.current.colors.background).toBe('#fff');
    expect(result.current.colors.text).toBe('#111');
    expect(result.current.colors.accent).toBe('#000');
  });

  it('should return light theme when color scheme is null', () => {
    const { useColorScheme } = require('react-native');
    useColorScheme.mockReturnValue(null);

    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
    expect(result.current.colors.background).toBe('#fff');
  });

  it('should have all required color properties', () => {
    const { useColorScheme } = require('react-native');
    useColorScheme.mockReturnValue('dark');

    const { result } = renderHook(() => useTheme());

    const requiredColors = [
      'background',
      'surface',
      'border',
      'text',
      'muted',
      'inputBg',
      'accent',
      'bubbleUserBg',
      'bubbleAiBg',
      'headerTint',
    ];

    requiredColors.forEach((color) => {
      expect(result.current.colors).toHaveProperty(color);
      expect(
        typeof result.current.colors[
          color as keyof typeof result.current.colors
        ]
      ).toBe('string');
    });
  });
});
