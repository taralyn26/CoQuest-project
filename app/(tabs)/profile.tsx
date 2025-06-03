import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useMemo, useState } from 'react';
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
import Quest from '../../components/Quest';
import { app, db } from '../firebase/config';

const auth = getAuth(app);
const { width } = Dimensions.get('window');
const PURPLE = '#56018D';

const badgeImage = require('../../assets/images/host.png');
const badgeImage2 = require('../../assets/images/compass.jpg');
const badgeImage3 = require('../../assets/images/crown.png');
const badgeImage4 = require('../../assets/images/adventure.webp');
const badgeImage5 = require('../../assets/images/questionmark.jpeg');

const badgeList = [
  { title: 'Host', description: "You've hosted 3 quests!", image: badgeImage, locked: false },
  { title: 'Connector', description: 'You’ve invited 5 friends to join quests!', image: badgeImage2, locked: false },
  { title: 'Explorer', description: 'You’ve joined 10 different types of quests!', image: badgeImage4, locked: false },
  { title: 'Legend', description: 'Host 10 quests to earn this badge.', image: badgeImage3, locked: false, progress: 0.65 },
  { title: 'Mystery', description: 'Complete 5 secret quests to unlock this badge.', image: badgeImage5, locked: true },
  { title: 'Secret Quest', description: 'Find and complete a hidden quest on campus.', image: badgeImage5, locked: true },
];

export default function Profile() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);
  const [selectedBadge, setSelectedBadge] = useState<any>(null);
  const [fullName, setFullName] = useState('');
  const [handle, setHandle] = useState('');
  const [hostedQuests, setHostedQuests] = useState<any[]>([]);
  const [userGroups, setUserGroups] = useState<{ name: string; members: string[] }[]>([]);

  const toggleExpand = (name: string) => {
    setExpanded(expanded === name ? null : name);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word[0]?.toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const initials = useMemo(() => {
    if (!fullName) return '';
    const result = getInitials(fullName);
    console.log('✅ Initials computed:', result);
    return result;
  }, [fullName]);

  const randomColor = ['#FFD166', '#06D6A0', '#EF476F', '#118AB2', '#8338EC'][Math.floor(Math.random() * 5)];

  useEffect(() => {
    const fetchProfileAndQuests = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const email = user.email || '';
      const pre_handlePart = email.split('@')[0];
      //const handlePart = pre_handlePart.charAt(0).toUpperCase() + pre_handlePart.slice(1);
      const handlePart = pre_handlePart.toLowerCase();

      //console.log('🔠 Capitalized handlePart:', handlePart);

      try {
        const profileRef = doc(db, 'flp_names', handlePart);
        const profileSnap = await getDoc(profileRef);

        if (profileSnap.exists()) {
          const profileData = profileSnap.data();
          console.log('📄 Profile data:', profileData);
          setFullName(`${profileData.first_name} ${profileData.last_name}`);
          setHandle(profileData['@']);

          // Fetch group IDs and resolve from 'groups' collection
          const groupIds = Array.isArray(profileData.groups) ? profileData.groups.slice(0, 3) : [];
          console.log('🆔 Group IDs from flp_names:', groupIds);

          const groupDocs = await Promise.all(
            groupIds.map(async (id: string) => {
              const snap = await getDoc(doc(db, 'groups', id));
              if (!snap.exists()) return null;
              const group = snap.data();
              return { name: group.name, members: group.members || [] };
            })
          );

          const validGroups = groupDocs.filter(Boolean);
          console.log('📘 Loaded groups:', validGroups);
          setUserGroups(validGroups);
        } else {
          console.warn('⚠️ Profile not found in flp_names');
        }

        const userRef = doc(db, 'users', handlePart);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          console.warn('⚠️ User data not found in users');
          return;
        }

        const userData = userSnap.data();
        const hosted = userData.hosted_quests || [];
        console.log('📚 Hosted quest IDs:', hosted);

        const quests = await Promise.all(
          hosted.map(async (q: any) => {
            const id = typeof q === 'string' ? q : q.id;
            const snap = await getDoc(doc(db, 'quests', id));
            if (!snap.exists()) return null;
            const quest = snap.data();
            return { id, ...quest };
          })
        );

        const valid = quests.filter(Boolean) as { id: string; end_time?: { seconds: number } }[];
        valid.sort((a, b) => (a.end_time?.seconds ?? 0) - (b.end_time?.seconds ?? 0));
        setHostedQuests(valid);
        console.log('✅ Valid hosted quests:', valid);
      } catch (err) {
        console.error('❌ Error in fetchProfileAndQuests:', err);
      }
    };

    fetchProfileAndQuests();
  }, []);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <View style={styles.purpleBackground} />
        <View style={styles.curve} />
        <View style={[styles.initialsCircle, { backgroundColor: randomColor }]}>
          {fullName ? (
            <Text style={styles.initialsText}>{initials}</Text>
          ) : (
            <Text style={styles.initialsText}>?</Text>
          )}
        </View>
      </View>

      <Text style={styles.title}>{fullName}</Text>
      <Text style={styles.user}>@{handle}</Text>

      <Text style={styles.sectionTitle}>Recent Groups:</Text>
      <View style={{ paddingHorizontal: 16 }}>
        {userGroups.map((group, idx) => (
          <View key={idx} style={styles.card}>
            <TouchableOpacity onPress={() => toggleExpand(group.name)} style={styles.cardHeader}>
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

      <TouchableOpacity style={styles.manageButton} onPress={() => router.push('/manage-groups')}>
        <Text style={styles.manageButtonText}>Manage Groups</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>Hosted Quests:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.questScroll}>
        {hostedQuests.map((q) => (
          <View key={q.id} style={styles.questCard}>
            <Quest id={q.id} from="profile" />
          </View>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>My Badges:</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.questScroll}>
        {badgeList.map((badge, idx) => (
          <TouchableOpacity key={idx} onPress={() => setSelectedBadge(badge)}>
            <View style={[styles.badgeCard, badge.locked && styles.locked]}>
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

      <Modal visible={!!selectedBadge} transparent animationType="fade" onRequestClose={() => setSelectedBadge(null)}>
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

// styles (unchanged from previous version)
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
    backgroundColor: PURPLE,
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
  initialsCircle: {
    position: 'absolute',
    bottom: 30,
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    borderWidth: 4,
    borderColor: 'white',
  },
  initialsText: {
    fontSize: 42,
    color: 'white',
    fontWeight: 'bold',
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
    backgroundColor: PURPLE,
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
    backgroundColor: PURPLE,
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
