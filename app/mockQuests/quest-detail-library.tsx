// app/(tabs)/new-quest.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';

const GROUPS = ['Study Buddies', 'Party People'];
const PURPLE = '#56018D';
const LIGHTGRAY = '#F2F7FD';

export default function NewQuest() {
  const router = useRouter();
  const confettiRef = useRef(null);

  const [quest, setQuest] = useState('');
  const [location, setLocation] = useState('');
  const [whenOption, setWhenOption] = useState<'now' | 'in30' | 'pickTime'>('now');
  const [timeDropdown, setTimeDropdown] = useState(false);
  const [pickedTime, setPickedTime] = useState('Select time');
  const [photoAdded, setPhotoAdded] = useState(false);
  const [visibility, setVisibility] = useState('All Campus');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const hostAvatar = require('../../assets/images/pic.png');
  const hostName = 'Taralyn';

  const whenOptions = [
    { key: 'now', label: 'Now' },
    { key: 'in30', label: 'In 30 min' },
    { key: 'pickTime', label: 'Pick Time' },
  ];

  const times = Array.from({ length: 48 }).map((_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 ? '30' : '00';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${displayHour}:${minute} ${ampm}`;
  });

  const handleBroadcast = () => {
    setShowConfetti(true);
    setTimeout(() => {
      router.push('/(tabs)/map');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.wrapper}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Confetti overlay */}
          {showConfetti && (
            <ConfettiCannon
              count={100}
              origin={{ x: -10, y: 0 }}
              fallSpeed={3000}
              fadeOut
              explosionSpeed={500}
              autoStart
            />
          )}

          <Pressable style={styles.back} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={PURPLE} />
          </Pressable>

          <Text style={styles.header}>New Quest</Text>

          <Text style={styles.label}>What's your quest?</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Picnic at Oval"
            value={quest}
            onChangeText={setQuest}
          />

          <Text style={styles.label}>Where</Text>
          <View style={styles.inputRow}>
            <Ionicons name="location-sharp" size={20} color="#999" />
            <TextInput
              style={styles.locationInput}
              placeholder="Place or address"
              value={location}
              onChangeText={setLocation}
            />
          </View>

          <Text style={styles.label}>When</Text>
          <View style={styles.row}>
            {whenOptions.map(opt => (
              <Pressable
                key={opt.key}
                style={[styles.timeButton, whenOption === opt.key && styles.timeButtonSelected]}
                onPress={() => {
                  setWhenOption(opt.key);
                  setTimeDropdown(opt.key === 'pickTime');
                }}
              >
                <Text style={[styles.timeButtonText, whenOption === opt.key && styles.timeButtonTextSelected]}>
                  {opt.key === 'pickTime' ? pickedTime : opt.label}
                </Text>
              </Pressable>
            ))}
          </View>

          {timeDropdown && (
            <ScrollView style={styles.dropdown}>
              {times.map(t => (
                <Pressable
                  key={t}
                  onPress={() => {
                    setPickedTime(t);
                    setTimeDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownItem}>{t}</Text>
                </Pressable>
              ))}
            </ScrollView>
          )}

          <Text style={styles.label}>Add a cover photo (optional)</Text>
          <Pressable style={styles.photoBox} onPress={() => setPhotoAdded(true)}>
            {photoAdded ? (
              <Image source={hostAvatar} style={styles.photo} />
            ) : (
              <Ionicons name="image-outline" size={48} color="#CCC" />
            )}
          </Pressable>

          <Text style={styles.label}>Hosted by</Text>
          <View style={styles.hostRow}>
            <Image source={hostAvatar} style={styles.avatar} />
            <Text style={styles.hostName}>{hostName}</Text>
          </View>

          <Text style={styles.label}>Who can see this</Text>
          <Pressable style={styles.inputRow} onPress={() => setDropdownOpen(!dropdownOpen)}>
            <Ionicons name="people-sharp" size={20} color="#333" />
            <Text style={styles.visibilityText}>{visibility}</Text>
            <Ionicons
              name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#999"
              style={{ marginLeft: 'auto' }}
            />
          </Pressable>

          {dropdownOpen && (
            <View style={styles.dropdown}>
              {['All Campus', ...GROUPS].map(group => (
                <Pressable
                  key={group}
                  onPress={() => {
                    setVisibility(group);
                    setDropdownOpen(false);
                  }}
                >
                  <Text style={styles.dropdownItem}>{group}</Text>
                </Pressable>
              ))}
            </View>
          )}

          <Pressable style={styles.broadcastButton} onPress={handleBroadcast}>
            <Text style={styles.broadcastText}>Broadcast My Quest!</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: LIGHTGRAY },
  wrapper: { flex: 1, position: 'relative' },
  container: { padding: 20, paddingBottom: 100 },
  back: { marginBottom: 16 },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: PURPLE,
    alignSelf: 'center',
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 16,
  },
  locationInput: {
    flex: 1,
    marginLeft: 8,
    color: '#333',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  timeButton: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    backgroundColor: '#FFF',
    alignItems: 'center',
  },
  timeButtonSelected: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  timeButtonText: {
    color: '#333',
  },
  timeButtonTextSelected: {
    color: '#FFF',
    fontWeight: '600',
  },
  dropdown: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    maxHeight: 200,
    marginBottom: 16,
  },
  dropdownItem: {
    padding: 12,
    fontSize: 16,
    color: '#333',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  photoBox: {
    width: '100%',
    height: 200,
    backgroundColor: '#FFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  hostRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  hostName: {
    fontSize: 16,
    color: '#333',
  },
  visibilityText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#333',
  },
  broadcastButton: {
    backgroundColor: PURPLE,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  broadcastText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
