import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
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

// Import category images
const categoryImages = {
  social: require('../assets/images/social.png'),
  gym: require('../assets/images/gym.png'), 
  food: require('../assets/images/food.png'),
  study: require('../assets/images/study.png'),
  car: require('../assets/images/car.png'),
};

// Fallback image if no category is specified
const defaultImage = require('../assets/images/mall.png');

export default function Quest({ 
  id, 
  from = 'quest-dashboard',
  questData,
  photoCategory 
}: { 
  id: string; 
  from?: string;
  questData?: any;
  photoCategory?: string;
}) {
  const router = useRouter();
  const [quest, setQuest] = useState(questData || null);
  const [isHost, setIsHost] = useState(false);

  useEffect(() => {
    // If questData is provided, use it directly
    if (questData) {
      setQuest(questData);
      
      // Get current user email handle
      const user = getAuth().currentUser;
      const handle = user?.email?.split('@')[0]?.toLowerCase();

      if (handle && Array.isArray(questData.host)) {
        setIsHost(questData.host[0]?.toLowerCase() === handle);
      }
      return;
    }

    // Otherwise fetch quest data (fallback for other use cases)
    const fetchQuest = async () => {
      try {
        const ref = doc(db, 'quests', id);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const questData = snap.data();
          setQuest(questData);

          // Get current user email handle
          const user = getAuth().currentUser;
          const handle = user?.email?.split('@')[0]?.toLowerCase();

          if (handle && Array.isArray(questData.host)) {
            setIsHost(questData.host[0]?.toLowerCase() === handle);
          }
        }
      } catch (err) {
        console.error('Failed to fetch quest:', err);
      }
    };
    fetchQuest();
  }, [id, questData]);

  const goToDetail = () => {
    router.push({ pathname: `/quest/${id}`, params: { from } });
  };

  if (!quest) return null;

  // Determine which image to use
  const getQuestImage = () => {
    // First try to use photoCategory prop
    if (photoCategory && categoryImages[photoCategory]) {
      return categoryImages[photoCategory];
    }
    
    // Then try quest.photo field
    if (quest.photo && categoryImages[quest.photo]) {
      return categoryImages[quest.photo];
    }
    
    // Fall back to default image
    return defaultImage;
  };

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
        <Image source={getQuestImage()} style={styles.image} />
        {formattedDate && (
          <View style={styles.dateTag}>
            <Text style={styles.dateText}>{formattedDate}</Text>
          </View>
        )}
        {isHost && (
          <View style={styles.hostingTag}>
            <Text style={styles.hostingText}>♛ Hosting </Text>
          </View>
        )}
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
    backgroundColor: '#56018D',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hostingText: {
    fontSize: 10,
    fontWeight: '600',
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