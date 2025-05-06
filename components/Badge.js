import React, { useState } from 'react';
import {
    Dimensions,
    Image,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function Badge({
  image = require('../assets/images/host.png'),
  title = 'Host',
  description = "You've hosted 3 quests!",
}) {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Badge preview (small rectangle) */}
      <TouchableOpacity onPress={() => setVisible(true)} style={styles.badgeBox}>
        <Image source={image} style={styles.badgeIcon} />
        <Text style={styles.badgeTitle}>{title}</Text>
      </TouchableOpacity>

      {/* Fullscreen Popup */}
      <Modal visible={visible} transparent animationType="fade">
        <View style={styles.modalBackground}>
          <View style={styles.modalCard}>
            <Pressable style={styles.closeButton} onPress={() => setVisible(false)}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
            <Image source={image} style={styles.modalImage} />
            <Text style={styles.modalTitle}>{title}</Text>
            <Text style={styles.modalDescription}>{description}</Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  badgeBox: {
    width: 100,
    height: 120,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  badgeIcon: {
    width: 50,
    height: 50,
    marginBottom: 6,
    resizeMode: 'contain',
  },
  badgeTitle: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: width * 0.8,
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 14,
    zIndex: 2,
  },
  closeText: {
    fontSize: 20,
    color: 'black',
  },
  modalImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  modalDescription: {
    fontSize: 14,
    textAlign: 'center',
    color: '#555',
  },
});
