import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { Dimensions, Keyboard } from 'react-native';
import DrawerContent from './drawer-content';

export default function DrawerLayout() {
  const { width } = Dimensions.get('window');
  const DRAWER_WIDTH = Math.min(Math.round(width * 0.86), 360);

  return (
    <Drawer
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        overlayColor: 'transparent',
        swipeEnabled: true,
        swipeEdgeWidth: width, // anywhere swipe
        drawerStyle: { width: DRAWER_WIDTH, backgroundColor: '#000' },
        sceneContainerStyle: { backgroundColor: '#000' },
      }}
      drawerContent={(props) => <DrawerContent {...props} />}
      screenListeners={{
        drawerOpen: () => Keyboard.dismiss(),
      }}
    />
  );
}

