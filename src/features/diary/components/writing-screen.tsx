import { useState } from 'react'

import { todayInputValue } from '@/features/diary/use-diary-entries'
import { PaperBackground } from '@/shared/ui/paper-background'

import type { DiaryEntry, DiaryEntryInput } from '../types'

interface WritingScreenProps {
  initialEntry: DiaryEntry | null
  onClose: () => void
  onSave: (input: DiaryEntryInput) => Promise<void>
}

export function WritingScreen({ initialEntry, onClose, onSave }: WritingScreenProps) {
  const [title, setTitle] = useState(initialEntry?.title ?? '')
  const [content, setContent] = useState(initialEntry?.content ?? '')
  const [entryDate, setEntryDate] = useState(initialEntry?.entryDate ?? todayInputValue())
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSave = async () => {
    if (!title.trim() && !content.trim()) {
      return
    }

    setIsSaving(true)
    setError(null)

    try {
      await onSave({
        title: title.trim(),
        content: content.trim(),
        entryDate,
      })
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : '저장에 실패했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <main className="andamiro-screen">
      <PaperBackground />

      <div className="andamiro-container flex flex-col">
        <div className="flex flex-1 flex-col px-6 pb-28 pt-8">
          <div className="mb-5">
            <input
              type="date"
              value={entryDate}
              onChange={(event) => setEntryDate(event.target.value)}
              className="w-full bg-transparent font-serif text-sm text-forest-green/60 focus:outline-none"
              aria-label="일기 날짜"
            />
          </div>

          <div className="mb-8">
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="제목"
              className="w-full border-b border-forest-green/20 bg-transparent pb-3 font-serif text-xl font-medium text-forest-green placeholder:text-forest-green/30 focus:border-forest-green/40 focus:outline-none"
            />
          </div>

          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="오늘은 어떤 하루였나요?"
            className="h-full min-h-[400px] w-full flex-1 resize-none bg-transparent font-serif text-base font-light leading-[2] text-forest-green placeholder:text-forest-green/25 focus:outline-none"
          />

          {error ? (
            <p className="mt-4 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </p>
          ) : null}
        </div>

        <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-forest-green/10 bg-parchment/95 backdrop-blur-sm">
          <div className="mx-auto flex w-full min-w-[340px] max-w-[500px] items-center justify-end gap-3 px-6 py-4">
            <button
              onClick={onClose}
              className="paper-button px-5 py-2.5 text-sm font-medium text-forest-green/70 hover:bg-forest-green/5 hover:text-forest-green"
            >
              취소
            </button>

            <button
              onClick={handleSave}
              disabled={isSaving || (!title.trim() && !content.trim())}
              className="paper-button bg-forest-green px-5 py-2.5 text-sm font-medium text-parchment hover:bg-forest-green-light"
            >
              {isSaving ? '저장 중...' : '저장'}
            </button>
          </div>
        </footer>
      </div>
    </main>
  )
}
