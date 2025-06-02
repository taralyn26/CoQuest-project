import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { db } from '../app/firebase/config';

const { width } = Dimensions.get('window');
const questImage = require('../assets/images/mall.png'); // Placeholder

export default function Quest({ id, from = 'quest-dashboard' }: { id: string, from?: string }) {
  const router = useRouter();
  const [quest, setQuest] = useState(null);

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const ref = doc(db, 'quests', id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setQuest(snap.data());
        }
      } catch (err) {
        console.error('Failed to fetch quest:', err);
      }
    };
    fetchQuest();
  }, [id]);

  const goToDetail = () => {
    router.push({ pathname: `/quest/${id}`, params: { from } });
  };

  if (!quest) return null;

  let formattedDate = '';
  const when = quest.when;
  if (when?.seconds) {
    const date = new Date(when.seconds * 1000);
    formattedDate = `${date.toLocaleDateString(undefined, {
      weekday: 'long',
    })} at ${date.toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  }

  return (
    <Pressable onPress={goToDetail} style={styles.card}>
      <View>
        <Image source={questImage} style={styles.image} />
        {formattedDate ? (
          <View style={styles.dateTag}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        ) : null}
        <View style={styles.hostingTag}>
          <Text style={styles.hostingText}>👑 hosting</Text>
        </View>
      </View>
      <Text style={styles.title}>{quest.name}</Text>
      {quest.description && (
      <Text style={styles.description}>{quest.description}</Text>
    )}

    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 12,
  },
  image: {
    width: 160,
    height: 160,
    borderRadius: 12,
  },
  dateTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: 'white',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  dateText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  hostingTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  hostingText: {
    fontSize: 10,
    color: 'white',
  },
  title: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  
});















