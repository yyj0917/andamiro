import { ArrowLeft, User } from 'lucide-react'

import { PaperBackground } from '@/shared/ui/paper-background'

interface MyPageProps {
  onBack: () => void
  onLogout: () => void
  totalEntries: number
  userName: string
  userEmail: string
}

export function MyPage({
  onBack,
  onLogout,
  totalEntries,
  userName,
  userEmail,
}: MyPageProps) {
  return (
    <main className="andamiro-screen">
      <PaperBackground />

      <div className="andamiro-container">
        <header className="andamiro-header z-40 flex h-14 items-center justify-between px-4">
          <button
            onClick={onBack}
            className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-secondary"
            aria-label="뒤로 가기"
          >
            <ArrowLeft className="h-5 w-5 text-forest-green" />
          </button>
          <h1 className="font-serif text-lg font-medium text-forest-green">
            마이페이지
          </h1>
          <div className="w-10" />
        </header>

        <div className="px-6 py-10">
          <section className="flex flex-col items-center pb-10">
            <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full border-2 border-forest-green/20 bg-secondary">
              <User className="h-10 w-10 text-forest-green/50" />
            </div>
            <h2 className="mb-1 font-serif text-xl font-semibold text-forest-green">
              {userName}
            </h2>
            <p className="text-sm text-muted-foreground">{userEmail}</p>
          </section>

          <section className="andamiro-panel mb-12 p-6">
            <div className="text-center">
              <p className="mb-2 text-sm text-muted-foreground">내가 채운 기록들</p>
              <p className="font-serif text-4xl font-semibold text-forest-green">
                {totalEntries}
                <span className="ml-1 text-lg font-normal text-muted-foreground">개</span>
              </p>
              <p className="mt-4 font-serif text-sm italic text-forest-green/60">
                &ldquo;담은 것이 그릇에 넘치도록&rdquo;
              </p>
            </div>
          </section>

          <div className="mb-8 h-px w-full bg-border/50" />

          <section className="space-y-3">
            <button
              onClick={onLogout}
              className="block w-full py-3 text-center text-sm text-muted-foreground transition-colors hover:text-forest-green"
            >
              로그아웃
            </button>
            <button
              className="block w-full cursor-not-allowed py-3 text-center text-sm text-muted-foreground/50"
              disabled
            >
              회원탈퇴
            </button>
          </section>
        </div>
      </div>
    </main>
  )
}
