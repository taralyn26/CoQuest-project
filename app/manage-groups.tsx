// app/manage-groups.tsx (With Debugging)
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { useAuth } from '../src/AuthProvider';
import {
  deleteGroup,
  getMyGroupsWithMembers,
  subscribeToMyGroups,
  type GroupWithMembers
} from './firebase/groupService';
import { getAllUsers } from './firebase/userService';

const PURPLE = '#56018D';

export default function ManageGroups() {
  const router = useRouter();
  const { user } = useAuth();
  const [groups, setGroups] = useState<GroupWithMembers[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Test function to check basic Firestore access
  const testFirestore = async () => {
    try {
      console.log('🧪 Testing basic Firestore access...');
      const users = await getAllUsers();
      console.log('✅ Firestore test successful. Users found:', users.length);
      console.log('👥 Users data:', users);
    } catch (error) {
      console.error('❌ Firestore test failed:', error);
      console.error('❌ Firestore error details:', error.message);
    }
  };

  useEffect(() => {
    console.log('🔄 useEffect triggered');
    console.log('👤 User in useEffect:', user);
    
    // If user is undefined, auth is still loading
    if (user === undefined) {
      console.log('⏳ Auth still loading, waiting...');
      return;
    }
    
    // If user is null, they're not logged in
    if (user === null) {
      console.log('❌ No user logged in');
      setLoading(false);
      return;
    }
    
    // Test Firestore first
    testFirestore();
    
    // Load groups
    loadGroups();
    
    // Set up real-time subscription
    const currentHandle = user.email?.split('@')[0];
    console.log('📧 Setting up subscription for handle:', currentHandle);
    
    if (currentHandle) {
      const unsubscribe = subscribeToMyGroups(
        currentHandle,
        () => {
          console.log('🔔 Subscription triggered, reloading groups...');
          loadGroups();
        },
        (error) => {
          console.error('❌ Error in groups subscription:', error);
        }
      );
      
      return unsubscribe;
    }
  }, [user]);

  const loadGroups = async () => {
    console.log('🚀 loadGroups called');
    
    // Check for undefined (still loading) vs null (not logged in)
    if (user === undefined) {
      console.log('⏳ User still loading');
      return;
    }
    
    if (!user) {
      console.log('❌ No user found');
      setLoading(false);
      return;
    }
    
    console.log('👤 Current user object:', user);
    console.log('📧 User email:', user.email);
    console.log('🆔 User UID:', user.uid);
    
    const currentHandle = user.email?.split('@')[0];
    console.log('📧 Extracted handle:', currentHandle);
    
    if (!currentHandle) {
      console.log('❌ No handle found from email');
      setLoading(false);
      return;
    }
    
    try {
      console.log('🔍 About to call getMyGroupsWithMembers for handle:', currentHandle);
      const groupsWithMembers = await getMyGroupsWithMembers(currentHandle);
      console.log('✅ getMyGroupsWithMembers returned successfully');
      console.log('📊 Number of groups found:', groupsWithMembers.length);
      console.log('📋 Groups data:', groupsWithMembers);
      
      setGroups(groupsWithMembers);
      console.log('💾 Groups state updated');
    } catch (error) {
      console.error('❌ Error in loadGroups:', error);
      console.error('❌ Error type:', typeof error);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      Alert.alert('Error', 'Failed to load groups: ' + error.message);
    } finally {
      console.log('🏁 Setting loading to false');
      setLoading(false);
    }
  };

  const toggleExpand = (groupId: string) => {
    console.log('🔽 Toggling expand for group:', groupId);
    setExpanded(expanded === groupId ? null : groupId);
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    console.log('🗑️ Delete group requested:', groupId, groupName);
    Alert.alert(
      'Delete Group',
      `Are you sure you want to delete "${groupName}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Deleting group:', groupId);
              await deleteGroup(groupId);
              console.log('✅ Group deleted successfully');
            } catch (error) {
              console.error('❌ Error deleting group:', error);
              Alert.alert('Error', 'Failed to delete group');
            }
          },
        },
      ]
    );
  };

  console.log('🎨 Rendering ManageGroups, user:', user, 'loading:', loading, 'groups count:', groups.length);

  // Show loading while auth is determining user state
  if (user === undefined || loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={PURPLE} />
        <Text style={{ marginTop: 10 }}>Loading groups...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <Pressable onPress={() => router.push('../profile')}>
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

      {groups.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No groups yet</Text>
          <Text style={styles.emptySubtext}>Create your first group to get started!</Text>
        </View>
      ) : (
        groups.map((group) => {
          const isExpanded = expanded === group.id;
          return (
            <View key={group.id} style={styles.card}>
              <TouchableOpacity
                onPress={() => toggleExpand(group.id)}
                style={styles.cardHeader}
              >
                <View style={styles.titleRow}>
                  <Text style={styles.groupName}>{group.name}</Text>
                  {isExpanded && (
                    <Pressable 
                      style={styles.deleteButton}
                      onPress={() => handleDeleteGroup(group.id, group.name)}
                    >
                      <Ionicons name="trash-outline" size={18} color="#dc3545" />
                    </Pressable>
                  )}
                </View>
                <Text style={styles.arrow}>{isExpanded ? '▲' : '▼'}</Text>
              </TouchableOpacity>

              {isExpanded && (
                <View style={styles.cardBody}>
                  <Text style={styles.memberCount}>
                    {group.members.length} member{group.members.length === 1 ? '' : 's'}
                  </Text>
                  <View style={styles.memberRow}>
                    {group.members.map((member) => (
                      <View key={member.handle} style={styles.chip}>
                        <Text style={styles.chipText}>{member.displayName}</Text>
                      </View>
                    ))}
                  </View>
                  <Text style={styles.createdAt}>
                    Created: {group.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                  </Text>
                </View>
              )}
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    paddingBottom: 40,
    flexGrow: 1,
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
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
    flex: 1,
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
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
  createdAt: {
    fontSize: 11,
    color: '#999',
    fontStyle: 'italic',
  },
});