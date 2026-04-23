import { ArrowLeft, ChevronLeft, ChevronRight, Flame, Sparkles } from 'lucide-react'
import { useMemo, useState } from 'react'

import { PaperBackground } from '@/shared/ui/paper-background'

interface StatsPageProps {
  onBack: () => void
  entryDates: string[]
}

export function StatsPage({ onBack, entryDates }: StatsPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfWeek = new Date(year, month, 1).getDay()

  const entryDateSet = useMemo(
    () =>
      new Set(
        entryDates.map((date) => {
          const [entryYear, entryMonth, entryDay] = date.split('.')
          return `${entryYear}-${entryMonth}-${entryDay}`
        }),
      ),
    [entryDates],
  )

  const streak = useMemo(() => calculateStreak(entryDates), [entryDates])
  const thisMonthEntries = useMemo(() => {
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth() + 1

    return entryDates.filter((date) => {
      const [entryYear, entryMonth] = date.split('.')
      return Number(entryYear) === currentYear && Number(entryMonth) === currentMonth
    }).length
  }, [entryDates])

  const hasEntry = (day: number) => {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return entryDateSet.has(date)
  }

  return (
    <main className="andamiro-screen">
      <PaperBackground />

      <div className="andamiro-container">
        <header className="andamiro-header flex items-center gap-3 px-4 py-4">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full text-forest-green transition-colors hover:bg-forest-green/5"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="h-5 w-5" strokeWidth={1.5} />
          </button>
          <h1 className="font-serif text-xl font-medium tracking-wide text-forest-green">
            통계
          </h1>
        </header>

        <div className="px-6 py-6">
          <section className="mb-8">
            <h2 className="mb-4 font-serif text-sm font-medium tracking-wider text-forest-green/70">
              기록 달력
            </h2>

            <div className="andamiro-panel p-5">
              <div className="mb-5 flex items-center justify-between">
                <button
                  onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-forest-green transition-colors hover:bg-forest-green/5"
                  aria-label="이전 달"
                >
                  <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                </button>
                <span className="font-serif text-base font-medium tracking-wide text-forest-green">
                  {year}년 {month + 1}월
                </span>
                <button
                  onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-forest-green transition-colors hover:bg-forest-green/5"
                  aria-label="다음 달"
                >
                  <ChevronRight className="h-5 w-5" strokeWidth={1.5} />
                </button>
              </div>

              <div className="mb-3 grid grid-cols-7 gap-1">
                {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
                  <div
                    key={day}
                    className={`py-2 text-center font-serif text-xs font-light ${
                      index === 0
                        ? 'text-red-400/70'
                        : index === 6
                          ? 'text-blue-400/70'
                          : 'text-forest-green/50'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1
                  const dayOfWeek = (firstDayOfWeek + index) % 7
                  const isToday =
                    new Date().getFullYear() === year &&
                    new Date().getMonth() === month &&
                    new Date().getDate() === day

                  return (
                    <div
                      key={day}
                      className={`relative flex aspect-square flex-col items-center justify-center rounded-full font-serif text-sm transition-colors ${
                        hasEntry(day)
                          ? 'bg-forest-green font-medium text-parchment'
                          : isToday
                            ? 'bg-forest-green/10 font-medium text-forest-green ring-1 ring-forest-green/30'
                            : dayOfWeek === 0
                              ? 'text-red-400/70'
                              : dayOfWeek === 6
                                ? 'text-blue-400/70'
                                : 'text-forest-green/60'
                      }`}
                    >
                      <span>{day}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="mb-4 font-serif text-sm font-medium tracking-wider text-forest-green/70">
              연속 기록
            </h2>

            <div className="flex gap-4">
              <div className="andamiro-panel flex-1 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <Flame className="h-5 w-5 text-orange-500" strokeWidth={1.5} />
                  <span className="font-serif text-xs font-light text-forest-green/60">
                    연속 기록
                  </span>
                </div>
                <div className="font-serif text-3xl font-semibold text-forest-green">
                  {streak}
                  <span className="ml-1 text-lg font-light">일</span>
                </div>
              </div>

              <div className="andamiro-panel flex-1 p-5">
                <div className="mb-2 flex items-center gap-2">
                  <span className="font-serif text-xs font-light text-forest-green/60">
                    이번 달
                  </span>
                </div>
                <div className="font-serif text-3xl font-semibold text-forest-green">
                  {thisMonthEntries}
                  <span className="ml-1 text-lg font-light">개</span>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-4 font-serif text-sm font-medium tracking-wider text-forest-green/70">
              이번 달 AI 요약
            </h2>

            <div className="andamiro-panel p-6">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-forest-green/60" strokeWidth={1.5} />
                <span className="font-serif text-sm font-medium text-forest-green">
                  {new Date().getFullYear()}년 {new Date().getMonth() + 1}월의 기록
                </span>
              </div>

              <div className="min-h-[120px] rounded-lg border border-dashed border-forest-green/20 bg-forest-green/5 p-4">
                <p className="font-serif text-sm font-light leading-relaxed text-forest-green/50">
                  AI 요약 기능이 여기에 표시됩니다.
                  <br />
                  이번 달의 모든 일기를 분석하여 감정 흐름, 주요 키워드, 의미 있는 순간들을 요약해 드립니다.
                </p>
              </div>

              <button
                className="mt-4 w-full cursor-not-allowed rounded-lg border border-forest-green/20 bg-transparent py-3 font-serif text-sm font-medium text-forest-green/50"
                disabled
              >
                요약 생성 준비 중
              </button>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

function calculateStreak(entryDates: string[]) {
  const dateSet = new Set(entryDates)
  let streak = 0
  const cursor = new Date()

  while (dateSet.has(formatDate(cursor))) {
    streak += 1
    cursor.setDate(cursor.getDate() - 1)
  }

  return streak
}

function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}.${month}.${day}`
}
