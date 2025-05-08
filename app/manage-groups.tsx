import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const PURPLE = '#56018D';

const mockGroups = [
  {
    name: 'Stanford Community 🌲',
    members: ['Aya', 'Isa', '+1900'],
  },
  {
    name: 'Study Buddies',
    members: ['Isaias', 'Jad', 'Aya'],
  },
  {
    name: 'party people',
    members: ['Emi', 'Varsha', '+5'],
  },
  {
    name: 'All Friends',
    members: ['Nico', 'Yujina', '+50'],
  },
];

export default function ManageGroups() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (name: string) => {
    setExpanded(expanded === name ? null : name);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.header}>Make / Manage Groups</Text>
      </View>

      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.push('/create_group')}
      >
        <Text style={styles.createText}>Create New Group</Text>
      </TouchableOpacity>

      {mockGroups.map((group, idx) => {
        const isExpanded = expanded === group.name;
        return (
          <View key={idx} style={styles.card}>
            <TouchableOpacity
              onPress={() => toggleExpand(group.name)}
              style={styles.cardHeader}
            >
              <View style={styles.titleRow}>
                <Text style={styles.groupName}>{group.name}</Text>
                {isExpanded && (
                  <Pressable style={styles.editButton}>
                    <Ionicons name="create-outline" size={18} color="black" />
                  </Pressable>
                )}
              </View>
              <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {isExpanded && (
              <View style={styles.cardBody}>
                <Text style={styles.memberCount}>{group.members.length} members</Text>
                <View style={styles.memberRow}>
                  {group.members.map((m, i) => (
                    <View key={i} style={styles.chip}>
                      <Text style={styles.chipText}>{m}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  createButton: {
    backgroundColor: PURPLE,
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: 'center',
    marginBottom: 20,
  },
  createText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
  },
  editButton: {
    padding: 2,
  },
  arrow: {
    fontSize: 20,
  },
  memberCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 6,
    marginBottom: 6,
  },
  cardBody: {
    marginTop: 10,
  },
  memberRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    color: '#333',
  },
});





