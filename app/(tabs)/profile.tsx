import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const hostAvatar = require('../../assets/images/pic.png');
const badgeImage = require('../../assets/images/host.png');
const badgeImage2 = require('../../assets/images/compass.jpg');
const badgeImage5 = require('../../assets/images/questionmark.jpeg');

// Badge data
const badgeList = [
  {
    title: 'Host',
    description: "You've hosted 3 quests!",
    image: badgeImage,
    locked: false,
  },
  {
    title: 'Connector',
    description: 'You’ve invited 5 friends to join quests!',
    image: badgeImage2,
    locked: false,
  },
  {
    title: 'Explorer',
    description: 'You’ve joined 10 different types of quests!',
    locked: false,
  },
  {
    title: 'Legend',
    description: 'Host 10 quests to earn this badge.',
    locked: false,
    progress: 0.65,
  },
  {
    title: 'Mystery',
    description: 'Complete 5 secret quests to unlock this badge.',
    image: badgeImage5,
    locked: true,
  },
  {
    title: 'Secret Quest',
    description: 'Find and complete a hidden quest on campus.',
    image: badgeImage5,
    locked: true,
  },
];

const mockGroups = [
  { name: 'Study Buddies', members: ['Isaias', 'Jad', 'Aya'] },
  { name: 'party people', members: ['Emi', 'Varsha', '+5'] },
  { name: 'All Friends', members: ['Nico', 'Yujina', '+50'] },
];

