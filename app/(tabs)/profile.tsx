import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Badge from '../../components/Badge';
import Quest from '../../components/Quest';

const { width } = Dimensions.get('window');
const hostAvatar = require('../../assets/images/pic.png');
const hostBadgeImage = require('../../assets/images/host.png');

const mockGroups = [
  {
    name: 'Study Buddies',
    members: ['Isaias', 'Jad', 'Aya'],
  },
  {
    name: 'party people',
    members: ['Emi', 'Varsha', '+5'],
  },
  {
    name: 'All Friends',
    members: ['Nico', 'Yujina', '+50'],
  },
];

export default function Profile() {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggleExpand = (name: string) => {
    setExpanded(expanded === name ? null : name);
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <View style={styles.purpleBackground} />
        <View style={styles.curve} />
        <Image source={hostAvatar} style={styles.profileImage} />
      </View>

      <Text style={styles.title}>Taralyn Nguyen</Text>
      <Text style={styles.user}>@taralyn</Text>

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


      {/* <View style={styles.statRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Quests</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>16</Text>
          <Text style={styles.statLabel}>Groups</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Badges</Text>
        </View>
      </View> */}

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

      <Text style={styles.sectionTitle}>Hosted Quests:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ backgroundColor: 'white' }}
        contentContainerStyle={styles.questScroll}
      >
        {[...Array(3)].map((_, i) => (
          <Quest key={i} />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>My Badges:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ backgroundColor: 'white' }}
        contentContainerStyle={styles.questScroll}
      >
        {[...Array(3)].map((_, i) => (
          <Badge key={i} title="Host" image={hostBadgeImage} />
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 40,
  },
  header: {
    position: 'relative',
    width: '100%',
    height: 240,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  purpleBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'purple',
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
  communityCard: {
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 12,
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  arrow: {
    fontSize: 18,
    color: 'purple',
    alignSelf: 'center',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: 'purple',
  },
  statLabel: {
    fontSize: 12,
    color: '#333',
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
    backgroundColor: 'purple',
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
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
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


