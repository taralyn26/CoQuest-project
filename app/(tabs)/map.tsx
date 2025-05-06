// app/(tabs)/map.tsx
import React from 'react';
import { StyleSheet, View, Pressable, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useRouter } from 'expo-router';

export default function Map() {
  const router = useRouter();

  const stanfordRegion: Region = {
    latitude: 37.4275,
    longitude: -122.1697,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={stanfordRegion}
        showsUserLocation={true}
        showsMyLocationButton={false} // 👈 Hides the default recenter button
      />

      {/* Custom Create Quest Button */}
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
