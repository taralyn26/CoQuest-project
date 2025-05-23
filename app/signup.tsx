// app/signup.tsx
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
  onSignUp: () => void;
  onGoToLogin: () => void;
}

import { AuthError, signUp } from './firebase';

// export default function SignUp({ onSignUp, onGoToLogin }: Props) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirm, setConfirm] = useState('');
//   const [error, setError] = useState('');

//   const handleSignUp = async () => {
//     try {
//       if (password !== confirm) {
//         setError('Passwords do not match');
//         return;
//       }
      
//       await signUp(email, password);
//       onSignUp();
//     } catch (error) {
//       const authError = error as AuthError;
//       setError(authError.message);
//     }
//   };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.appTitle}>CoQuest</Text>
      <Text style={styles.appSubtitle}>enjoy some spontaneity!</Text>

      <Text style={styles.screenTitle}>Sign Up</Text>

      <View style={styles.card}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Create a password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Re-enter password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />

        <Pressable style={styles.primaryButton} onPress={handleSignUp}>
          <Text style={styles.primaryButtonText}>Sign Up</Text>
        </Pressable>

        <Pressable onPress={onGoToLogin}>
          <Text style={styles.link}>Already have an account? log in</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const FONT_FAMILY = 'System';  // ← same font constant here
const PURPLE = '#56018D';
const DARK = '#212121';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PURPLE,
    alignItems: 'center',
    padding: 16,
  },
  appTitle: {
    fontFamily: FONT_FAMILY,
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginTop: 24,
  },
  appSubtitle: {
    fontFamily: FONT_FAMILY,
    color: 'white',
    fontSize: 18,
    marginBottom: 32,
  },
  screenTitle: {
    fontFamily: FONT_FAMILY,
    color: 'white',
    fontSize: 28,
    fontWeight: '600',
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    width: '90%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    alignSelf: 'center',
  },
  label: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    marginBottom: 4,
    color: '#333',
  },
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
  primaryButtonText: {
    fontFamily: FONT_FAMILY,
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  link: {
    fontFamily: FONT_FAMILY,
    color: '#007AFF',
    textDecorationLine: 'underline',
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
});
