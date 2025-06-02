import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const PURPLE = '#56018D';
const questImage = require('../../assets/images/mall.png');

export default function QuestDetailPage() {
  const router = useRouter();
  const { id, from } = useLocalSearchParams();
  const [quest, setQuest] = useState<any>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [readableLocation, setReadableLocation] = useState<string>('Loading location...');
  const [isRSVPed, setIsRSVPed] = useState(false);

  const currentUserHandle = (() => {
    const email = auth.currentUser?.email || '';
    const handle = email.split('@')[0];
    return handle.charAt(0).toUpperCase() + handle.slice(1);
  })();

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const ref = doc(db, 'quests', String(id));
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const questData = snap.data();
          setQuest(questData);

          const attendees = questData.attendees || [];
          setIsRSVPed(attendees.includes(currentUserHandle));
          setParticipants(attendees);

          const groupID = questData.unique_group_ID;
          if (groupID && groupID !== 'All Campus') {
            const groupRef = doc(db, 'groups', groupID);
            const groupSnap = await getDoc(groupRef);
            if (groupSnap.exists()) {
              const groupData = groupSnap.data();
              const members = groupData.memberHandles || [];
              // Optional: merge group + attendees if needed
            }
          }

          if (questData.location?.latitude && questData.location?.longitude) {
            try {
              const res = await fetch(
                `https://us1.locationiq.com/v1/reverse.php?key=pk.7f060c5daf66db53424ea6be3f65b9f7&lat=${questData.location.latitude}&lon=${questData.location.longitude}&format=json`
              );
              const data = await res.json();
              setReadableLocation(data.display_name || 'Unknown location');
            } catch (err) {
              console.warn('Failed to reverse geocode:', err);
              setReadableLocation('Unknown location');
            }
          } else {
            setReadableLocation('No location specified');
          }

        } else {
          console.log('❌ Quest not found');
        }
      } catch (err) {
        console.error('❌ Failed to fetch quest:', err);
      }
    };

    fetchQuest();
  }, [id]);

  const toggleRSVP = async () => {
    if (!quest) return;
    const questRef = doc(db, 'quests', String(id));

    try {
      if (isRSVPed) {
        await updateDoc(questRef, {
          attendees: arrayRemove(currentUserHandle),
        });
        setIsRSVPed(false);
        setParticipants(prev => prev.filter(p => p !== currentUserHandle));
      } else {
        await updateDoc(questRef, {
          attendees: arrayUnion(currentUserHandle),
        });
        setIsRSVPed(true);
        setParticipants(prev => [...prev, currentUserHandle]);
      }
    } catch (err) {
      console.error('RSVP toggle error:', err);
    }
  };

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
        <Text style={styles.host}>
          Hosted by {Array.isArray(quest.host) ? quest.host[0] : quest.host || 'Unknown'}
        </Text>

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

        <Text style={styles.description}>
          {quest.description || 'No description provided.'}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={16} color="#333" />
          <Text style={styles.location}>{readableLocation}</Text>
        </View>

        <Pressable
          style={[
            styles.rsvpButton,
            isRSVPed && { backgroundColor: PURPLE, borderColor: PURPLE },
          ]}
          onPress={toggleRSVP}
        >
          <Text style={[
            styles.rsvpText,
            isRSVPed && { color: '#FFF' },
          ]}>
            {isRSVPed ? 'RSVP’d' : 'RSVP'}
          </Text>
        </Pressable>

        <Text style={styles.subheader}>
          {participants.length} Quester{participants.length !== 1 ? 's' : ''}
        </Text>

        <View style={styles.bubbleRow}>
          {participants.map((name) => (
            <View key={name} style={styles.bubble}>
              <Text style={styles.bubbleText}>{name}</Text>
            </View>
          ))}
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
  bubbleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  bubble: {
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 12,
    marginBottom: 8,
  },
  bubbleText: { fontSize: 14, color: '#333' },
});
