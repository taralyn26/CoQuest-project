// app/(tabs)/quest-detail-library.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LibraryDetail() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable style={styles.back} onPress={() => router.push('/(tabs)/quest-dashboard')}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>

      <Text style={styles.title}>Library Cram Session</Text>

      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>📚 Library Image</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.host}>Hosted by You</Text>
        <Text style={styles.datetime}>Saturday, May 5 • 10:30am - 12:30pm</Text>
        <Text style={styles.description}>
          I want to hit Aritzia and maybe grab some food at Joe & the Juice! I was planning on biking and leaving at 10:15 from the Oval!
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={16} color="#333" />
          <Text style={styles.location}>660 Stanford Shopping Center, Palo Alto</Text>
        </View>
      </View>

      <View style={styles.buttonGroup}>
        <Pressable style={styles.button}>
          <Ionicons name="create-outline" size={16} color="#000" />
          <Text style={styles.buttonText}>Edit Quest</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Ionicons name="megaphone-outline" size={16} color="#000" />
          <Text style={styles.buttonText}>Make Announcement</Text>
        </Pressable>
        <Pressable style={styles.button}>
          <Ionicons name="people-outline" size={16} color="#000" />
          <Text style={styles.buttonText}>View Participants</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  back: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', paddingHorizontal: 16 },
  imagePlaceholder: {
    height: 180,
    margin: 16,
    backgroundColor: '#EEE',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  imageText: { fontSize: 16, color: '#666' },
  section: { paddingHorizontal: 16 },
  host: { fontWeight: '500', marginBottom: 4 },
  datetime: { fontSize: 14, marginBottom: 8 },
  description: { fontSize: 14, marginBottom: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center' },
  location: { marginLeft: 4, color: '#333' },
  buttonGroup: { marginTop: 24, paddingHorizontal: 16 },
  button: {
    flexDirection: 'row',
    backgroundColor: '#F4F4F4',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: { marginLeft: 8, fontWeight: '500' },
});
