import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { auth, db } from '../firebase/config';

const PURPLE = '#56018D';

const categoryImages = {
  social: require('../../assets/images/social.png'),
  gym: require('../../assets/images/gym.png'), 
  food: require('../../assets/images/food.png'),
  study: require('../../assets/images/study.png'),
  car: require('../../assets/images/car.png'),
};
const defaultImage = require('../../assets/images/mall.png');

export default function QuestDetailPage() {
  const router = useRouter();
  const { id, from } = useLocalSearchParams();
  const [quest, setQuest] = useState<any>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [readableLocation, setReadableLocation] = useState<string>('Loading...');
  const [isRSVPed, setIsRSVPed] = useState(false);

  const currentUserHandle = (() => {
    const email = auth.currentUser?.email || '';
    return email.split('@')[0].toLowerCase();
  })();

  const handle = currentUserHandle;
  const isHost = quest?.host?.[0]?.toLowerCase() === handle;

  const getQuestImage = (quest: any) =>
    quest.photo && categoryImages[quest.photo] ? categoryImages[quest.photo] : defaultImage;

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
              // optional group data
            }
          }

          if (questData.location?.latitude && questData.location?.longitude) {
            try {
              const res = await fetch(
                `https://us1.locationiq.com/v1/reverse.php?key=pk.7f060c5daf66db53424ea6be3f65b9f7&lat=${questData.location.latitude}&lon=${questData.location.longitude}&format=json`
              );
              const data = await res.json();
              const raw = data.display_name || 'Unknown location';
              setReadableLocation(raw.slice(0, 16) + '...');
            } catch {
              setReadableLocation('Unknown location');
            }
          } else {
            setReadableLocation('No location specified');
          }
        }
      } catch (err) {
        console.error('❌ Fetch failed:', err);
      }
    };

    fetchQuest();
  }, [id]);

  const toggleRSVP = async () => {
    if (!quest) return;
    const questRef = doc(db, 'quests', String(id));
    try {
      if (isRSVPed) {
        await updateDoc(questRef, { attendees: arrayRemove(currentUserHandle) });
        setIsRSVPed(false);
        setParticipants(prev => prev.filter(p => p !== currentUserHandle));
      } else {
        await updateDoc(questRef, { attendees: arrayUnion(currentUserHandle) });
        setIsRSVPed(true);
        setParticipants(prev => [...prev, currentUserHandle]);
      }
    } catch (err) {
      console.error('RSVP toggle error:', err);
    }
  };

  const handleBack = () => router.push(from ? `/(tabs)/${from}` : '/(tabs)/quest-dashboard');

  if (!quest) {
    return (
      <SafeAreaView style={styles.safe}>
        <Text style={styles.title}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const ts = quest.when ?? quest.time;
  const start = ts?.seconds ? new Date(ts.seconds * 1000) : null;
  const timeFormatted = start
    ? `${start.toLocaleDateString(undefined, {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })}`
    : '';

  const timeShort = start
    ? `${start.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })} – TBD`
    : '';

    return (
      <SafeAreaView style={styles.safe}>
        <ScrollView>
          <View style={styles.header}>
            <Pressable onPress={handleBack}>
              <Ionicons name="arrow-back" size={24} color="#000" />
            </Pressable>
          </View>
    
          <Text style={styles.mainTitle}>{quest.name}</Text>
          <Image source={getQuestImage(quest)} style={styles.image} />
    
          <View style={styles.body}>
            {/* Date */}
            <Text style={styles.dateText}>
              {(() => {
                const when = quest?.when?.seconds;
                if (!when) return '';
                const date = new Date(when * 1000);
                return date.toLocaleDateString(undefined, {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                });
              })()}
            </Text>
    
            {/* Time + Hosted by (same row) */}
<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
  <Text style={styles.datetime}>
    {(() => {
      const start = quest?.when?.seconds;
      const end = quest?.end_time?.seconds;
      if (!start || !end) return '';
      const startDate = new Date(start * 1000);
      const endDate = new Date(end * 1000);
      return `${startDate.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })} – ${endDate.toLocaleTimeString([], {
        hour: 'numeric',
        minute: '2-digit',
      })}`;
    })()}
  </Text>
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Text style={styles.hostText}>Hosted by </Text>
    <View style={styles.bubble}>
      <Text style={styles.bubbleText}>
        {Array.isArray(quest.host) ? quest.host[0] : quest.host || 'Unknown'}
      </Text>
    </View>
  </View>
</View>

    
            {/* Description */}
            <Text style={styles.description}>{quest.description || 'No description provided.'}</Text>
    
            {/* Location */}
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={16} color="#333" />
              <Text style={styles.location}>
                {readableLocation.slice(0, 16) + '...'}
              </Text>
            </View>
    
            {/* RSVP Button */}
            <Pressable
              style={[
                styles.rsvpButton,
                isRSVPed && { backgroundColor: PURPLE, borderColor: PURPLE },
              ]}
              onPress={toggleRSVP}
            >
              <Text
                style={[styles.rsvpText, isRSVPed && { color: '#FFF' }]}
              >
                {isRSVPed ? "RSVP'd" : 'RSVP'}
              </Text>
            </Pressable>
    
            {/* Participants */}
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
        </ScrollView>
      </SafeAreaView>
    );
}
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', padding: 16 },
  mainTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 2,
  },
  dateText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  
  image: {
    height: 180,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  timeText: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  hostText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginRight: 6,
  },
  body: { paddingHorizontal: 16 },
  dateLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  description: { fontSize: 14, marginBottom: 12 },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  location: {
    marginLeft: 4,
    color: '#333',
    fontSize: 14,
  },
  rsvpButton: {
    borderWidth: 1,
    borderColor: PURPLE,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  rsvpText: {
    color: PURPLE,
    fontWeight: '600',
  },
  subheader: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  bubbleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  bubble: {
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 10,
    marginBottom: 8,
  },
  bubbleText: {
    fontSize: 14,
    color: '#333',
  },
});

