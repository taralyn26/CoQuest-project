// app/(tabs)/quest-detail-wilbur.tsx
import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function WilburDetail() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe}>
      <Pressable style={styles.back} onPress={() => router.push('/(tabs)/quest-dashboard')}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </Pressable>

      <Text style={styles.title}>Wilbur Dinner</Text>

      <Image
        source={require('../../assets/images/Wilbur-Dining-Hall.webp')}
        style={styles.imageBox}
      />

      <View style={styles.section}>
        <Text style={styles.datetime}>Wednesday April 30th • Now–8:00pm</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={16} color="#333" />
          <Text style={styles.location}>Wilbur Dining</Text>
        </View>

        <Text style={styles.description}>
          Wilbur dinner! (guys they have sesame chicken today!)
        </Text>

        <Pressable style={styles.goingButton}>
          <Text style={styles.goingText}>Going 🎉</Text>
        </Pressable>

        <Text style={styles.sub}>Questers:</Text>
        <View style={styles.avatars}>
          <Text style={styles.avatar}>🧍</Text>
          <Text style={styles.avatar}>🧍‍♀️</Text>
          <Text style={styles.avatar}>🧍‍♂️</Text>
          <Text style={styles.viewAll}>View all</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const PURPLE = '#56018D';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  back: { padding: 16 },
  title: { fontSize: 22, fontWeight: '700', paddingHorizontal: 16 },
  imageBox: {
    height: 180,
    margin: 16,
    borderRadius: 12,
    width: '90%',
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  section: { paddingHorizontal: 16 },
  datetime: { fontSize: 14, marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  location: { marginLeft: 4, color: '#333' },
  description: { fontSize: 14, marginBottom: 16 },
  goingButton: {
    backgroundColor: PURPLE,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  goingText: { color: '#FFF', fontWeight: '600' },
  sub: { fontSize: 14, fontWeight: '500', marginBottom: 8 },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatar: { fontSize: 24 },
  viewAll: {
    marginLeft: 12,
    color: '#007AFF',
    fontWeight: '500',
    fontSize: 14,
  },
});