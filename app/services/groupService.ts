// app/services/groupService.ts
import { addDoc, collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'

const groupsCol = collection(db, 'groups')

export async function createGroup(name: string, members: string[]) {
  return await addDoc(groupsCol, { name, members, createdAt: new Date() })
}

export function subscribeToMyGroups(
  userId: string,
  callback: (groups: any[]) => void
) {
  return onSnapshot(groupsCol, snap => {
    callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  })
}
