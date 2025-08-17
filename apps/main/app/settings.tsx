import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Stack } from 'expo-router';

interface SettingItem {
  id: string;
  icon: string;
  title: string;
  value?: string;
  hasArrow?: boolean;
  hasSwitch?: boolean;
  switchValue?: boolean;
}

export default function SettingsScreen() {
  const [voiceEnabled, setVoiceEnabled] = useState(true);

  const accountSettings: SettingItem[] = [
    {
      id: 'email',
      icon: 'mail',
      title: 'メール',
      value: 'i10123@gmail.com',
      hasArrow: true,
    },
    {
      id: 'phone',
      icon: 'call',
      title: '電話番号',
      value: '+818042592017',
      hasArrow: true,
    },
    {
      id: 'workspace',
      icon: 'person',
      title: 'ワークスペース',
      value: '個人アカウント',
      hasArrow: true,
    },
    {
      id: 'subscription',
      icon: 'add-circle',
      title: 'サブスクリプション',
      value: 'ChatGPT Plus',
      hasArrow: false,
    },
  ];

  const appSettings: SettingItem[] = [
    {
      id: 'personalize',
      icon: 'person-circle',
      title: 'パーソナライズ',
      hasArrow: true,
    },
    {
      id: 'notifications',
      icon: 'notifications',
      title: '通知',
      hasArrow: true,
    },
    {
      id: 'data',
      icon: 'folder',
      title: 'データ コントロール',
      hasArrow: true,
    },
    {
      id: 'archive',
      icon: 'archive',
      title: 'アーカイブ済みのチャット',
      hasArrow: true,
    },
    { id: 'security', icon: 'shield', title: 'セキュリティ', hasArrow: true },
  ];

  const otherSettings: SettingItem[] = [
    {
      id: 'language',
      icon: 'globe',
      title: 'アプリの言語',
      value: '日本語',
      hasArrow: true,
    },
    {
      id: 'voice',
      icon: 'mic',
      title: '音声入力で自動送信する',
      hasSwitch: true,
      switchValue: voiceEnabled,
    },
    {
      id: 'appearance',
      icon: 'moon',
      title: '外観',
      value: 'システム',
      hasArrow: true,
    },
  ];

  const renderSettingItem = (
    item: SettingItem,
    onSwitchChange?: (value: boolean) => void
  ) => (
    <TouchableOpacity key={item.id} style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <Ionicons
          name={item.icon}
          size={24}
          color='#666'
          style={styles.settingIcon}
        />
        <Text style={styles.settingTitle}>{item.title}</Text>
      </View>
      <View style={styles.settingItemRight}>
        {item.value && <Text style={styles.settingValue}>{item.value}</Text>}
        {item.hasArrow && (
          <Ionicons name='chevron-forward' size={20} color='#666' />
        )}
        {item.hasSwitch && (
          <Switch
            value={item.switchValue}
            onValueChange={onSwitchChange}
            trackColor={{ false: '#333', true: '#007AFF' }}
            thumbColor='#fff'
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: '設定',
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity>
              <Ionicons name='close' size={24} color='#fff' />
            </TouchableOpacity>
          ),
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アカウント</Text>
          {accountSettings.map((item) => renderSettingItem(item))}

          <TouchableOpacity style={styles.upgradeButton}>
            <Ionicons name='shield-checkmark' size={20} color='#fff' />
            <Text style={styles.upgradeText}>ChatGPT Pro にアップグレード</Text>
            <Text style={styles.upgradeSubtext}>しましょう</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemLeft}>
              <Ionicons
                name='refresh'
                size={24}
                color='#666'
                style={styles.settingIcon}
              />
              <Text style={styles.settingTitle}>購入内容を復元する</Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          {appSettings.map((item) => renderSettingItem(item))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>アプリ</Text>
          {otherSettings.map((item) =>
            renderSettingItem(
              item,
              item.id === 'voice' ? setVoiceEnabled : undefined
            )
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 16,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0a0a0a',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 16,
    width: 24,
  },
  settingTitle: {
    color: '#fff',
    fontSize: 16,
  },
  settingValue: {
    color: '#666',
    fontSize: 16,
    marginRight: 8,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  upgradeText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  upgradeSubtext: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 4,
  },
});
