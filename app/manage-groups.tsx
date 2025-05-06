// app/manage-groups.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const mockGroups = [
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

      <TouchableOpacity style={styles.createButton}>
        <Text style={styles.createText}>Create New Group</Text>
      </TouchableOpacity>

      {mockGroups.map((group, idx) => (
        <View key={idx} style={styles.card}>
          <TouchableOpacity
            onPress={() => toggleExpand(group.name)}
            style={styles.cardHeader}
          >
            <View>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.memberCount}>{group.members.length} members</Text>
            </View>
            <Ionicons
              name={expanded === group.name ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="black"
            />
          </TouchableOpacity>

          {expanded === group.name && (
            <View style={styles.cardBody}>
              <View style={styles.memberRow}>
                {group.members.map((m, i) => (
                  <View key={i} style={styles.chip}>
                    <Text style={styles.chipText}>{m}</Text>
                  </View>
                ))}
              </View>
              <View style={styles.actionsRow}>
                <Pressable style={styles.iconButton}>
                  <Ionicons name="add-circle-outline" size={20} color="black" />
                </Pressable>
                <Pressable style={styles.iconButton}>
                  <Ionicons name="remove-circle-outline" size={20} color="black" />
                </Pressable>
              </View>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const PURPLE = '#56018D';

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
    elevation: 2,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
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
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 4,
  },
});
