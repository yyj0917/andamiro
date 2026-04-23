import { ArrowLeft, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { useDeleteDiaryEntry } from '@/features/diary/use-diary-mutations'
import { formatDateDots } from '@/features/diary/use-diary-entries'
import { PaperBackground } from '@/shared/ui/paper-background'

import type { DiaryEntry } from '../types'

interface DetailViewProps {
  entry: DiaryEntry
  userId: string
  onBack: () => void
  onEdit: () => void
  onDeleted: () => void
}

export function DetailView({ entry, userId, onBack, onEdit, onDeleted }: DetailViewProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const deleteEntry = useDeleteDiaryEntry(userId)

  const handleDelete = async () => {
    if (!window.confirm('이 일기를 삭제할까요?')) {
      return
    }

    setIsDeleting(true)
    await deleteEntry.mutateAsync(entry.id)
    onDeleted()
  }

  return (
    <main className="andamiro-screen">
      <PaperBackground />

      <div className="andamiro-container">
        <button
          onClick={onBack}
          className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-full bg-parchment/80 backdrop-blur-sm transition-all hover:bg-secondary"
          style={{
            left: 'max(1rem, calc((100vw - 500px) / 2 + 1rem))',
          }}
          aria-label="뒤로 가기"
        >
          <ArrowLeft className="h-5 w-5 text-forest-green" />
        </button>

        <article className="px-10 py-20">
          <time className="block text-sm tracking-widest text-muted-foreground">
            {formatDateDots(entry.entryDate)}
          </time>

          <div className="my-6 h-px w-16 bg-forest-green/30" />

          <h1 className="mb-12 font-serif text-2xl font-semibold leading-relaxed text-forest-green">
            {entry.title || '제목 없는 하루'}
          </h1>

          <div className="prose-andamiro">
            {entry.content.split('\n\n').map((paragraph) => (
              <p
                key={paragraph}
                className="mb-8 whitespace-pre-wrap font-serif text-base leading-[2] text-forest-green/90 first-letter:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-16 flex justify-center">
            <div className="h-1 w-1 rounded-full bg-forest-green/40" />
            <div className="mx-2 h-1 w-1 rounded-full bg-forest-green/40" />
            <div className="h-1 w-1 rounded-full bg-forest-green/40" />
          </div>
        </article>

        <div
          className="fixed bottom-6 right-6 z-40 flex gap-2"
          style={{
            right: 'max(1.5rem, calc((100vw - 500px) / 2 + 1.5rem))',
          }}
        >
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-destructive/20 bg-parchment/90 text-destructive/70 backdrop-blur-sm transition-all hover:border-destructive/40 hover:bg-secondary disabled:opacity-50"
            aria-label="삭제하기"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={onEdit}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-forest-green/20 bg-parchment/90 backdrop-blur-sm transition-all hover:border-forest-green/40 hover:bg-secondary"
            aria-label="수정하기"
          >
            <Pencil className="h-4 w-4 text-forest-green/70" />
          </button>
        </div>
      </div>
    </main>
  )
}
