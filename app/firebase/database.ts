import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    FirestoreError,
    getDoc,
    getDocs,
    query,
    Timestamp,
    updateDoc,
    where
} from 'firebase/firestore';
import { db } from './config';

export interface Group {
  id?: string;
  name: string;
  description: string;
  createdBy: string;
  members: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Quest {
  id?: string;
  groupId: string;
  title: string;
  description: string;
  createdBy: string;
  status: 'pending' | 'in_progress' | 'completed';
  assignedTo?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Group Operations
export const createGroup = async (groupData: Omit<Group, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const groupWithTimestamps = {
      ...groupData,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, 'groups'), groupWithTimestamps);
    return docRef.id;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    throw new Error('Failed to create group: ' + firestoreError.message);
  }
};

export const getGroup = async (groupId: string): Promise<Group | null> => {
  try {
    const docRef = doc(db, 'groups', groupId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Group;
    }
    return null;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    throw new Error('Failed to get group: ' + firestoreError.message);
  }
};

export const getUserGroups = async (userId: string): Promise<Group[]> => {
  try {
    const groupsQuery = query(
      collection(db, 'groups'),
      where('members', 'array-contains', userId)
    );
    
    const querySnapshot = await getDocs(groupsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Group[];
  } catch (error) {
    const firestoreError = error as FirestoreError;
    throw new Error('Failed to get user groups: ' + firestoreError.message);
  }
};

export const updateGroup = async (groupId: string, updates: Partial<Group>): Promise<void> => {
  try {
    const docRef = doc(db, 'groups', groupId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    const firestoreError = error as FirestoreError;
    throw new Error('Failed to update group: ' + firestoreError.message);
  }
};

export const deleteGroup = async (groupId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'groups', groupId));
  } catch (error) {
    const firestoreError = error as FirestoreError;
    throw new Error('Failed to delete group: ' + firestoreError.message);
  }
};

// Quest Operations
export const createQuest = async (questData: Omit<Quest, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
  try {
    const now = Timestamp.now();
    const questWithTimestamps = {
      ...questData,
      createdAt: now,
      updatedAt: now
    };
    
    const docRef = await addDoc(collection(db, 'quests'), questWithTimestamps);
    return docRef.id;
  } catch (error) {
    const firestoreError = error as FirestoreError;
    throw new Error('Failed to create quest: ' + firestoreError.message);
  }
};

export const getGroupQuests = async (groupId: string): Promise<Quest[]> => {
  try {
    const questsQuery = query(
      collection(db, 'quests'),
      where('groupId', '==', groupId)
    );
    
    const querySnapshot = await getDocs(questsQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Quest[];
  } catch (error) {
    const firestoreError = error as FirestoreError;
    throw new Error('Failed to get group quests: ' + firestoreError.message);
  }
};

export const updateQuest = async (questId: string, updates: Partial<Quest>): Promise<void> => {
  try {
    const docRef = doc(db, 'quests', questId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    const firestoreError = error as FirestoreError;
    throw new Error('Failed to update quest: ' + firestoreError.message);
  }
};

export const deleteQuest = async (questId: string): Promise<void> => {
  try {
    await deleteDoc(doc(db, 'quests', questId));
  } catch (error) {
    const firestoreError = error as FirestoreError;
    throw new Error('Failed to delete quest: ' + firestoreError.message);
  }
}; 