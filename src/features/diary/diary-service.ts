import {
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
  type Unsubscribe,
} from 'firebase/firestore'

import { firestore } from '@/lib/firebase'

import type { DiaryEntry, DiaryEntryInput } from './types'

function requireFirestore() {
  if (!firestore) {
    throw new Error('Firebase Firestore is not configured.')
  }

  return firestore
}

function entriesCollection(userId: string) {
  return collection(requireFirestore(), 'users', userId, 'entries')
}

function mapDiaryEntry(entryDoc: {
  id: string
  data: () => Record<string, unknown>
}): DiaryEntry {
  return {
    id: entryDoc.id,
    ...entryDoc.data(),
  } as DiaryEntry
}

export async function getDiaryEntries(userId: string) {
  const entriesQuery = query(entriesCollection(userId), orderBy('entryDate', 'desc'))
  const snapshot = await getDocs(entriesQuery)

  return snapshot.docs.map(mapDiaryEntry)
}

export function subscribeDiaryEntries(
  userId: string,
  onEntries: (entries: DiaryEntry[]) => void,
  onError: (error: Error) => void,
): Unsubscribe {
  const entriesQuery = query(entriesCollection(userId), orderBy('entryDate', 'desc'))

  return onSnapshot(
    entriesQuery,
    (snapshot) => {
      onEntries(snapshot.docs.map(mapDiaryEntry))
    },
    onError,
  )
}

export async function createDiaryEntry(userId: string, input: DiaryEntryInput) {
  await addDoc(entriesCollection(userId), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
}

export async function updateDiaryEntry(
  userId: string,
  entryId: string,
  input: DiaryEntryInput,
) {
  await updateDoc(doc(requireFirestore(), 'users', userId, 'entries', entryId), {
    ...input,
    updatedAt: serverTimestamp(),
  })
}

export async function deleteDiaryEntry(userId: string, entryId: string) {
  await deleteDoc(doc(requireFirestore(), 'users', userId, 'entries', entryId))
}
