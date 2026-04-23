import { Menu, Plus } from 'lucide-react'
import type { User } from 'firebase/auth'

import { useAuth } from '@/features/auth/auth-context'
import { useDiaryUiStore } from '@/features/diary/diary-ui-store'
import { formatDateDots, useDiaryEntries } from '@/features/diary/use-diary-entries'
import {
  useCreateDiaryEntry,
  useUpdateDiaryEntry,
} from '@/features/diary/use-diary-mutations'
import { PaperBackground } from '@/shared/ui/paper-background'

import { DetailView } from './detail-view'
import { MyPage } from './my-page'
import { SidebarMenu } from './sidebar-menu'
import { StatsPage } from './stats-page'
import { WritingScreen } from './writing-screen'
import type { DiaryEntryInput } from '../types'

export function DiaryApp({ user }: { user: User }) {
  const { signOutUser } = useAuth()
  const { entries, entryDates, loading, error } = useDiaryEntries(user.uid)
  const createEntry = useCreateDiaryEntry(user.uid)
  const updateEntry = useUpdateDiaryEntry(user.uid)
  const {
    closeMenu,
    closeWrite,
    editingEntry,
    goHome,
    isMenuOpen,
    openDetail,
    openWrite,
    selectedEntry,
    setView,
    toggleMenu,
    view,
  } = useDiaryUiStore()

  const handleSave = async (input: DiaryEntryInput) => {
    if (editingEntry) {
      await updateEntry.mutateAsync({ entryId: editingEntry.id, input })
      openDetail({ ...editingEntry, ...input })
      return
    }

    await createEntry.mutateAsync(input)
    setView('home')
  }

  if (view === 'detail' && selectedEntry) {
    return (
      <DetailView
        entry={selectedEntry}
        userId={user.uid}
        onBack={() => setView('home')}
        onEdit={() => openWrite(selectedEntry)}
        onDeleted={goHome}
      />
    )
  }

  if (view === 'write') {
    return (
      <WritingScreen
        initialEntry={editingEntry}
        onClose={closeWrite}
        onSave={handleSave}
      />
    )
  }

  if (view === 'mypage') {
    return (
      <MyPage
        onBack={() => setView('home')}
        onLogout={signOutUser}
        totalEntries={entries.length}
        userName={user.displayName ?? '안다미로 사용자'}
        userEmail={user.email ?? ''}
      />
    )
  }

  if (view === 'stats') {
    return <StatsPage onBack={() => setView('home')} entryDates={entryDates} />
  }

  return (
    <main className="andamiro-screen">
      <PaperBackground />

      <div className="andamiro-container">
        <header className="andamiro-header flex items-center justify-between px-6 py-4">
          <h1 className="font-serif text-xl font-medium tracking-wide text-forest-green">
            안다미로
          </h1>
          <button
            className="flex h-10 w-10 items-center justify-center rounded-full text-forest-green transition-colors hover:bg-forest-green/5"
            onClick={toggleMenu}
            aria-label="메뉴"
          >
            <Menu className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </header>

        <div className="flex flex-col gap-3 px-5 py-6">
          {loading ? (
            <p className="py-20 text-center font-serif text-sm text-forest-green/60">
              기록을 불러오는 중...
            </p>
          ) : null}

          {error ? (
            <p className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {!loading && !error && entries.length === 0 ? (
            <section className="py-24 text-center">
              <p className="font-serif text-lg font-medium text-forest-green">
                아직 기록이 없습니다.
              </p>
              <p className="mt-2 text-sm text-forest-green/60">
                오늘을 한 문장으로 남겨보세요.
              </p>
            </section>
          ) : null}

          {entries.map((entry) => (
            <article
              key={entry.id}
              onClick={() => openDetail(entry)}
              className="andamiro-panel cursor-pointer px-5 py-4 transition-colors hover:border-forest-green/20 hover:bg-parchment/80"
            >
              <time className="font-serif text-xs font-light tracking-wider text-forest-green/50">
                {formatDateDots(entry.entryDate)}
              </time>
              <h2 className="mt-1.5 font-serif text-base font-semibold leading-snug text-forest-green">
                {entry.title || '제목 없는 하루'}
              </h2>
              <p className="mt-2 line-clamp-1 font-serif text-sm font-light leading-relaxed text-forest-green/70">
                {entry.content}
              </p>
            </article>
          ))}
        </div>

        <button
          className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-forest-green text-parchment shadow-lg transition-all duration-300 hover:scale-105 hover:bg-forest-green-light active:scale-95"
          style={{
            right: 'max(1.5rem, calc((100vw - 500px) / 2 + 1.5rem))',
          }}
          onClick={() => openWrite()}
          aria-label="새 일기 작성"
        >
          <Plus className="h-6 w-6" strokeWidth={2} />
        </button>
      </div>

      <SidebarMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        entryDates={entryDates}
        onNavigate={(page) => {
          closeMenu()
          if (page === 'mypage') setView('mypage')
          if (page === 'stats') setView('stats')
        }}
      />
    </main>
  )
}
