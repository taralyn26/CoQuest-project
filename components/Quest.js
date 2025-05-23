import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { supabase } from '../supabase';

export default function Quest() {
  const router = useRouter();
  const [quest, setQuest] = useState(null);

  useEffect(() => {
    const fetchQuest = async () => {
      const { data, error } = await supabase
        .from('quests')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) {
        console.error('Error fetching quest:', error);
      } else {
        setQuest(data);
      }
    };

    fetchQuest();
  }, []);

  if (!quest) return null;

  return (
    <Pressable onPress={() => router.push('/mockQuests/quest-detail-mall')}>
      <View style={styles.card}>
        <View>
          <Image source={{ uri: quest.photo }} style={styles.image} />
          <View style={styles.dateTag}>
            <Text style={styles.dateText}>{quest.date}</Text>
          </View>
          <View style={styles.hostingTag}>
            <Text style={styles.hostingText}>👑 hosting</Text>
          </View>
        </View>
        <Text style={styles.title}>{quest.name}</Text>
      </View>
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
    backgroundColor: '#ccc',
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
});




