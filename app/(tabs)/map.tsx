// app/(tabs)/map.tsx
import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Text,
  Image,
  Animated,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Region } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Map() {
  const router = useRouter();
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [mapCenter, setMapCenter] = useState({ latitude: 0, longitude: 0 });
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const CLOSING_THRESHOLD = 0.0015; // degrees of lat/lng

  const stanfordRegion: Region = {
    latitude: 37.4275,
    longitude: -122.1697,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const mockQuests = [
    {
      id: '1',
      title: 'Library Cram Session',
      coordinate: { latitude: 37.42689, longitude: -122.16678 },
      route: '/mockQuests/quest-detail-library',
      image: require('../../assets/images/Stanford_University_Green_Library_Bing_Wing.jpg'),
      description: 'Study session before midterms at Green Library!',
      time: 'Friday, May 9 • 10:30am',
      host: 'You',
      happeningNow: false,
    },
    {
      id: '2',
      title: 'Wilbur Dinner',
      coordinate: { latitude: 37.42415, longitude: -122.16301 },
      route: '/mockQuests/quest-detail-wilbur',
      image: require('../../assets/images/Wilbur-Dining-Hall.webp'),
      description: 'Wilbur dinner! (they have sesame chicken today!)',
      time: 'Thursday, May 8 • 5:00pm',
      host: 'Wilbur Crew',
      happeningNow: false,
    },
    {
      id: '3',
      title: 'Mall Run',
      coordinate: { latitude: 37.443556450311306, longitude: -122.17098481863421},
      route: '/mockQuests/quest-detail-mall',
      image: require('../../assets/images/aritzia.png'),
      description: 'I want to hit Aritzia and maybe grab some food at Joe & the Juice! I was planning on biking and leaving at 10:15 from the Oval!',
      time: 'Friday, May 9 • 1pm',
      host: 'Aya',
      happeningNow: false,
    },
    {
      id: '4',
      title: 'Oval Chill',
      coordinate: { latitude: 37.43033428584338, longitude: -122.16938113218649 },
      route: '/mockQuests/quest-detail-oval',
      image: require('../../assets/images/oval.jpg'), // Replace with actual asset path
      description: 'Chilling on the Oval with a blanket, snacks, and music. Come vibe, play frisbee, or just hang out in the sun!',
      time: 'Thursday, May 8 • 2:00pm – 4:00pm',
      host: 'Isaias',
      happeningNow: true,
    },
    {
      id: '5',
      title: 'Fountain Hop 🌀',
      coordinate: { latitude: 37.42611799496791, longitude: -122.17337613033567 },
      route: '/mockQuests/quest-detail-fountain',
      image: require('../../assets/images/fountain-hop.jpeg'),
      description: 'It’s warm, we’re bored, and we’ve got towels. Starting at the Claw and seeing how many we can hit. Bring flip-flops, your best chaos energy, and maybe a speaker?',
      time: 'Thursday, May 8 • 7:00pm – 8:30pm',
      host: 'Isaias',
      happeningNow: false,
    },
    {
      id: '6',
      title: 'Tennis Hitaround 🎾',
      coordinate: { latitude: 37.42546996347623, longitude: -122.18266330753647 },
      route: '/mockQuests/quest-detail-tennis',
      image: require('../../assets/images/tennis.jpg'),
      description: 'Nothing serious—just bringing rackets and hitting some balls around. All levels welcome, come rally or just chill courtside!',
      time: 'Thursday, May 8 • 6:00pm – 8:00pm',
      host: 'Taralyn',
      happeningNow: false,
    },
    {
      id: '7',
      title: 'Pickup Soccer ⚽️',
      coordinate: { latitude: 37.426375105086144, longitude: -122.17578990940434 }, // Approx. Roble Field, Stanford
      route: '/mockQuests/quest-detail-soccer',
      image: require('../../assets/images/soccer.avif'),
      description: 'Super chill pickup game on Roble Field. Come run around or just kick for fun—no pressure! We’ve got a ball and some cones. Just bring yourself and maybe water.',
      time: 'Friday, May 9 • 12:30pm – 2:00pm',
      host: 'Emi',
      happeningNow: false,
    },
    {
      id: '8',
      title: 'S’mores & Chill 🔥',
      coordinate: { latitude: 37.42626383533444, longitude: -122.15724181475235 },
      route: '/mockQuests/quest-detail-smores',
      image: require('../../assets/images/smores.jpg'),
      description: 'Bringing marshmallows, chocolate, and grahams to the EVGR B fireplace! Come hang, roast a few, and vibe by the flames. Extra sticks provided 🔥',
      time: 'Thursday, May 8 • 8:00pm – 9:30pm',
      host: 'Aya',
      happeningNow: false,
    },    
    
  ];

  const openPopup = (quest) => {
    setSelectedQuest(quest);
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const closePopup = () => {
    Animated.timing(scaleAnim, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }).start(() => setSelectedQuest(null));
  };

  const handleRegionChangeComplete = (region) => {
    setMapCenter({ latitude: region.latitude, longitude: region.longitude });
    if (selectedQuest) {
      const latDiff = Math.abs(region.latitude - selectedQuest.coordinate.latitude);
      const lngDiff = Math.abs(region.longitude - selectedQuest.coordinate.longitude);
      if (latDiff > CLOSING_THRESHOLD || lngDiff > CLOSING_THRESHOLD) {
        closePopup();
      }
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={stanfordRegion}
        showsUserLocation={true}
        showsMyLocationButton={false}
        onRegionChangeComplete={handleRegionChangeComplete} // Close popup if moved far
      >
        {mockQuests.map((quest) => (
          <Marker
            key={quest.id}
            coordinate={quest.coordinate}
            onPress={() => openPopup(quest)}
          >
            <View style={styles.customMarker}>
              <Image source={quest.image} style={styles.markerImage} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Stationary Popup Above Marker */}
      {selectedQuest && (
        <Animated.View style={[styles.calloutBox, { transform: [{ scale: scaleAnim }] }]}>
          <Image source={selectedQuest.image} style={styles.calloutImage} />
          <View style={styles.calloutContent}>
            <View style={styles.calloutHeader}>
              <Text style={styles.calloutTitle}>{selectedQuest.title}</Text>
              <Pressable onPress={closePopup}>
                <Ionicons name="close" size={20} color="#333" />
              </Pressable>
            </View>

            {selectedQuest.happeningNow && (
              <Text style={styles.nowBadge}>Happening Now</Text>
            )}

            <Text style={styles.calloutHost}>Hosted by {selectedQuest.host}</Text>
            <Text style={styles.calloutTime}>{selectedQuest.time}</Text>
            <Text style={styles.calloutDesc}>{selectedQuest.description}</Text>

            <Pressable
              style={styles.calloutButton}
              onPress={() => {
                closePopup();
                router.push(selectedQuest.route);
              }}
            >
              <Text style={styles.calloutButtonText}>View Details</Text>
            </Pressable>
          </View>
        </Animated.View>
      )}

      <Pressable
        style={styles.fab}
        onPress={() => router.push('/(tabs)/new-quest')}
      >
        <Text style={styles.fabText}>+ Quest</Text>
      </Pressable>
    </View>
  );
}

const PURPLE = '#56018D';

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  customMarker: {
    width: 50,
    height: 50,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: PURPLE,
    backgroundColor: '#FFF',
  },
  markerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  calloutBox: {
    position: 'absolute',
    bottom: 180, // Raised above marker
    left: 20,
    right: 20,
    backgroundColor: '#FFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    overflow: 'hidden',
  },
  calloutImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  calloutContent: {
    padding: 12,
  },
  calloutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  nowBadge: {
    backgroundColor: PURPLE,
    color: 'white',
    fontSize: 12,
    alignSelf: 'flex-start',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 6,
    marginTop: 6,
    fontWeight: '600',
  },
  calloutHost: { fontSize: 13, marginTop: 6, color: '#666' },
  calloutTime: { fontSize: 13, color: '#666', marginBottom: 8 },
  calloutDesc: { fontSize: 14, marginBottom: 12 },
  calloutButton: {
    backgroundColor: PURPLE,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  calloutButtonText: { color: 'white', fontWeight: '600' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: PURPLE,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 50,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  fabText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
