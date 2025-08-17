import { Drawer } from 'expo-router/drawer';
import { Dimensions, Keyboard } from 'react-native';
import { useTheme } from '../../src/theme';
import DrawerContent from './drawer-content';

export default function DrawerLayout() {
  const { width } = Dimensions.get('window');
  const DRAWER_WIDTH = Math.min(Math.round(width * 0.86), 360);
  const { colors } = useTheme();

  return (
    <Drawer
      id='drawer'
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'transparent',
        swipeEnabled: true,
        swipeEdgeWidth: width, // anywhere swipe
        drawerStyle: {
          width: DRAWER_WIDTH,
          backgroundColor: colors.background,
        },
        sceneContainerStyle: { backgroundColor: colors.background },
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
      screenListeners={{
        drawerOpen: () => Keyboard.dismiss(),
      }}
    />
  );
}
