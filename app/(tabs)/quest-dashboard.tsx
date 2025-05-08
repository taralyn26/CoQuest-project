import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  FlatList,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Quest from '../../components/Quest';

const PURPLE = '#56018D';

const mockQuests = [
  { id: '1' },
  { id: '2' },
  { id: '3' },
  { id: '4' },
];

export default function QuestDashboard() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.title}>Quest Dashboard</Text>
        <View style={styles.iconGroup}>
          <Ionicons name="person-add" size={20} style={styles.icon} />
          <Ionicons name="ellipsis-horizontal" size={20} style={styles.icon} />
        </View>
      </View>

      <View style={styles.filterRow}>
        <Pressable style={styles.sortButton}>
          <Ionicons name="menu" size={16} />
          <Text style={styles.sortText}>Sort</Text>
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['All Quests', 'Upcoming', 'Friends Only', 'Vines', 'More'].map(label => (
            <Pressable key={label} style={styles.filterChip}>
              <Text style={styles.filterText}>{label}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={mockQuests}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 40 }}
        columnWrapperStyle={styles.questRow}
        renderItem={({ item }) => (
          <Pressable
            style={styles.questWrapper}
            onPress={() => router.push('/mockQuests/quest-detail-wilbur')}
          >
            <Quest />
          </Pressable>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatar: {
    fontSize: 20,
    marginRight: 12,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
  },
  iconGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  icon: {
    marginLeft: 12,
  },
  filterRow: {
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sortText: {
    marginLeft: 4,
    fontWeight: '500',
  },
  filterChip: {
    backgroundColor: '#EFEFEF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 8,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  questRow: {
    justifyContent: 'space-evenly',
    marginBottom: 16,
  },
  questWrapper: {
    flex: 1,
    alignItems: 'center',
  },
});




