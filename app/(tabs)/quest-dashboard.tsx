import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useMemo } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const PURPLE = '#56018D';

const mockQuests = [
  {
    id: '1',
    title: 'Wilbur Dinner',
    time: 'Now–8:00pm',
    host: 'Jad Bitar',
    image: require('../../assets/images/Wilbur-Dining-Hall.webp'),
    route: '/mockQuests/quest-detail-wilbur',
  },
  {
    id: '2',
    title: 'Library Cram Session',
    time: 'Saturday 10:30am',
    host: 'You',
    image: require('../../assets/images/Stanford_University_Green_Library_Bing_Wing.jpg'),
    route: '/mockQuests/quest-detail-library',
  },
  {
    id: '3',
    title: 'Mall Run',
    time: 'Thursday 10:30am',
    host: 'Aya',
    image: require('../../assets/images/aritzia.png'),
    route: '/mockQuests/quest-detail-mall',
  },
  {
    id: '4',
    title: 'Oval Chill',
    time: 'Thursday 2:00pm',
    host: 'Isaias',
    image: require('../../assets/images/oval.jpg'),
    route: '/mockQuests/quest-detail-oval',
  },
  {
    id: '5',
    title: 'Fountain Hop 🌀',
    time: 'Friday 7:00pm',
    host: 'Isaias',
    image: require('../../assets/images/fountain-hop.jpeg'),
    route: '/mockQuests/quest-detail-fountain',
  },
  {
    id: '6',
    title: 'Tennis Hitaround 🎾',
    time: 'Sunday 4:00pm',
    host: 'Taralyn',
    image: require('../../assets/images/tennis.jpg'),
    route: '/mockQuests/quest-detail-tennis',
  },
  {
    id: '7',
    title: 'Pickup Soccer ⚽️',
    time: 'Saturday 5:30pm',
    host: 'Emi',
    image: require('../../assets/images/soccer.avif'),
    route: '/mockQuests/quest-detail-soccer',
  },
  {
    id: '8',
    title: 'S’mores & Chill 🔥',
    time: 'Thursday 8:00pm',
    host: 'Aya',
    image: require('../../assets/images/smores.jpg'),
    route: '/mockQuests/quest-detail-smores',
  },
];

// Define which quests belong to which filters
const questTags = {
  '1': ['All Quests', 'Happening Now'],
  '2': ['All Quests'],
  '3': ['All Quests'],
  '4': ['All Quests'],
  '5': ['All Quests', 'Sports'],
  '6': ['All Quests', 'Sports'],
  '7': ['All Quests', 'Sports'],
  '8': ['All Quests'],
};

const availableFilters = ['All Quests', 'Happening Now', 'Sports', 'Within 1 mile'];

export default function QuestDashboard() {
  const router = useRouter();
  const [selectedFilters, setSelectedFilters] = useState<string[]>(['All Quests']);

  const toggleFilter = (filter: string) => {
    setSelectedFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev.filter(f => f !== 'All Quests'), filter]
    );
  };

  const filteredQuests = useMemo(() => {
    if (selectedFilters.includes('All Quests')) return mockQuests;
    return mockQuests.filter((quest) =>
      selectedFilters.every((filter) => questTags[quest.id]?.includes(filter))
    );
  }, [selectedFilters]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.title}>Quest Dashboard</Text>
        <View style={styles.iconGroup}>
        </View>
      </View>

      <View style={styles.filterRow}>
        <Pressable style={styles.sortButton}>
          <Ionicons name="menu" size={16} />
          <Text style={styles.sortText}>Sort</Text>
        </Pressable>

        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {availableFilters.map((label) => {
            const isSelected = selectedFilters.includes(label);
            return (
              <Pressable
                key={label}
                onPress={() => toggleFilter(label)}
                style={[
                  styles.filterChip,
                  isSelected && { backgroundColor: PURPLE },
                ]}
              >
                <Text style={[styles.filterText, isSelected && { color: '#FFF' }]}>
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <FlatList
        data={filteredQuests}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 40 }}
        columnWrapperStyle={styles.questRow}
        renderItem={({ item }) => (
          <Pressable
            style={styles.questWrapper}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
                <View style={styles.timeTag}>
                  <Text style={styles.timeText}>{item.time}</Text>
                </View>
              </View>
              <Text style={styles.questTitle}>{item.title}</Text>
              <Text style={styles.hostText}>👑 {item.host} hosting</Text>
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
  card: {
    width: 160,
  },
  imageContainer: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 6,
  },
  image: {
    width: 160,
    height: 120,
    resizeMode: 'cover',
  },
  timeTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#3366FF',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  timeText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  questTitle: {
    fontWeight: '600',
    fontSize: 16,
  },
  hostText: {
    fontSize: 12,
    color: '#888',
  },
});