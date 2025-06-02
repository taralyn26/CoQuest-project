import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { addDoc, arrayUnion, collection, doc, getDoc, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { auth, db } from '../firebase/config';


const PURPLE = '#56018D';
const LIGHTGRAY = '#F2F7FD';

export default function NewQuest() {
  const router = useRouter();
  const [description, setDescription] = useState('');
  const [quest, setQuest] = useState('');
  const [location, setLocation] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [whenOption, setWhenOption] = useState<'now' | 'pickTime'>('now');
  const [timeDropdown, setTimeDropdown] = useState(false);
  const [pickedTime, setPickedTime] = useState('Select time');
  const [durationOption, setDurationOption] = useState<'30' | '60' | 'custom'>('30');
  const [customDuration, setCustomDuration] = useState('');
  const [customDurationVisible, setCustomDurationVisible] = useState(false);
  const [photoAdded, setPhotoAdded] = useState(false);
  const [visibility, setVisibility] = useState('All Campus');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userGroups, setUserGroups] = useState<{ id: string; name: string }[]>([]);

  const hostAvatar = require('../../assets/images/pic.png');
  const currentUser = auth.currentUser;
  const email = currentUser.displayName || currentUser.email || currentUser.uid;
  const [description, setDescription] = useState('');

  // const pre_hostName = email.split('@')[0];
  // const hostName = pre_hostName.charAt(0).toUpperCase() + pre_hostName.slice(1);
  const hostName = (email.split('@')[0] || '').toLowerCase();


  useEffect(() => {
    const fetchUserGroups = async () => {
      try {
        const userRef = doc(db, 'flp_names', hostName);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) return;

        const data = userSnap.data();
        const groupIds: string[] = data.groups || [];

        const groupDocs = await Promise.all(
          groupIds.map(async (id) => {
            const groupRef = doc(db, 'groups', id);
            const groupSnap = await getDoc(groupRef);
            if (groupSnap.exists()) {
              const groupData = groupSnap.data();
              return { id, name: groupData.name || id };
            }
            return null;
          })
        );

        setUserGroups(groupDocs.filter(Boolean) as { id: string; name: string }[]);
      } catch (err) {
        console.error('Error fetching group names:', err);
      }
    };

    fetchUserGroups();
  }, []);

  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((word) => word[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  
  const initials = getInitials(hostName);
  const avatarColor = ['#FFD166', '#06D6A0', '#EF476F', '#118AB2', '#8338EC'][
    Math.floor(Math.random() * 5)
  ];

  const whenOptions = [
    { key: 'now', label: 'Now' },
    { key: 'pickTime', label: 'Select time' },
  ];

  const times = Array.from({ length: 48 }).map((_, i) => {
    const hour = Math.floor(i / 2);
    const minute = i % 2 ? '30' : '00';
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    const ampm = hour < 12 ? 'AM' : 'PM';
    return `${displayHour}:${minute} ${ampm}`;
  });

  const fetchLocationSuggestions = async () => {
    if (!location) return;

    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete.php?key=pk.7f060c5daf66db53424ea6be3f65b9f7&q=${encodeURIComponent(location)}&format=json`
      );
      const data = await res.json();
      setSuggestions(data);
    } catch (error) {
      console.error('LocationIQ Error:', error);
      setSuggestions([]);
    }
  };

  const handleBroadcast = async () => {
    if (!quest || !location) {
      Alert.alert('Missing Fields', 'Please provide a quest name and location.');
      return;
    }

    try {
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete.php?key=pk.7f060c5daf66db53424ea6be3f65b9f7&q=${encodeURIComponent(location)}&format=json`
      );
      const locationData = await res.json();
      const coordinates = {
        latitude: parseFloat(locationData[0].lat),
        longitude: parseFloat(locationData[0].lon),
      };

      let startTime = new Date();
      if (whenOption === 'pickTime' && pickedTime !== 'Select time') {
        const [timeStr, ampm] = pickedTime.split(' ');
        let [hourStr, minuteStr] = timeStr.split(':');
        let hour = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        if (ampm === 'PM' && hour !== 12) hour += 12;
        if (ampm === 'AM' && hour === 12) hour = 0;
        startTime.setHours(hour, minute, 0, 0);
      }

      const duration = durationOption === 'custom'
        ? parseInt(customDuration)
        : parseInt(durationOption);
      const endTime = new Date(startTime.getTime() + duration * 60000);

      let numInGroup = 0;
      let uniqueGroupID = '';

      if (visibility === 'All Campus') {
        numInGroup = 0;
        uniqueGroupID = 'All Campus';
      } else {
        const matchedGroup = userGroups.find(g => g.name === visibility);
        if (matchedGroup) {
          uniqueGroupID = matchedGroup.id;
          const groupRef = doc(db, 'groups', matchedGroup.id);
          const groupSnap = await getDoc(groupRef);
          if (groupSnap.exists()) {
            const groupData = groupSnap.data();
            const memberHandles = groupData.memberHandles || [];
            numInGroup = memberHandles.length;
          }
        }
      }


      const questRef = await addDoc(collection(db, 'quests'), {
        name: quest,
        location: coordinates,
        groupid: visibility,
        unique_group_ID: uniqueGroupID,
        host: [hostName],
        when: Timestamp.fromDate(startTime),
        end_time: Timestamp.fromDate(endTime),
        num_in_group: numInGroup,
        attendees: [hostName],
        description: description,
      });
      
      


      const userRef = doc(db, 'flp_names', hostName);
      console.log('Updating host:', hostName, 'with quest ID:', questRef.id);
      await updateDoc(userRef, {
        hosted_quests: arrayUnion(questRef.id),
      });
      if (visibility !== 'All Campus') {
        try {
          console.log('Visibility is restricted to group:', visibility);
          const matchedGroup = userGroups.find(g => g.name === visibility);
        if (!matchedGroup) {
          console.warn('No matching group found for name:', visibility);
          return;
        }
        const groupRef = doc(db, 'groups', matchedGroup.id);
          const groupSnap = await getDoc(groupRef);
      
          if (groupSnap.exists()) {
            const groupData = groupSnap.data();
            const memberHandles = groupData.memberHandles || [];
      
            console.log('Fetched group members:', memberHandles);
      
            await Promise.all(
              memberHandles.map(async (handle: string) => {
                const capitalizedHandle = handle.charAt(0).toUpperCase() + handle.slice(1);
                const memberRef = doc(db, 'flp_names', capitalizedHandle);
      
                console.log(`Updating member: ${capitalizedHandle} with quest ID: ${questRef.id}`);
      
                await updateDoc(memberRef, {
                  display_quests: arrayUnion(questRef.id),
                });
              })
            );
      
            console.log('Successfully updated all group members with quest ID.');
          } else {
            console.warn('Group document not found:', visibility);
          }
        } catch (err) {
          console.error('Error updating display_quests for group members:', err);
        }
      }

      Alert.alert('Quest Posted!', 'Your quest has been broadcast.');
      router.push('/(tabs)/map');
    } catch (error) {
      console.error('Broadcast Error:', error);
      Alert.alert('Error', 'Failed to broadcast your quest. Please try again.');
    }
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
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
          placeholder="Add more context or details about your quest..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={4}
          value={description}
          onChangeText={setDescription}
        />
          <Text style={styles.label}>Where</Text>
          <View style={styles.locationRow}>
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
            <Pressable style={styles.inlineSearchButton} onPress={fetchLocationSuggestions}>
              <Ionicons name="search" size={18} color="white" />
            </Pressable>
          </View>

        {suggestions.length > 0 && (
          <View style={styles.dropdownList}>
            {suggestions.map((item) => (
              <Pressable
                key={item.place_id}
                style={styles.dropdownItem}
                onPress={() => {
                  setLocation(item.display_name);
                  setSuggestions([]);
                }}
              >
                <Text style={styles.dropdownText}>{item.display_name}</Text>
              </Pressable>
            ))}
          </View>
        )}

        <Text style={styles.label}>When</Text>
        <View style={styles.optionRowEven}>
          {whenOptions.map(opt => (
            <Pressable
              key={opt.key}
              style={[
                styles.optionButtonEven,
                whenOption === opt.key && styles.optionButtonSelected,
              ]}
              onPress={() => {
                setWhenOption(opt.key);
                setTimeDropdown(opt.key === 'pickTime');
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  whenOption === opt.key && styles.optionTextSelected,
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

        <Text style={styles.label}>Duration</Text>
        <View style={styles.optionRowEvenThree}>
          {['30', '60', 'custom'].map(opt => (
            <Pressable
              key={opt}
              style={[
                styles.optionButtonEvenThree,
                durationOption === opt && styles.optionButtonSelected,
              ]}
              onPress={() => {
                setDurationOption(opt as any);
                setCustomDurationVisible(opt === 'custom');
              }}
            >
              <Text
                style={[
                  styles.optionText,
                  durationOption === opt && styles.optionTextSelected,
                ]}
              >
                {opt === 'custom' ? 'Enter duration' : `${opt} min`}
              </Text>
            </Pressable>
          ))}
        </View>

        {customDurationVisible && (
          <TextInput
            style={styles.input}
            placeholder="Enter duration in minutes"
            keyboardType="numeric"
            value={customDuration}
            onChangeText={setCustomDuration}
          />
        )}

        <Text style={styles.sectionTitle}>Hosted by</Text>
        <View style={styles.hostContainer}>
        <View style={[styles.avatarCircle, { backgroundColor: avatarColor }]}>
          <Text style={styles.avatarInitials}>{initials}</Text>
        </View>
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
              {['All Campus', ...userGroups.map(g => g.name)].map((g) => (
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
    position: 'absolute',
    top: 16,
    left: 16,
    zIndex: 10,
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
  optionRowEven: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionButtonEven: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  optionRowEvenThree: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  optionButtonEvenThree: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
  },
  optionButtonSelected: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  optionText: {
    color: '#333',
  },
  optionTextSelected: {
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
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitials: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  searchButton: {
    backgroundColor: PURPLE,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginBottom: 16,
    elevation: 2, // subtle shadow on Android
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    paddingHorizontal: 12,
    height: 44,
  },
  locationInput: {
    flex: 1,
    marginLeft: 8,
    height: 44,
    color: '#333',
  },
  inlineSearchButton: {
    marginLeft: 8,
    backgroundColor: PURPLE,
    padding: 10,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    height: 44,
    width: 44,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  
});
