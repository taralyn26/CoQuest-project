import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { db } from '../firebase/config';

export default function Map() {
  const router = useRouter();
  const [selectedQuest, setSelectedQuest] = useState<any>(null);
  const [quests, setQuests] = useState<any[]>([]);
  const [mapCenter, setMapCenter] = useState({ latitude: 0, longitude: 0 });
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const CLOSING_THRESHOLD = 0.0015;

  const stanfordRegion: Region = {
    latitude: 37.4275,
    longitude: -122.1697,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const ref = doc(db, 'users', 'test_user_001');
        const snap = await getDoc(ref);
        if (!snap.exists()) return;
  
        const data = snap.data();
        const display = data.display_quests || [];
        const hosted = data.hosted_quests || [];
        const all = [...display, ...hosted].map((q: any) =>
          typeof q === 'string' ? q : q.id
        );
  
        const now = Date.now() / 1000;
        const results = await Promise.all(
          all.map(async (id) => {
            const questSnap = await getDoc(doc(db, 'quests', id));
            if (!questSnap.exists()) return null;
  
            const quest = questSnap.data();
            const end = quest?.end_time?.seconds;
            const loc = quest?.location;
  
            if (
              typeof end !== 'number' ||
              end <= now ||
              !loc ||
              typeof loc.latitude !== 'number' ||
              typeof loc.longitude !== 'number'
            ) {
              console.log(`⚠️ Skipping quest ${id} due to missing/invalid data`);
              return null;
            }
  
            return { id, ...quest };
          })
        );
  
        const filtered = results.filter(Boolean) as any[];
        console.log('✅ Loaded quests:', filtered.map((q) => q.name));
        setQuests(filtered);
      } catch (err) {
        console.error('❌ Failed to load quests for map:', err);
      }
    };
  
    fetchQuests();
  }, []);
  

  const openPopup = (quest: any) => {
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

  const handleRegionChangeComplete = (region: Region) => {
    setMapCenter({ latitude: region.latitude, longitude: region.longitude });
    if (selectedQuest) {
      const latDiff = Math.abs(region.latitude - selectedQuest.location.latitude);
      const lngDiff = Math.abs(region.longitude - selectedQuest.location.longitude);
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
        showsUserLocation
        showsMyLocationButton={false}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {quests.map((quest) => (
          <Marker
          key={quest.id}
          coordinate={{
            latitude: quest.location.latitude,
            longitude: quest.location.longitude,
          }}
          onPress={() => openPopup(quest)}
        >
          <View style={styles.markerCircle}>
            <Text style={styles.markerText}>{quest.name}</Text>
          </View>
        </Marker>
        
        ))}
      </MapView>

      {selectedQuest && (
        <Animated.View style={[styles.calloutBox, { transform: [{ scale: scaleAnim }] }]}>
          <Image source={require('../../assets/images/mall.png')} style={styles.calloutImage} />
          <View style={styles.calloutContent}>
            <View style={styles.calloutHeader}>
              <Text style={styles.calloutTitle}>{selectedQuest.name}</Text>
              <Pressable onPress={closePopup}>
                <Ionicons name="close" size={20} color="#333" />
              </Pressable>
            </View>

            <Text style={styles.calloutHost}>
              Hosted by {Array.isArray(selectedQuest.host) ? selectedQuest.host[0] : 'Unknown'}
            </Text>

            <Text style={styles.calloutTime}>
              {selectedQuest?.when?.toDate ? new Date(selectedQuest.when.toDate()).toLocaleString() : ''}
            </Text>

            <Text style={styles.calloutDesc}>
              {selectedQuest.description || 'No description provided.'}
            </Text>

            <Pressable
              style={styles.calloutButton}
              onPress={() => {
                closePopup();
                router.push(`/quest/${selectedQuest.id}`);
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
    bottom: 180,
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
  calloutHost: {
    fontSize: 13,
    marginTop: 6,
    color: '#666',
  },
  calloutTime: {
    fontSize: 13,
    color: '#666',
    marginBottom: 8,
  },
  calloutDesc: {
    fontSize: 14,
    marginBottom: 12,
  },
  calloutButton: {
    backgroundColor: PURPLE,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  calloutButtonText: {
    color: 'white',
    fontWeight: '600',
  },
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
  markerCircle: {
    backgroundColor: '#56018D',
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 8,
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  markerText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
    textAlign: 'center',
  },
  
});

