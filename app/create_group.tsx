// app/(tabs)/create-group.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

const PURPLE = '#56018D';

// mock list of all possible users
const allUsers = [
  'Aya','Isaias','Jad','Emi','Varsha','Nico','Yujina','Alex','Carmah','Lianah'
];

export default function CreateGroup() {
  const router = useRouter();
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  // filter by search term
  const filtered = useMemo(
    () =>
      allUsers.filter(u =>
        u.toLowerCase().includes(search.toLowerCase())
      ),
    [search]
  );

  const toggle = (user: string) => {
    setSelected(sel =>
      sel.includes(user)
        ? sel.filter(x => x !== user)
        : [...sel, user]
    );
  };

  const canCreate = groupName.trim().length > 0 && selected.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      {/* header */}
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </Pressable>
        <Text style={styles.header}>Create New Group</Text>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        {/* group name input */}
        <Text style={styles.label}>Group Name</Text>
        <TextInput
          value={groupName}
          onChangeText={setGroupName}
          placeholder="e.g. Weekend Hikers"
          placeholderTextColor="#999"
          style={styles.input}
        />

        {/* user search */}
        <Text style={[styles.label, { marginTop: 20 }]}>Add Members</Text>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search users"
          placeholderTextColor="#999"
          style={styles.input}
        />

        {/* list of users */}
        {filtered.map((user, i) => {
          const isSel = selected.includes(user);
          return (
            <Pressable
              key={i}
              style={[
                styles.userRow,
                isSel && { borderColor: PURPLE, borderWidth: 2 }
              ]}
              onPress={() => toggle(user)}
            >
              <Text style={styles.userText}>{user}</Text>
              {isSel && (
                <Ionicons name="checkmark-circle" size={20} color={PURPLE} />
              )}
            </Pressable>
          );
        })}

        {/* bottom create button */}
        <Pressable
          style={[
            styles.createButton,
            !canCreate && { backgroundColor: '#CCC' }
          ]}
          onPress={() => {
            if (!canCreate) return;
            // TODO: actually send to backend...
            // for now just go back
            router.back();
          }}
          disabled={!canCreate}
        >
          <Text style={styles.createText}>Create Group</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
  },
  container: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#F2F2F2',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 12,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  userText: {
    fontSize: 16,
    color: '#333',
  },
  createButton: {
    backgroundColor: PURPLE,
    paddingVertical: 14,
    borderRadius: 999,
    alignItems: 'center',
    marginTop: 24,
  },
  createText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
