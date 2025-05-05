// app/(tabs)/new-quest.tsx

import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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

// Visibility groups
const GROUPS = ['Study Buddies', 'Party People'];

export default function NewQuest() {
  const [quest, setQuest] = useState('');
  const [location, setLocation] = useState('');
  const [whenOption, setWhenOption] = useState<'now' | 'in30' | 'pickTime'>('now');
  const [timeDropdown, setTimeDropdown] = useState(false);
  const [pickedTime, setPickedTime] = useState('Select time');
  const [photoAdded, setPhotoAdded] = useState(false);
  const [visibility, setVisibility] = useState('All Campus');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const hostAvatar = require('../../assets/images/pic.png'); 
  const hostName = 'Taralyn';

  const whenOptions = [
    { key: 'now', label: 'Now' },
    { key: 'in30', label: 'In 30 min' },
    { key: 'pickTime', label: 'Pick Time' },
  ];

  // Generate 30-minute increments
  const times = Array.from({ length: 48 }).map((_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 ? '30' : '00';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${displayHour}:${minute} ${ampm}`;
  });

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Back Button */}
        <Pressable style={styles.back} onPress={() => { /* TODO */ }}>
          <Ionicons name="arrow-back" size={24} color={styles.header.color} />
        </Pressable>

        {/* Header */}
        <Text style={styles.header}>New Quest</Text>

        {/* Quest Input */}
        <Text style={styles.label}>What's your quest?</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. Quick lunch @ Treehouse"
          placeholderTextColor="#999"
          value={quest}
          onChangeText={setQuest}
        />

        {/* Location Input */}
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

        {/* When Picker */}
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

        {/* Cover Photo */}
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

        {/* Hosted By */}
        <Text style={styles.sectionTitle}>Hosted by</Text>
        <View style={styles.hostContainer}>
          <Image source={hostAvatar} style={styles.avatar} />
          <Text style={styles.hostName}>{hostName}</Text>
          <Pressable style={styles.addHostsButton}>
            <Text style={styles.addHostsText}>+ Add CoHosts</Text>
          </Pressable>
        </View>

        {/* Visibility Dropdown */}
        <Text style={styles.sectionTitle}>Who can see this</Text>
        <View>
          <Pressable
            style={styles.visibilityContainer}
            onPress={() => setDropdownOpen(!dropdownOpen)}
          >
            <Ionicons
              name="people-sharp"
              size={20}
              color="#333"
              style={{ marginRight: 8 }}
            />
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

        {/* Broadcast Button */}
        <Pressable style={styles.broadcastButton} onPress={() => { /* TODO */ }}>
          <Text style={styles.broadcastText}>Broadcast My Quest!</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const PURPLE = '#56018D';
const LIGHTGRAY = '#F2F7FD';

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
    position: 'absolute',
    top: 16,
    left: 16,
  },
  header: {
    alignSelf: 'center',
    marginTop: 16,
    marginBottom: 24,
    fontSize: 24,
    fontWeight: '700',
    color: PURPLE,
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
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  locationInput: {
    flex: 1,
    height: 44,
    color: '#333',
  },
  whenContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  whenButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  whenButtonSelected: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  whenText: {
    color: '#333',
  },
  whenTextSelected: {
    color: '#FFF',
  },
  dropdownListLarge: {
    maxHeight: 200,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 16,
  },
  timeScroll: {
    paddingHorizontal: 8,
  },
  dropdownItem: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  selectedItem: {
    backgroundColor: '#E8EAF6',
  },
  selectedText: {
    color: PURPLE,
    fontWeight: '600',
  },
  defaultText: {
    fontWeight: '600',
  },
  photoPlaceholder: {
    width: '100%',
    height: 220,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
    color: '#333',
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  hostName: {
    fontSize: 16,
    flex: 1,
    color: '#333',
  },
  addHostsButton: {
    borderWidth: 1,
    borderColor: PURPLE,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addHostsText: {
    color: PURPLE,
    fontWeight: '500',
  },
  visibilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 4,
  },
  visibilityText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownList: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 16,
  },
  broadcastButton: {
    backgroundColor: PURPLE,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  broadcastText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
 