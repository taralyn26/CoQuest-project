// app/(tabs)/settings.tsx
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text
} from 'react-native';

export default function Settings() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.header}>Settings</Text>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <Pressable style={styles.row}>
          <Ionicons name="person-outline" size={20} color="#333" />
          <Text style={styles.label}>Edit Profile</Text>
        </Pressable>
        <Pressable style={styles.row}>
          <Ionicons name="key-outline" size={20} color="#333" />
          <Text style={styles.label}>Change Password</Text>
        </Pressable>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <Pressable style={styles.row}>
          <Ionicons name="notifications-outline" size={20} color="#333" />
          <Text style={styles.label}>Notifications</Text>
        </Pressable>
        <Pressable style={styles.row}>
          <Ionicons name="moon-outline" size={20} color="#333" />
          <Text style={styles.label}>Dark Mode</Text>
        </Pressable>

        {/* Legal / Info */}
        <Text style={styles.sectionTitle}>About</Text>
        <Pressable style={styles.row}>
          <Ionicons name="document-text-outline" size={20} color="#333" />
          <Text style={styles.label}>Terms of Service</Text>
        </Pressable>

        <Pressable
          style={styles.row}
          onPress={() => {
            // go back to "/" (your Index login/signup flow)
            router.replace('/');
          }}
        >
          <Ionicons name="exit-outline" size={20} color="#D00" />
          <Text style={[styles.label, { color: '#D00' }]}>Log Out</Text>
        </Pressable>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#56018D',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  label: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
});
