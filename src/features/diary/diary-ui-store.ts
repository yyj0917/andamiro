import { create } from 'zustand'

import type { DiaryEntry } from './types'

type DiaryView = 'home' | 'write' | 'detail' | 'mypage' | 'stats'

interface DiaryUiState {
  view: DiaryView
  isMenuOpen: boolean
  selectedEntry: DiaryEntry | null
  editingEntry: DiaryEntry | null
  setView: (view: DiaryView) => void
  toggleMenu: () => void
  closeMenu: () => void
  openDetail: (entry: DiaryEntry) => void
  openWrite: (entry?: DiaryEntry) => void
  closeWrite: () => void
  goHome: () => void
}

export const useDiaryUiStore = create<DiaryUiState>((set, get) => ({
  view: 'home',
  isMenuOpen: false,
  selectedEntry: null,
  editingEntry: null,
  setView: (view) => set({ view }),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  closeMenu: () => set({ isMenuOpen: false }),
  openDetail: (entry) => set({ selectedEntry: entry, view: 'detail' }),
  openWrite: (entry) => set({ editingEntry: entry ?? null, view: 'write' }),
  closeWrite: () => {
    const { selectedEntry } = get()
    set({ editingEntry: null, view: selectedEntry ? 'detail' : 'home' })
  },
  goHome: () =>
    set({
      view: 'home',
      selectedEntry: null,
      editingEntry: null,
      isMenuOpen: false,
    }),
}))
