import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const questImage = require('../assets/images/mall.png'); // update if needed

export default function Quest() {
  const router = useRouter();

  return (
    <Pressable onPress={() => router.push('/mockQuests/quest-detail-library')}>
      <View style={styles.card}>
        <View>
          <Image source={questImage} style={styles.image} />
          <View style={styles.dateTag}>
            <Text style={styles.dateText}>Thursday 10:30am</Text>
          </View>
          <View style={styles.hostingTag}>
            <Text style={styles.hostingText}>👑 hosting</Text>
          </View>
        </View>
        <Text style={styles.title}>Mall run</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginRight: 12,
  },
  image: {
    width: 120,
    height: 120,
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
    fontSize: 14,
    fontWeight: 'bold',
  },
});


