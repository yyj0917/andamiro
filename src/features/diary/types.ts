import type { Timestamp } from 'firebase/firestore'

export interface DiaryEntry {
  id: string
  title: string
  content: string
  entryDate: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface DiaryEntryInput {
  title: string
  content: string
  entryDate: string
}
