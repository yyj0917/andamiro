# Andamiro Capacitor 설정

안다미로는 Vite/React 빌드 결과물인 `dist`를 Capacitor WebView에 싣는 구조입니다. 웹 배포는 Vercel, 네이티브 앱 배포는 Capacitor의 `ios`, `android` 프로젝트를 통해 진행합니다.

## 설치된 Capacitor 패키지

- `@capacitor/core`: 앱 런타임
- `@capacitor/cli`: Capacitor 명령어
- `@capacitor/ios`: iOS 네이티브 프로젝트
- `@capacitor/android`: Android 네이티브 프로젝트
- `@capacitor/splash-screen`: 네이티브 스플래시 화면
- `@capacitor/status-bar`: 네이티브 상태바 색상/스타일

## 현재 설정 파일

설정 파일은 `capacitor.config.ts`입니다.

```ts
appId: 'com.andamiro.app'
appName: '안다미로'
webDir: 'dist'
backgroundColor: '#F4EFE6'
```

- `appId`: iOS Bundle Identifier, Android Application ID 기준값입니다.
- `appName`: 홈 화면과 네이티브 프로젝트에 표시되는 앱 이름입니다.
- `webDir`: `npm run build`가 만든 정적 파일 위치입니다.
- `backgroundColor`: 앱 로딩 배경을 한지색 `#F4EFE6`로 맞춥니다.
- `ios.contentInset`: iOS Safe Area 처리를 자동으로 둡니다.
- `android.allowMixedContent`: HTTPS 앱에서 HTTP 혼합 콘텐츠를 막습니다.
- `SplashScreen`: 한지색 배경, 스피너 없음, 1.2초 자동 숨김입니다.
- `StatusBar`: 한지색 배경과 어두운 아이콘 스타일을 사용합니다.

## npm 스크립트

```bash
npm run cap:sync
npm run cap:open:ios
npm run cap:open:android
```

- `cap:sync`: `npm run build` 후 `npx cap sync`를 실행해 최신 웹 빌드와 플러그인을 iOS/Android에 반영합니다.
- `cap:open:ios`: Xcode로 iOS 프로젝트를 엽니다.
- `cap:open:android`: Android Studio로 Android 프로젝트를 엽니다.

## 배포 전 기본 순서

```bash
npm run lint
npm test
npm run build
npm run cap:sync
```

이후 플랫폼별 IDE에서 실행/서명/스토어 배포를 진행합니다.

## 환경변수

웹과 네이티브에서 필요한 환경변수는 `.env.example`에 정리되어 있습니다.

```bash
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_API_BASE_URL=
AI_GATEWAY_API_KEY=
```

- `AI_GATEWAY_API_KEY`는 서버 전용입니다. `VITE_` 접두사를 붙이면 클라이언트 번들에 노출되므로 사용하지 않습니다.
- 로컬 개발에서는 `.env.local`에 `AI_GATEWAY_API_KEY`가 들어 있습니다.
- Vercel 배포에서는 프로젝트 환경변수에 `AI_GATEWAY_API_KEY`를 Production/Preview/Development 모두 추가해야 합니다.
- Capacitor 네이티브 앱에서 AI 요약 API를 호출하려면 빌드 전에 `VITE_API_BASE_URL`을 Vercel 배포 도메인으로 설정합니다.

예시:

```bash
VITE_API_BASE_URL=https://andamiro.vercel.app
```

웹 배포 안에서는 빈 값으로 둬도 `/api/summary` 상대 경로가 동작합니다. 하지만 Capacitor 앱은 `capacitor://localhost`에서 실행되므로 빈 값이면 `/api/summary`가 Vercel 함수로 가지 않습니다.

## AI 요약 동작

- Vercel AI SDK의 `generateText`를 사용합니다.
- 모델은 `openai/gpt-5.4-mini`입니다.
- API 엔드포인트는 `api/summary.ts`입니다.
- 클라이언트는 `src/features/diary/summary-service.ts`에서 버튼 클릭 시에만 요청합니다.
- 자동 생성은 하지 않습니다. 사용자가 `요약 생성`을 누른 뒤에만 AI 요청이 발생합니다.

## iOS 실행 및 배포

1. Xcode를 설치합니다.
2. `npm run cap:sync`를 실행합니다.
3. `npm run cap:open:ios`로 Xcode를 엽니다.
4. Xcode의 Signing & Capabilities에서 Apple Developer Team을 선택합니다.
5. Bundle Identifier가 `com.andamiro.app`인지 확인합니다.
6. 실제 기기 또는 시뮬레이터에서 실행합니다.
7. 배포 시 Product > Archive로 App Store Connect 업로드를 진행합니다.

iOS에서 Google 로그인까지 완전히 검증하려면 Firebase Authentication의 승인 도메인과 OAuth 리다이렉트 흐름을 실제 앱 환경에서 확인해야 합니다. 현재 앱은 Firebase Web SDK 기반 로그인입니다.

## Android 실행 및 배포

1. Android Studio와 Android SDK를 설치합니다.
2. `npm run cap:sync`를 실행합니다.
3. `npm run cap:open:android`로 Android Studio를 엽니다.
4. Gradle Sync가 끝난 뒤 에뮬레이터 또는 실제 기기에서 실행합니다.
5. 배포 전 릴리즈 서명 키를 만들고 `android/app`의 signing config를 설정합니다.
6. Play Console 배포에는 AAB 빌드를 사용합니다.

Android에서도 Google 로그인은 실제 패키지명, SHA-1/SHA-256, Firebase OAuth 설정이 맞아야 합니다.

## Firebase 체크리스트

- Firestore Rules 배포: `firebase deploy --only firestore:rules`
- Firebase Authentication의 Google provider 활성화
- Vercel 도메인을 Firebase Authentication 승인 도메인에 추가
- Android 배포 시 Firebase Android 앱 등록 및 SHA-1/SHA-256 추가
- iOS 배포 시 Firebase iOS 앱 등록 및 Bundle ID 일치 확인

## 변경 후 동기화 원칙

다음 변경을 하면 항상 `npm run cap:sync`를 실행합니다.

- `src` 코드 변경 후 네이티브 앱에 반영할 때
- `public` 정적 파일이나 PWA 아이콘 변경
- Capacitor 플러그인 설치/삭제
- `capacitor.config.ts` 변경
- `VITE_` 환경변수 변경

## 주의할 점

- `.env.local`은 커밋하지 않습니다.
- `AI_GATEWAY_API_KEY`는 Vercel 서버 함수에서만 읽습니다.
- 네이티브 앱은 빌드 시점의 `VITE_` 환경변수를 포함하므로, 배포 도메인이 바뀌면 다시 빌드하고 sync해야 합니다.
- App Store/Play Store 아이콘과 스플래시 자산은 스토어 제출 전 최종 해상도 검수를 해야 합니다.