export default function Profile() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);

  const toggleExpand = (name: string) => {
    setExpanded(expanded === name ? null : name);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.purpleBackground} />
        <View style={styles.curve} />
        <Image source={hostAvatar} style={styles.profileImage} />
      </View>

      <Text style={styles.title}>Taralyn Nguyen</Text>
      <Text style={styles.user}>@taralyn</Text>

      {/* COMMUNITY CARD */}
      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <View style={styles.card}>
          <TouchableOpacity
            onPress={() => toggleExpand('Stanford Community')}
            style={styles.cardHeader}
          >
            <View>
              <Text style={styles.groupName}>Stanford Community 🌲</Text>
              <Text style={styles.memberCount}>1902 members</Text>
            </View>
            <Text style={{ fontSize: 20 }}>
              {expanded === 'Stanford Community' ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {expanded === 'Stanford Community' && (
            <View style={styles.cardBody}>
              <View style={styles.memberRow}>
                {['Aya', 'Isa', '+1900'].map((m, i) => (
                  <View key={i} style={styles.chip}>
                    <Text style={styles.chipText}>{m}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* GROUPS */}
      <Text style={styles.sectionTitle}>Recent Groups:</Text>
      <View style={{ paddingHorizontal: 16 }}>
        {mockGroups.map((group, idx) => (
          <View key={idx} style={styles.card}>
            <TouchableOpacity
              onPress={() => toggleExpand(group.name)}
              style={styles.cardHeader}
            >
              <View>
                <Text style={styles.groupName}>{group.name}</Text>
                <Text style={styles.memberCount}>{group.members.length} members</Text>
              </View>
              <Text style={{ fontSize: 20 }}>{expanded === group.name ? '▲' : '▼'}</Text>
            </TouchableOpacity>

            {expanded === group.name && (
              <View style={styles.cardBody}>
                <View style={styles.memberRow}>
                  {group.members.map((m, i) => (
                    <View key={i} style={styles.chip}>
                      <Text style={styles.chipText}>{m}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        ))}
      </View>
      <TouchableOpacity
        style={styles.manageButton}
        onPress={() => router.push('/manage-groups')}
      >
        <Text style={styles.manageButtonText}>Manage Groups</Text>
      </TouchableOpacity>

      
    
      {/* HOSTED QUESTS */}
<Text style={styles.sectionTitle}>Hosted Quests:</Text>
<ScrollView
  horizontal
  showsHorizontalScrollIndicator={false}
  contentContainerStyle={styles.questScroll}
>
  {[
    
    {
      id: '1',
      title: 'Library Cram Session',
      time: 'Saturday 10:30am',
      host: 'You',
      image: require('../../assets/images/Stanford_University_Green_Library_Bing_Wing.jpg'),
      route: '/mockQuests/quest-detail-library',
    },
  ].map((quest) => (
    <Pressable
      key={quest.id}
      style={{ marginRight: 12 }}
      onPress={() => router.push(quest.route)}
    >
      <View style={{ width: 160 }}>
        <View style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', marginBottom: 6 }}>
          <Image source={quest.image} style={{ width: 160, height: 120, resizeMode: 'cover' }} />
          <View
            style={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: '#3366FF',
              borderRadius: 4,
              paddingHorizontal: 6,
              paddingVertical: 2,
            }}
          >
            <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '600' }}>{quest.time}</Text>
          </View>
        </View>
        <Text style={{ fontWeight: '600', fontSize: 16 }}>{quest.title}</Text>
        <Text style={{ fontSize: 12, color: '#888' }}>👑 {quest.host} hosting</Text>
      </View>
    </Pressable>
  ))}
</ScrollView>



      {/* BADGES */}
      <Text style={styles.sectionTitle}>My Badges:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.questScroll}
      >
        {badgeList.map((badge, idx) => (
          <TouchableOpacity key={idx} onPress={() => setSelectedBadge(badge)}>
            <View style={[styles.badgeCard, badge.locked && styles.locked]}>
              <Image source={badge.image} style={styles.badgeImage} />
              <Text style={styles.badgeTitle}>{badge.title}</Text>
              {badge.progress !== undefined && (
                <View style={styles.progressBarBackground}>
                  <View style={[styles.progressBarFill, { width: `${badge.progress * 100}%` }]} />
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* MODAL */}
      <Modal
        visible={!!selectedBadge}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedBadge(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalContent}>
            <Pressable style={styles.modalClose} onPress={() => setSelectedBadge(null)}>
              <Text style={{ fontSize: 18 }}>✕</Text>
            </Pressable>
            {selectedBadge && (
              <>
                <Image source={selectedBadge.image} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedBadge.title}</Text>
                <Text style={styles.modalDescription}>{selectedBadge.description}</Text>
              </>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { paddingBottom: 40 },
  header: {
    position: 'relative',
    width: '100%',
    height: 240,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  purpleBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#56018D',
    zIndex: 1,
  },
  curve: {
    position: 'absolute',
    bottom: 0,
    width: width,
    height: 100,
    backgroundColor: 'white',
    borderTopLeftRadius: width / 2,
    borderTopRightRadius: width / 2,
    zIndex: 2,
  },
  profileImage: {
    position: 'absolute',
    bottom: 30,
    width: 150,
    height: 150,
    borderRadius: 100,
    zIndex: 3,
    borderWidth: 4,
    borderColor: 'white',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 18,
  },
  user: {
    fontSize: 12,
    textAlign: 'center',
    marginVertical: 4,
    marginBottom: 8,
    color: 'gray',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  manageButton: {
    marginTop: 20,
    alignSelf: 'center',
    backgroundColor: '#56018D',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 999,
  },
  manageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  questScroll: {
    paddingVertical: 12,
    paddingLeft: 16,
  },
  questCard: {
    alignItems: 'center',
    marginRight: 12,
  },
  badgeCard: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 10,
    marginRight: 12,
    width: 100,
    elevation: 2,
  },
  badgeImage: {
    width: 50,
    height: 50,
    marginBottom: 6,
    resizeMode: 'contain',
  },
  badgeTitle: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  locked: {
    opacity: 0.3,
  },
  progressBarBackground: {
    marginTop: 6,
    height: 4,
    width: '100%',
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  progressBarFill: {
    height: 4,
    backgroundColor: '#56018D',
    borderRadius: 2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 280,
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  modalImage: {
    width: 70,
    height: 70,
    marginBottom: 12,
    resizeMode: 'contain',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    padding: 12,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupName: {
    fontSize: 16,
    fontWeight: '600',
  },
  memberCount: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  cardBody: {
    marginTop: 10,
  },
  memberRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    color: '#333',
  },
});
