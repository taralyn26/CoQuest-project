import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Quest from '../../components/Quest';
import { auth, db } from '../firebase/config';

const filters = ['Upcoming', 'Hosting', 'Past'];
//make sure we see the different states
export default function QuestDashboard() {
  const [selected, setSelected] = useState('Upcoming');
  const [upcoming, setUpcoming] = useState<any[]>([]);
  const [past, setPast] = useState<any[]>([]);
  const [hostedUpcoming, setHostedUpcoming] = useState<any[]>([]);
  const [hostedPast, setHostedPast] = useState<any[]>([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    const email = currentUser?.email || '';
    const handle = email.split('@')[0].toLowerCase();
    const userRef = doc(db, 'flp_names', handle);

    const unsubscribe = onSnapshot(userRef, async (snap) => {
      if (!snap.exists()) return;

      const data = snap.data();
      const display = data.display_quests || [];
      const hosted = data.hosted_quests || [];
      const now = Date.now() / 1000;

      const all = Array.from(new Set([...display, ...hosted].map((q: any) =>
        typeof q === 'string' ? q : q.id
      )));

      const result = await Promise.all(
        all.map(async (id) => {
          const qSnap = await getDoc(doc(db, 'quests', id));
          if (!qSnap.exists()) return null;
          const quest = qSnap.data();
          return { id, ...quest };
        })
      );

      const upcomingQs = result
        .filter(q => q?.end_time?.seconds > now && display.includes(q.id))
        .sort((a, b) => a.end_time.seconds - b.end_time.seconds);

      const pastQs = result
        .filter(q => q?.end_time?.seconds <= now && display.includes(q.id))
        .sort((a, b) => b.end_time.seconds - a.end_time.seconds);

      const hostedU = result
        .filter(q => q?.end_time?.seconds > now && hosted.includes(q.id))
        .sort((a, b) => a.end_time.seconds - b.end_time.seconds);

      const hostedP = result
        .filter(q => q?.end_time?.seconds <= now && hosted.includes(q.id))
        .sort((a, b) => b.end_time.seconds - a.end_time.seconds);

      setUpcoming(upcomingQs);
      setPast(pastQs);
      setHostedUpcoming(hostedU);
      setHostedPast(hostedP);
    });

    return () => unsubscribe();
  }, []);

  const renderQuests = (list: any[]) => {
    const uniqueQuests = Array.from(
      new Map(list.map((q) => [q.id, q])).values()
    );
    return (
      <View style={styles.questGrid}>
        {uniqueQuests.map((q) => (
          <View key={q.id} style={styles.questWrapper}>
            <Quest 
              id={q.id} 
              from="quest-dashboard" 
              questData={q}
              photoCategory={q.photo}
            />
          </View>
        ))}
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No quests to show!{'\n'}Make a new one ↓
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <Text style={styles.title}>Quest Dashboard</Text>
      <View style={styles.filterRow}>
        {filters.map(f => (
          <Pressable
            key={f}
            onPress={() => setSelected(f)}
            style={[styles.chip, selected === f && styles.chipSelected]}
          >
            <Text style={[styles.chipText, selected === f && { color: '#FFF' }]}>{f}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {selected === 'Upcoming' &&
          ([...upcoming, ...hostedUpcoming].length > 0
            ? renderQuests([...upcoming, ...hostedUpcoming])
            : renderEmptyState())}

        {selected === 'Past' &&
          ([...past, ...hostedPast].length > 0
            ? renderQuests([...past, ...hostedPast])
            : renderEmptyState())}

        {selected === 'Hosting' && (
          <>
            {hostedUpcoming.length > 0 && (
              <>
                <Text style={styles.sectionHeader}>Upcoming:</Text>
                {renderQuests(hostedUpcoming)}
              </>
            )}
            {hostedPast.length > 0 && (
              <>
                <Text style={styles.sectionHeader}>Past:</Text>
                {renderQuests(hostedPast)}
              </>
            )}
            {hostedUpcoming.length === 0 && hostedPast.length === 0 && renderEmptyState()}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF' },
  title: { fontSize: 24, fontWeight: '700', padding: 20 },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: '#EEE',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginRight: 10,
  },
  chipSelected: {
    backgroundColor: '#56018D',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  questGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  questWrapper: {
    width: '48%',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    marginTop: 20,
    color: '#56018D',
  },
  emptyContainer: {
    paddingVertical: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#56018D',
    textAlign: 'center',
    lineHeight: 28,
  },
});
