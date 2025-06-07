import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from 'firebase/firestore';
import { db } from './config';
  
  export interface UserProfile {
    handle: string; // email handle (so like, "jack" from "jack@stanford.edu")
    email: string;
    first_name: string;
    last_name: string;
    displayName: string; // computed: first_name + last_name
    uid?: string; //for Firebase Auth UID (we'll need to match this somehow)
  }
  
//get profile handle
  export async function getUserProfileByHandle(handle: string): Promise<UserProfile | null> {
    const userRef = doc(db, 'flp_names', handle);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        handle: data["@"] || handle,
        email: `${handle}@stanford.edu`, // get back the email reconstruct email, there is a probably better way to do this
        first_name: data.first_name,
        last_name: data.last_name,
        displayName: `${data.first_name} ${data.last_name}`.trim(),
      };
    }
    return null;
  }
  
//mamange group logic 
  export async function getAllUsers(): Promise<UserProfile[]> {
    const usersRef = collection(db, 'flp_names');
    const q = query(usersRef, orderBy('first_name'));
    
    const querySnapshot = await getDocs(q);
    const users: UserProfile[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const handle = doc.id; // The document ID is the handle
      
      users.push({
        handle,
        email: `${handle}@stanford.edu`,
        first_name: data.first_name,
        last_name: data.last_name,
        displayName: `${data.first_name} ${data.last_name}`.trim(),
      });
    });
    
    return users;
  }

  export async function searchUsers(
    searchTerm: string,
    currentUserHandle?: string
  ): Promise<UserProfile[]> {
    const allUsers = await getAllUsers();
    
    //filter out current user if provided (case-insensitive)
    let filteredUsers = allUsers;
    if (currentUserHandle) {
      filteredUsers = allUsers.filter(user => 
        user.handle.toLowerCase() !== currentUserHandle.toLowerCase()
      );
    }
    
    // If no search term, return all users (except current user)
    if (!searchTerm.trim()) {
      return filteredUsers;
    }
    
    // Filter by search term
    return filteredUsers.filter(user =>
      user.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.handle.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  /**
   * Get current user's handle from their email
   */
  export function getCurrentUserHandle(email: string): string {
    return email.split('@')[0];
  }