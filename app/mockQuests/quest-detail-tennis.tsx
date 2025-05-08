import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function TennisQuestDetail() {
  const router = useRouter();
  const [going, setGoing] = useState(false);

  const questers = ['You', 'Aya'];
  const totalMembers = 3;
  const extraCount = totalMembers - questers.length;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => router.push('/(tabs)/quest-dashboard')}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
      </View>

      <Text style={styles.title}>Tennis Hitaround 🎾</Text>

      <Image
        source={require('../../assets/images/tennis.jpg')}
        style={styles.image}
      />

      <View style={styles.body}>
        <Text style={styles.host}>Hosted by Taralyn</Text>
        <Text style={styles.datetime}>Sunday, May 12 • 4:00pm – 5:00pm</Text>
        <Text style={styles.description}>
          Nothing serious—just bringing rackets and hitting some balls around. All levels welcome, come rally or just chill courtside!
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={16} color="#333" />
          <Text style={styles.location}>Arbuckle Tennis Courts, Stanford Campus</Text>
        </View>

        <Pressable
          style={[styles.rsvpButton, going && styles.going]}
          onPress={() => setGoing((g) => !g)}
        >
          <Text style={[styles.rsvpText, going && styles.goingText]}>
            {going ? 'Going 🎾' : 'RSVP'}
          </Text>
        </Pressable>

        <Text style={styles.subheader}>{totalMembers} Questers</Text>
        <View style={styles.bubbleRow}>
          {questers.map((name) => (
            <View key={name} style={styles.bubble}>
              <Text style={styles.bubbleText}>{name}</Text>
            </View>
          ))}
          {extraCount > 0 && (
            <View style={styles.bubble}>
              <Text style={styles.bubbleText}>+{extraCount}</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const PURPLE = '#56018D';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  header: {
    flexDirection: 'row',
    padding: 16,
  },
  title: { fontSize: 22, fontWeight: '700', paddingHorizontal: 16 },
  image: {
    height: 180,
    margin: 16,
    borderRadius: 12,
    width: '90%',
    alignSelf: 'center',
    resizeMode: 'cover',
  },
  body: { paddingHorizontal: 16 },
  host: { fontWeight: '500', marginBottom: 4 },
  datetime: { fontSize: 14, marginBottom: 8 },
  description: { fontSize: 14, marginBottom: 12 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  location: { marginLeft: 4, color: '#333' },
  rsvpButton: {
    borderWidth: 1,
    borderColor: PURPLE,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  going: { backgroundColor: PURPLE },
  rsvpText: { color: PURPLE, fontWeight: '600' },
  goingText: { color: '#FFF' },
  subheader: { fontSize: 14, color: '#888', marginBottom: 8 },
  bubbleRow: { flexDirection: 'row', alignItems: 'center' },
  bubble: {
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 12,
  },
  bubbleText: { fontSize: 14, color: '#333' },
});
