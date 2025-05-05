// app/login.tsx
import React, { useState } from 'react';
import {
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

interface Props {
  onLogin: () => void;
  onGoToSignUp: () => void;
}

export default function Login({ onLogin, onGoToSignUp }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appTitle}>CoQuest</Text>
      <Text style={styles.appSubtitle}>enjoy some spontaneity!</Text>

      <Text style={styles.screenTitle}>  Login</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={styles.primaryButton} onPress={onLogin}>
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </Pressable>

        <Pressable onPress={onGoToSignUp}>
          <Text style={styles.link}>New Here? sign up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const PURPLE = '#56018D';
const DARK = '#212121';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PURPLE,
    alignItems: 'center',
    padding: 16,
  },
  appTitle: { color: 'white', fontSize: 36, fontWeight: 'bold', marginTop: 24 },
  appSubtitle: { color: 'white', fontSize: 18, marginBottom: 32 },
  screenTitle: {
    color: 'white',
    fontSize: 28,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    width: '100%',
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: { fontSize: 16, marginBottom: 4, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: DARK,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryButtonText: { color: 'white', fontSize: 16, fontWeight: '500' },
  link: { color: '#007AFF', textDecorationLine: 'underline', marginTop: 4 },
});
