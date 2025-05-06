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

export default function Profile() {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.header}>
        <View style={styles.purpleBackground} />
        <View style={styles.curve} />
        <Image source={hostAvatar} style={styles.profileImage} />
      </View>

      <Text style={styles.title}>Taralyn Nguyen</Text>
      <Text style={styles.user}>@taralyn</Text>

      <TouchableOpacity style={[styles.groupCard, styles.communityCard]}>
        <View>
          <Text style={styles.groupTitle}>Stanford Community 🌲</Text>
        </View>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>


      <Text style={styles.sectionTitle}>Recent Groups:</Text>

      <View style={styles.groupsContainer}>
        {['group name', 'group name', 'group name'].map((group, index) => (
          <TouchableOpacity key={index} style={styles.groupCard}>
            <View>
              <Text style={styles.groupTitle}>group name</Text>
              <Text style={styles.groupMembers}>
                person1, person2, person3
              </Text>
            </View>
            <Text style={styles.arrow}>▼</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.manageButton}>
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
    marginTop: 4,
    color: 'white',
  },
  communityButton: {
    marginTop: 16,
    alignSelf: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
  },
  communityText: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  groupsContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 16,
  },
  groupCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  groupMembers: {
    fontSize: 12,
    color: '#333',
    marginTop: 2,
  },
  arrow: {
    fontSize: 18,
    color: 'purple',
    alignSelf: 'center',
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
  communityCard: {
    marginBottom: 12,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
  
});

