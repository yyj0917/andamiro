import {
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Settings,
  User,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'

interface SidebarMenuProps {
  isOpen: boolean
  onClose: () => void
  entryDates: string[]
  onNavigate: (page: string) => void
}

export function SidebarMenu({
  isOpen,
  onClose,
  entryDates,
  onNavigate,
}: SidebarMenuProps) {
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

  const hasEntry = (day: number) => {
    const date = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return entryDateSet.has(date)
  }

  const menuItems = [
    { icon: User, label: '마이페이지', page: 'mypage' },
    { icon: BarChart3, label: '통계', page: 'stats' },
    { icon: Settings, label: '설정', page: 'settings' },
  ]

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-forest-green/20 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-[85%] max-w-[340px] flex-col border-l border-forest-green/10 bg-parchment shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between border-b border-forest-green/10 px-5 py-4">
          <span className="font-serif text-lg font-medium text-forest-green">메뉴</span>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-full text-forest-green transition-colors hover:bg-forest-green/5"
            aria-label="닫기"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="border-b border-forest-green/10 px-5 py-5">
          <div className="mb-4 flex items-center justify-between">
            <button
              onClick={() => setCurrentDate(new Date(year, month - 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-forest-green transition-colors hover:bg-forest-green/5"
              aria-label="이전 달"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <span className="font-serif text-sm font-medium tracking-wide text-forest-green">
              {year}년 {month + 1}월
            </span>
            <button
              onClick={() => setCurrentDate(new Date(year, month + 1, 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full text-forest-green transition-colors hover:bg-forest-green/5"
              aria-label="다음 달"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
              <div
                key={day}
                className="py-1 text-center font-serif text-xs font-light text-forest-green/50"
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
              const isToday =
                new Date().getFullYear() === year &&
                new Date().getMonth() === month &&
                new Date().getDate() === day

              return (
                <button
                  key={day}
                  className={`relative flex aspect-square flex-col items-center justify-center rounded-full font-serif text-xs transition-colors ${
                    isToday
                      ? 'bg-forest-green/10 font-medium text-forest-green'
                      : 'text-forest-green/70 hover:bg-forest-green/5'
                  }`}
                >
                  <span>{day}</span>
                  {hasEntry(day) ? (
                    <span className="absolute bottom-0.5 h-1 w-1 rounded-full bg-forest-green" />
                  ) : null}
                </button>
              )
            })}
          </div>
        </div>

        <nav className="flex flex-col gap-1 px-3 py-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => onNavigate(item.page)}
              disabled={item.page === 'settings'}
              className="flex w-full items-center gap-3 rounded-lg px-3 py-3 font-serif text-sm font-light text-forest-green transition-colors hover:bg-forest-green/5 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <item.icon className="h-5 w-5" strokeWidth={1.5} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}
