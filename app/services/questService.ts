// app/services/questService.ts
import {
    addDoc,
    collection,
    DocumentData,
    onSnapshot,
    query,
    Unsubscribe,
    where
} from 'firebase/firestore'
import { db } from '../firebase/config'
  
  const questsCol = collection(db, 'quests')
  
  export async function createQuest(data: {
    title: string
    description: string
    location: { lat: number; lng: number }
    time: Date
    creatorId: string
  }) {
    return await addDoc(questsCol, {
      ...data,
      createdAt: new Date(),
    })
  }
  
  // real-time listener for quests within X km of a point
  export function subscribeToNearbyQuests(
    center: { lat: number; lng: number },
    radiusKm: number,
    callback: (qs: DocumentData[]) => void
  ): Unsubscribe {
    // For simplicity: we store lat/lng as fields and filter on client.
    const q = query(questsCol, where('creatorId', '!=', null))
    return onSnapshot(q, snap => {
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      // filter by distance client-side...
      callback(all)
    })
  }
  