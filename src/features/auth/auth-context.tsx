import {
  getRedirectResult,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from 'firebase/auth'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { firebaseAuth, googleAuthProvider } from '@/lib/firebase'

interface AuthContextValue {
  user: User | null
  loading: boolean
  error: string | null
  signInWithGoogle: () => Promise<void>
  signOutUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(Boolean(firebaseAuth))
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!firebaseAuth) {
      return
    }

    void getRedirectResult(firebaseAuth).catch((redirectError: unknown) => {
      setError(getAuthErrorMessage(redirectError))
      setLoading(false)
    })

    return onAuthStateChanged(firebaseAuth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!firebaseAuth) {
      setError('Firebase 인증 설정을 확인해 주세요.')
      return
    }

    setError(null)
    try {
      await signInWithPopup(firebaseAuth, googleAuthProvider)
    } catch (popupError) {
      if (shouldFallbackToRedirect(popupError)) {
        await signInWithRedirect(firebaseAuth, googleAuthProvider)
        return
      }

      setError(getAuthErrorMessage(popupError))
    }
  }, [])

  const signOutUser = useCallback(async () => {
    if (!firebaseAuth) {
      return
    }

    await signOut(firebaseAuth)
  }, [])

  const value = useMemo(
    () => ({ user, loading, error, signInWithGoogle, signOutUser }),
    [error, loading, signInWithGoogle, signOutUser, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function shouldFallbackToRedirect(error: unknown) {
  const code = getErrorCode(error)

  return [
    'auth/popup-blocked',
    'auth/cancelled-popup-request',
    'auth/operation-not-supported-in-this-environment',
  ].includes(code)
}

function getAuthErrorMessage(error: unknown) {
  const code = getErrorCode(error)

  if (code === 'auth/unauthorized-domain') {
    return 'Firebase Auth 승인 도메인에 현재 주소가 없습니다. Firebase 콘솔에서 127.0.0.1 또는 localhost를 추가해 주세요.'
  }

  if (code === 'auth/popup-closed-by-user') {
    return '로그인 창이 닫혔습니다. 다시 시도해 주세요.'
  }

  if (code === 'auth/popup-blocked') {
    return '브라우저가 로그인 팝업을 차단했습니다. 리다이렉트 방식으로 다시 시도합니다.'
  }

  if (code === 'auth/configuration-not-found') {
    return 'Firebase 콘솔에서 Google 로그인 제공자가 활성화되어 있는지 확인해 주세요.'
  }

  if (error instanceof Error) {
    return error.message
  }

  return 'Google 로그인에 실패했습니다.'
}

function getErrorCode(error: unknown) {
  if (typeof error === 'object' && error && 'code' in error) {
    return String(error.code)
  }

  return ''
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider.')
  }

  return context
}
