import { Ionicons } from '@expo/vector-icons';
import type { DrawerContentComponentProps } from '@react-navigation/drawer';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTheme } from '../../src/theme';

interface Conversation {
  id: string;
  title: string;
  timestamp: string;
}

export default function DrawerContent({
  navigation,
}: DrawerContentComponentProps) {
  const router = useRouter();
  const { colors } = useTheme();
  const [searchText, setSearchText] = useState('');
  const [conversations] = useState<Conversation[]>([
    { id: '1', title: 'サポート問い合わせ方法', timestamp: '今日' },
    { id: '2', title: 'md2sb ツールの紹介', timestamp: '今日' },
    { id: '3', title: 'Vercel AI SDK v5更新', timestamp: '昨日' },
    { id: '4', title: 'Claude Code 背景実行', timestamp: '昨日' },
  ]);

  const user = { name: 'Daiki Teramoto', email: '個人アカウント' };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View
        style={[styles.searchContainer, { backgroundColor: colors.inputBg }]}
      >
        <Ionicons
          name='search'
          size={20}
          color={colors.muted}
          style={styles.searchIcon}
        />
        <TextInput
          style={[styles.searchInput, { color: colors.text }]}
          placeholder='検索'
          placeholderTextColor={colors.muted}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.newChatButton}>
          <Ionicons name='create-outline' size={20} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.conversationsContainer}>
        {conversations.map((conversation) => (
          <TouchableOpacity
            key={conversation.id}
            style={[
              styles.conversationItem,
              { borderBottomColor: colors.border },
            ]}
            onPress={() => {
              router.push('/chat');
              navigation.closeDrawer();
            }}
          >
            <Text style={[styles.conversationTitle, { color: colors.text }]}>
              {conversation.title}
            </Text>
            <Text
              style={[styles.conversationTimestamp, { color: colors.muted }]}
            >
              {conversation.timestamp}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={[styles.userSection, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.userInfo}>
          <View
            style={[styles.userAvatar, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.userAvatarText, { color: colors.text }]}>
              D
            </Text>
          </View>
          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.text }]}>
              {user.name}
            </Text>
            <Text style={[styles.userEmail, { color: colors.muted }]}>
              {user.email}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, color: '#fff', fontSize: 16, paddingVertical: 12 },
  newChatButton: { padding: 8 },
  conversationsContainer: { flex: 1, paddingHorizontal: 16 },
  conversationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  conversationTitle: { color: '#fff', fontSize: 16, marginBottom: 4 },
  conversationTimestamp: { color: '#666', fontSize: 12 },
  userSection: { borderTopWidth: 1, borderTopColor: '#1a1a1a', padding: 16 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userAvatarText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  userDetails: { flex: 1 },
  userName: { color: '#fff', fontSize: 16, fontWeight: '500' },
  userEmail: { color: '#666', fontSize: 14, marginTop: 2 },
});
