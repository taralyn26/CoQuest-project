import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput
} from 'react-native';
import { db } from './firebase/config';

const PURPLE = '#56018D';
const LIGHTGRAY = '#F2F7FD';

export default function EditQuest() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [quest, setQuest] = useState<any>(null);
  const [questName, setQuestName] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    const fetchQuest = async () => {
      try {
        const ref = doc(db, 'quests', String(id));
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setQuest(data);
          setQuestName(data.name || '');
          setDescription(data.description || '');

          const start = data.when?.seconds ? new Date(data.when.seconds * 1000) : new Date();
          const hours = String(start.getHours()).padStart(2, '0');
          const minutes = String(start.getMinutes()).padStart(2, '0');
          setStartTime(`${hours}:${minutes}`);

          const end = data.end_time?.seconds ? new Date(data.end_time.seconds * 1000) : new Date();
          const durationMinutes = Math.floor((end.getTime() - start.getTime()) / 60000);
          setDuration(durationMinutes.toString());
        }
      } catch (err) {
        console.error('Failed to fetch quest:', err);
      }
    };
    fetchQuest();
  }, [id]);

  const handleSave = async () => {
    try {
      const [hours, minutes] = startTime.split(':').map(Number);
      const newStart = new Date();
      newStart.setHours(hours, minutes, 0, 0);

      const newEnd = new Date(newStart.getTime() + parseInt(duration) * 60000);

      const ref = doc(db, 'quests', String(id));
      await updateDoc(ref, {
        name: questName,
        description,
        when: Timestamp.fromDate(newStart),
        end_time: Timestamp.fromDate(newEnd),
      });

      Alert.alert('Success', 'Quest updated successfully!');
      router.push(`/(tabs)/quest-dashboard`);
    } catch (err) {
      console.error('Failed to update quest:', err);
      Alert.alert('Error', 'Failed to update quest.');
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
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable style={styles.back} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={PURPLE} />
        </Pressable>

        <Text style={styles.header}>Edit Quest</Text>

        <Text style={styles.label}>Quest Name</Text>
        <TextInput
          style={styles.input}
          value={questName}
          onChangeText={setQuestName}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Start Time (24h, HH:MM)</Text>
        <TextInput
          style={styles.input}
          value={startTime}
          onChangeText={setStartTime}
        />

        <Text style={styles.label}>Duration (minutes)</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={duration}
          onChangeText={setDuration}
        />

        <Pressable style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveText}>Save Changes</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: LIGHTGRAY,
  },
  container: {
    padding: 16,
    paddingBottom: 32,
  },
  back: {
    marginBottom: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: PURPLE,
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    height: 44,
    backgroundColor: '#FFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  saveButton: {
    backgroundColor: PURPLE,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  title: {
    alignSelf: 'center',
    marginTop: 24,
    fontSize: 20,
  },
});
