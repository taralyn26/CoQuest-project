// app/firebase/groupService.ts
import {
    Timestamp,
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    updateDoc,
    where,
    type Unsubscribe,
} from 'firebase/firestore';
import { db } from './config';
import { getUserProfileByHandle, type UserProfile } from './userService';
  
  export interface Group {
    id: string;
    name: string;
    ownerHandle: string; // Handle of the user who created the group (e.g., "jack")
    memberHandles: string[]; // Array of handles
    createdAt: Timestamp;
    updatedAt: Timestamp;
  }
  
  // Enhanced Group with member details populated
  export interface GroupWithMembers extends Omit<Group, 'memberHandles'> {
    memberHandles: string[];
    members: UserProfile[]; // Populated member details
  }
  
  /**
   * Create a new group
   */
  export async function createGroup(
    name: string,
    memberHandles: string[],
    ownerHandle: string
  ): Promise<string> {
    if (!name.trim()) {
      throw new Error('Group name is required');
    }
    
    if (memberHandles.length === 0) {
      throw new Error('At least one member is required');
    }
    
    const groupsRef = collection(db, 'groups');
    const groupData = {
      name: name.trim(),
      ownerHandle,
      memberHandles,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    
    const docRef = await addDoc(groupsRef, groupData);
    return docRef.id;
  }
  
  /**
   * Get all groups owned by the current user (by handle)
   */
  export async function getMyGroups(ownerHandle: string): Promise<Group[]> {
    const groupsRef = collection(db, 'groups');
    const q = query(
      groupsRef,
      where('ownerHandle', '==', ownerHandle),
      orderBy('updatedAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const groups: Group[] = [];
    
    querySnapshot.forEach((doc) => {
      groups.push({
        id: doc.id,
        ...doc.data(),
      } as Group);
    });
    
    return groups;
  }
  
  /**
   * Get groups with member details populated
   */
  export async function getMyGroupsWithMembers(ownerHandle: string): Promise<GroupWithMembers[]> {
    const groups = await getMyGroups(ownerHandle);
    const groupsWithMembers: GroupWithMembers[] = [];
    
    for (const group of groups) {
      const members: UserProfile[] = [];
      
      // Fetch member details by handle
      for (const memberHandle of group.memberHandles) {
        const memberProfile = await getUserProfileByHandle(memberHandle);
        if (memberProfile) {
          members.push(memberProfile);
        }
      }
      
      groupsWithMembers.push({
        ...group,
        members,
      });
    }
    
    return groupsWithMembers;
  }
  
  /**
   * Update group name
   */
  export async function updateGroupName(
    groupId: string,
    newName: string
  ): Promise<void> {
    if (!newName.trim()) {
      throw new Error('Group name is required');
    }
    
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      name: newName.trim(),
      updatedAt: serverTimestamp(),
    });
  }
  
  /**
   * Update group members
   */
  export async function updateGroupMembers(
    groupId: string,
    memberHandles: string[]
  ): Promise<void> {
    if (memberHandles.length === 0) {
      throw new Error('At least one member is required');
    }
    
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, {
      memberHandles,
      updatedAt: serverTimestamp(),
    });
  }
  
  /**
   * Delete a group
   */
  export async function deleteGroup(groupId: string): Promise<void> {
    const groupRef = doc(db, 'groups', groupId);
    await deleteDoc(groupRef);
  }
  
  /**
   * Subscribe to real-time updates for user's groups
   */
  export function subscribeToMyGroups(
    ownerHandle: string,
    callback: (groups: Group[]) => void,
    onError?: (error: Error) => void
  ): Unsubscribe {
    const groupsRef = collection(db, 'groups');
    const q = query(
      groupsRef,
      where('ownerHandle', '==', ownerHandle),
      orderBy('updatedAt', 'desc')
    );
    
    return onSnapshot(
      q,
      (querySnapshot) => {
        const groups: Group[] = [];
        querySnapshot.forEach((doc) => {
          groups.push({
            id: doc.id,
            ...doc.data(),
          } as Group);
        });
        callback(groups);
      },
      onError
    );
  }