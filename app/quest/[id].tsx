import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { auth, db } from '../firebase/config';


const PURPLE = '#56018D';
const questImage = require('../../assets/images/mall.png');

export default function QuestDetailPage() {
  const router = useRouter();
  const { id, from } = useLocalSearchParams();
  const [quest, setQuest] = useState<any>(null);

  const currentUser = auth.currentUser;
  const handle = currentUser?.email?.split('@')[0].toLowerCase();
  const isHost = quest?.host?.[0]?.toLowerCase() === handle;


  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const ref = doc(db, 'quests', String(id));
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setQuest(snap.data());
        } else {
          console.log('❌ Quest not found');
        }
      } catch (err) {
        console.error('❌ Failed to fetch quest:', err);
      }
    };
    fetchQuest();
  }, [id]);

  const handleBack = () => {
    if (from) {
      router.push(`/(tabs)/${from}`);
    } else {
      router.push('/(tabs)/quest-dashboard');
    }
  };

  if (!quest) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </Pressable>
      </View>

      <Text style={styles.title}>{quest.name}</Text>
      <Image source={questImage} style={styles.image} />

      <View style={styles.body}>
        <Text style={styles.host}>Hosted by Taralyn</Text>
        <Text style={styles.datetime}>
  {(() => {
    const ts = quest?.when ?? quest?.time;
    if (!ts?.seconds) return '';
    const date = new Date(ts.seconds * 1000);
    return `${date.toLocaleDateString(undefined, {
      weekday: 'long',
    })} at ${date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  })()}
</Text>

        <Text style={styles.description}>{quest.description}</Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={16} color="#333" />
          <Text style={styles.location}>
            {Array.isArray(quest.location)
              ? quest.location.join(', ')
              : typeof quest.location === 'string'
              ? quest.location
              : 'No location specified'}
          </Text>
        </View>

        <Pressable style={styles.rsvpButton}>
          <Text style={styles.rsvpText}>RSVP</Text>
        </Pressable>

        {isHost && (
        <Pressable
          style={[styles.rsvpButton, { backgroundColor: '#EEE', marginTop: 8 }]}
          onPress={() => router.push(`/edit_quest?id=${id}`)}
        >
          <Text style={[styles.rsvpText, { color: '#56018D' }]}>Edit Quest</Text>
        </Pressable>
      )}



        <Text style={styles.subheader}>2 Questers</Text>
        <View style={styles.bubbleRow}>
          <View style={styles.bubble}><Text style={styles.bubbleText}>You</Text></View>
          <View style={styles.bubble}><Text style={styles.bubbleText}>Emi</Text></View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', padding: 16 },
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
  rsvpText: { color: PURPLE, fontWeight: '600' },
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


