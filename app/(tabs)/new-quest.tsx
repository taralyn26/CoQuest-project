// app/(tabs)/new-quest.tsx

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

// Visibility groups
const GROUPS = ['Study Buddies', 'Party People'];

export default function NewQuest() {
  const router = useRouter();

  const [quest, setQuest] = useState('');
  const [location, setLocation] = useState('');
  const [whenOption, setWhenOption] = useState<'now' | 'in30' | 'pickTime'>('now');
  const [timeDropdown, setTimeDropdown] = useState(false);
  const [pickedTime, setPickedTime] = useState('Select time');
  const [photoAdded, setPhotoAdded] = useState(false);
  const [visibility, setVisibility] = useState('All Campus');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Pressable style={styles.back} onPress={() => router.push('/(tabs)/map')}>
          <Ionicons name="arrow-back" size={24} color={styles.header.color} />
        </Pressable>

        <Text style={styles.header}>New Quest</Text>

        <Text style={styles.label}>What's your quest?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Quick lunch @ Treehouse"
          placeholderTextColor="#999"
          value={quest}
          onChangeText={setQuest}
        />

        <Text style={styles.label}>Where</Text>
        <View style={styles.locationContainer}>
          <Ionicons name="location-sharp" size={20} color="#999" />
          <TextInput
            style={styles.locationInput}
            placeholder="Place name, address, etc"
            placeholderTextColor="#999"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <Text style={styles.label}>When</Text>
        <View style={styles.whenContainer}>
          {whenOptions.map(opt => (
            <Pressable
              key={opt.key}
              style={[
                styles.whenButton,
                whenOption === opt.key && styles.whenButtonSelected,
              ]}
              onPress={() => {
                setWhenOption(opt.key);
                setTimeDropdown(opt.key === 'pickTime');
              }}
            >
              <Text
                style={[
                  styles.whenText,
                  whenOption === opt.key && styles.whenTextSelected,
                ]}
              >
                {opt.key === 'pickTime' ? pickedTime : opt.label}
              </Text>
            </Pressable>
          ))}
        </View>

        {timeDropdown && (
          <View style={styles.dropdownListLarge}>
            <ScrollView style={styles.timeScroll}>
              {times.map(time => (
                <Pressable
                  key={time}
                  style={[
                    styles.dropdownItem,
                    time === pickedTime && styles.selectedItem,
                  ]}
                  onPress={() => {
                    setPickedTime(time);
                    setTimeDropdown(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      time === pickedTime && styles.selectedText,
                    ]}
                  >
                    {time}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        <Text style={styles.label}>Add a cover photo (optional)</Text>
        <Pressable
          style={styles.photoPlaceholder}
          onPress={() => setPhotoAdded(true)}
        >
          {photoAdded ? (
            <Image source={hostAvatar} style={styles.photo} />
          ) : (
            <Ionicons name="image-outline" size={48} color="#CCC" />
          )}
        </Pressable>

        <Text style={styles.sectionTitle}>Hosted by</Text>
        <View style={styles.hostContainer}>
          <Image source={hostAvatar} style={styles.avatar} />
          <Text style={styles.hostName}>{hostName}</Text>
          <Pressable style={styles.addHostsButton}>
            <Text style={styles.addHostsText}>+ Add CoHosts</Text>
          </Pressable>
        </View>

        <Text style={styles.sectionTitle}>Who can see this</Text>
        <View>
          <Pressable
            style={styles.visibilityContainer}
            onPress={() => setDropdownOpen(!dropdownOpen)}
          >
            <Ionicons name="people-sharp" size={20} color="#333" style={{ marginRight: 8 }} />
            <Text style={styles.visibilityText}>{visibility}</Text>
            <Ionicons
              name={dropdownOpen ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={styles.header.color}
              style={{ marginLeft: 'auto' }}
            />
          </Pressable>

          {dropdownOpen && (
            <View style={styles.dropdownList}>
              {['All Campus', ...GROUPS].map(g => (
                <Pressable
                  key={g}
                  style={[
                    styles.dropdownItem,
                    g === visibility && styles.selectedItem,
                  ]}
                  onPress={() => {
                    setVisibility(g);
                    setDropdownOpen(false);
                  }}
                >
                  <Text
                    style={[
                      styles.dropdownText,
                      g === visibility && styles.selectedText,
                      g === 'All Campus' && styles.defaultText,
                    ]}
                  >
                    {g}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        <Pressable style={styles.broadcastButton} onPress={handleBroadcast}>
          <Text style={styles.broadcastText}>Broadcast My Quest!</Text>
        </Pressable>
      </ScrollView>

      {/* Popup Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>🎉 Congratulations!</Text>
            <Text style={styles.modalSubtitle}>Your quest is posted</Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => {
                setModalVisible(false);
                router.push('/(tabs)/map');
              }}
            >
              <Text style={styles.modalButtonText}>Okay</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ⬇ styles unchanged except for modal addition
const PURPLE = '#56018D';
const LIGHTGRAY = '#F2F7FD';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: LIGHTGRAY },
  container: { padding: 16, paddingBottom: 32 },
  back: { position: 'absolute', top: 16, left: 16, zIndex: 10 },
  header: {
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 24,
    fontSize: 24,
    fontWeight: '700',
    color: PURPLE,
  },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 8, color: '#333' },
  input: {
    height: 44, backgroundColor: '#FFF', borderRadius: 8,
    paddingHorizontal: 12, marginBottom: 16, borderWidth: 1, borderColor: '#DDD',
  },
  locationContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 8, borderWidth: 1, borderColor: '#DDD',
    marginBottom: 16, paddingHorizontal: 12,
  },
  locationInput: { flex: 1, height: 44, color: '#333' },
  whenContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  whenButton: {
    flex: 1, alignItems: 'center', paddingVertical: 12, backgroundColor: '#FFF',
    borderRadius: 8, marginHorizontal: 4, borderWidth: 1, borderColor: '#DDD',
  },
  whenButtonSelected: { backgroundColor: PURPLE, borderColor: PURPLE },
  whenText: { color: '#333' },
  whenTextSelected: { color: '#FFF' },
  dropdownListLarge: {
    maxHeight: 200, backgroundColor: '#FFF', borderRadius: 8,
    borderWidth: 1, borderColor: '#DDD', marginBottom: 16,
  },
  timeScroll: { paddingHorizontal: 8 },
  dropdownItem: {
    paddingVertical: 10, paddingHorizontal: 16,
    borderBottomWidth: 1, borderBottomColor: '#EEE',
  },
  dropdownText: { fontSize: 16, color: '#333' },
  selectedItem: { backgroundColor: '#E8EAF6' },
  selectedText: { color: PURPLE, fontWeight: '600' },
  defaultText: { fontWeight: '600' },
  photoPlaceholder: {
    width: '100%', height: 220, backgroundColor: '#FFF',
    borderRadius: 12, borderWidth: 1, borderColor: '#DDD',
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
  },
  photo: { width: '100%', height: '100%', borderRadius: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', marginTop: 16, marginBottom: 8, color: '#333' },
  hostContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 8, padding: 12,
    marginBottom: 16, borderWidth: 1, borderColor: '#DDD',
  },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 12 },
  hostName: { fontSize: 16, flex: 1, color: '#333' },
  addHostsButton: {
    borderWidth: 1, borderColor: PURPLE, paddingHorizontal: 12,
    paddingVertical: 6, borderRadius: 8,
  },
  addHostsText: { color: PURPLE, fontWeight: '500' },
  visibilityContainer: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFF', borderRadius: 8, padding: 12,
    borderWidth: 1, borderColor: '#DDD', marginBottom: 4,
  },
  visibilityText: { fontSize: 16, color: '#333' },
  dropdownList: {
    backgroundColor: '#FFF', borderRadius: 8,
    borderWidth: 1, borderColor: '#DDD', marginBottom: 16,
  },
  broadcastButton: {
    backgroundColor: PURPLE, paddingVertical: 14,
    borderRadius: 8, alignItems: 'center', marginTop: 16,
  },
  broadcastText: { color: '#FFF', fontSize: 16, fontWeight: '600' },

  // 🔽 Modal styles
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center', alignItems: 'center',
  },
  modalBox: {
    backgroundColor: 'white', borderRadius: 12,
    padding: 24, width: '80%', alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20, fontWeight: '700', color: PURPLE,
    marginBottom: 8,
  },
  modalSubtitle: {
    fontSize: 16, color: '#333', marginBottom: 16, textAlign: 'center',
  },
  modalButton: {
    backgroundColor: PURPLE, paddingVertical: 10,
    paddingHorizontal: 20, borderRadius: 8,
  },
  modalButtonText: {
    color: '#FFF', fontWeight: '600', fontSize: 16,
  },
});

