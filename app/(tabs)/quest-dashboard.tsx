import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.avatar}>👤</Text>
        <Text style={styles.title}>Quest Dashboard</Text>
        <View style={styles.iconGroup}></View>
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
        data={Array(8).fill(null)} // Render 8 quest components
        keyExtractor={(_, index) => index.toString()}
        numColumns={2}
        columnWrapperStyle={styles.questRow}
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}
        renderItem={() => <Quest />}
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
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});
