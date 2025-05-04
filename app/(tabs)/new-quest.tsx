import { StyleSheet, Text, View } from 'react-native';

export default function NewQuest() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>New Quest</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 },
});
