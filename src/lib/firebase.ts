import { getAnalytics, isSupported, type Analytics } from 'firebase/analytics'
import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  getAuth,
  GoogleAuthProvider,
  type Auth,
  type AuthProvider,
} from 'firebase/auth'
import { getFirestore, type Firestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

const hasFirebaseConfig = Object.values(firebaseConfig).every(Boolean)

export const firebaseApp: FirebaseApp | null = hasFirebaseConfig
  ? initializeApp(firebaseConfig)
  : null

export const firebaseAnalytics: Promise<Analytics | null> = firebaseApp
  ? isSupported().then((supported) =>
      supported ? getAnalytics(firebaseApp) : null,
    )
  : Promise.resolve(null)

export const firebaseAuth: Auth | null = firebaseApp ? getAuth(firebaseApp) : null

export const googleAuthProvider: AuthProvider = new GoogleAuthProvider()

export const firestore: Firestore | null = firebaseApp
  ? getFirestore(firebaseApp)
  : null
