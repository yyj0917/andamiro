import { AuthProvider, useAuth } from '@/features/auth/auth-context'
import { DiaryApp } from '@/features/diary/components/diary-app'
import { LoginScreen } from '@/features/auth/components/login-screen'
import { AppQueryProvider } from '@/lib/query-client'

function AppContent() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-parchment font-serif text-forest-green">
        안다미로를 여는 중...
      </main>
    )
  }

  return user ? <DiaryApp user={user} /> : <LoginScreen />
}

function App() {
  return (
    <AppQueryProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppQueryProvider>
  )
}

export default App
