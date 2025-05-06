// app/(tabs)/quest-dashboard.tsx
import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PURPLE = '#56018D';

const mockQuests = [
  {
    id: '1',
    title: 'Library Cram Session',
    badge: 'Saturday 10:30am',
    hostName: 'You',
    location: '660 Stanford Shopping Center, Palo Alto',
    route: '/mockQuests/quest-detail-library',
    hosts: ['👩🏻‍🦰'],
  },
  {
    id: '2',
    title: 'Wilbur Dinner',
    badge: 'Happening Now',
    hostName: 'Wilbur crew',
    location: 'Wilbur Dining',
    route: '/mockQuests/quest-detail-wilbur',
    hosts: ['🧑🏽', '👩🏼', '👨🏿‍🦱'],
  },
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

      {/* Filter Bar */}
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

      {/* Quest Grid */}
      <FlatList
        data={mockQuests}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.questGrid}
        renderItem={({ item }) => (
          <Pressable style={styles.card} onPress={() => router.push(item.route)}>
            <View style={styles.badgeBox}>
              <Text style={styles.badgeText}>{item.badge}</Text>
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
            <Text style={styles.cardSub}>Hosted by</Text>
            <View style={styles.hosts}>
              {item.hosts.map((h, i) => (
                <Text key={i} style={styles.hostEmoji}>
                  {h}
                </Text>
              ))}
            </View>
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
    paddingHorizontal: 16,
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
  questGrid: {
    paddingHorizontal: 12,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 12,
    margin: 6,
    maxWidth: '48%',
    borderWidth: 1,
    borderColor: '#DDD',
  },
  badgeBox: {
    backgroundColor: PURPLE,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginBottom: 8,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  cardSub: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  hosts: {
    flexDirection: 'row',
    marginTop: 4,
    gap: 6,
  },
  hostEmoji: {
    fontSize: 18,
  },
});
