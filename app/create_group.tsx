import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from 'react-native';

import { useAuth } from '../src/AuthProvider';
import { createGroup } from './firebase/groupService';
import { searchUsers, type UserProfile } from './firebase/userService';

const PURPLE = '#56018D';

export default function CreateGroup() {
  const router = useRouter();
  const { user } = useAuth();
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [allUsers, setAllUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  //get them useres to load on component mount
  useEffect(() => {
    console.log('bri useEffect triggered in CreateGroup');
    console.log('GG User in useEffect:', user);
    
    // If user is undefined, auth is still loading
    if (user === undefined) {
      console.log('WAITT Auth still loading, waiting...');
      return;
    }
    
    // If user is null, they're not logged in
    if (user === null) {
      console.log('NOPE No user logged in');
      setLoading(false);
      return;
    }
    
    loadUsers();
  }, [user]);

  const loadUsers = async () => {
    console.log('lesgoo loadUsers called');
    
    //check for undefined (still loading) vs null (not logged in)
    if (user === undefined) {
      console.log('waiting User still loading');
      return;
    }
    
    if (!user) {
      console.log('wrongg No user found');
      setLoading(false);
      return;
    }
    
    console.log('user, Current user in loadUsers:', user.email);
    
    try {
      setLoading(true);
      const currentHandle = user.email?.split('@')[0];
      console.log(' Current handle:', currentHandle);
      console.log(' About to call searchUsers...');
      
      const users = await searchUsers('', currentHandle);
      console.log(' Users loaded:', users.length);
      console.log(' Users data:', users);
      
      setAllUsers(users);
    } catch (error) {
      console.error(' Error loading users:', error);
      console.error(' Error details:', error.message);
      Alert.alert('Error', 'Failed to load users');
    } finally {
      console.log(' Setting loading to false in loadUsers');
      setLoading(false);
    }
  };

  //filter users based on search term
  const filtered = useMemo(() => {
    if (!search.trim()) return allUsers;
    
    return allUsers.filter(u =>
      u.displayName.toLowerCase().includes(search.toLowerCase()) ||
      u.first_name.toLowerCase().includes(search.toLowerCase()) ||
      u.last_name.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, allUsers]);

  const toggle = (userHandle: string) => {
    setSelected(sel =>
      sel.includes(userHandle)
        ? sel.filter(x => x !== userHandle)
        : [...sel, userHandle]
    );
  };

  const canCreate = groupName.trim().length > 0 && selected.length > 0 && !creating;

  const handleCreateGroup = async () => {
    console.log(' handleCreateGroup called');
    console.log(' User in handleCreateGroup:', user?.email);
    console.log(' Group name:', groupName);
    console.log(' Selected members:', selected);
    
    if (!canCreate || !user) return;
    
    try {
      setCreating(true);
      
      const currentHandle = user.email?.split('@')[0];
      console.log(' Current handle for group creation:', currentHandle);
      
      if (!currentHandle) {
        throw new Error('Unable to get user handle');
      }
      
      console.log('🔍 About to create group...');
      await createGroup(groupName.trim(), selected, currentHandle);
      console.log(' Group created successfully');
      
      Alert.alert(
        'Success!', 
        'Group created successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error(' Error creating group:', error);
      console.error(' Error details:', error.message);
      Alert.alert('Error', 'Failed to create group. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  console.log(' Rendering CreateGroup, user:', user, 'loading:', loading);
  //loadin
  if (user === undefined || loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={PURPLE} />
          <Text style={{ marginTop: 10 }}>Loading users...</Text>
        </View>
      </SafeAreaView>
    );
  }

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

        {/* selected count */}
        {selected.length > 0 && (
          <Text style={styles.selectedCount}>
            {selected.length} member{selected.length === 1 ? '' : 's'} selected
          </Text>
        )}

        {/* list of users */}
        <View style={{ maxHeight: 300 }}>
  <ScrollView>
    {filtered.map((userProfile) => {
      const isSel = selected.includes(userProfile.handle);
      return (
        <Pressable
          key={userProfile.handle}
          style={[
            styles.userRow,
            isSel && { borderColor: PURPLE, borderWidth: 2 }
          ]}
          onPress={() => toggle(userProfile.handle)}
        >
          <View>
            <Text style={styles.userText}>{userProfile.displayName}</Text>
            <Text style={styles.userEmail}>{userProfile.email}</Text>
          </View>
          {isSel && (
            <Ionicons name="checkmark-circle" size={20} color={PURPLE} />
          )}
        </Pressable>
      );
    })}
  </ScrollView>
</View>


        {filtered.length === 0 && (
          <Text style={styles.noResults}>No users found</Text>
        )}

        {/* bottom create button */}
        <Pressable
          style={[
            styles.createButton,
            !canCreate && { backgroundColor: '#CCC' }
          ]}
          onPress={handleCreateGroup}
          disabled={!canCreate}
        >
          {creating ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.createText}>Create Group</Text>
          )}
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
  selectedCount: {
    fontSize: 12,
    color: PURPLE,
    marginBottom: 10,
    fontWeight: '600',
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
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    fontSize: 14,
    marginTop: 20,
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