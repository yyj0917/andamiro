# 배포 빌드 최적화 정리

Vercel 배포 로그에서 빌드 자체는 빠르게 끝났지만, 빌드 캐시 생성/업로드 대상이 커져 전체 배포 시간이 길어지는 문제가 있었습니다. 특히 로컬 폰트 파일이 `dist/assets`에 여러 개 포함되면서 빌드 산출물과 캐시 크기가 불필요하게 커졌습니다.

## 확인된 문제

배포 로그에서 다음과 같은 큰 폰트 파일들이 산출물에 포함되었습니다.

- `noto-sans-kr-korean-*.woff`
- `noto-serif-kr-korean-*.woff2`
- 여러 font weight 별 파일

이 방식은 앱 첫 화면에 필요한 코드보다 폰트 리소스가 더 크게 잡히고, Vercel이 배포 후 생성하는 build cache 크기도 같이 증가시킵니다. 당시 로그 기준 build cache 업로드 대상이 약 `199 MB`까지 커졌습니다.

## 적용한 최적화

### 1. 로컬 fontsource 패키지 제거

기존에는 `@fontsource/noto-sans-kr`, `@fontsource/noto-serif-kr` 방식으로 폰트를 앱 번들 안에 포함했습니다.

이 패키지들은 한글 폰트 weight별 파일을 `dist/assets`로 복사하기 때문에 정적 산출물이 커집니다. 해당 패키지를 제거하고, 폰트는 Google Fonts CDN에서 로드하도록 변경했습니다.

현재 `index.html`에서 직접 로드합니다.

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Noto+Serif+KR:wght@300;400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

효과:

- `dist/assets`에 한글 폰트 파일이 복사되지 않음
- Vercel build cache 대상 크기 감소
- 앱 JS/CSS 번들에서 폰트 파일 의존성 제거
- 브라우저/CDN 캐싱 활용 가능

### 2. Vite manual chunks 설정

Firebase, React, TanStack Query/Zustand를 별도 chunk로 분리했습니다.

설정 위치: `vite.config.ts`

```ts
build: {
  rollupOptions: {
    output: {
      manualChunks(id) {
        if (id.includes('node_modules/firebase')) {
          return 'firebase'
        }

        if (id.includes('node_modules/react')) {
          return 'react'
        }

        if (
          id.includes('node_modules/@tanstack/react-query') ||
          id.includes('node_modules/zustand')
        ) {
          return 'query'
        }

        return undefined
      },
    },
  },
},
```

효과:

- 앱 코드 변경 시 React/Firebase 같은 vendor chunk 캐시 재사용 가능
- 초기 앱 chunk가 작아짐
- Vercel과 브라우저 양쪽에서 변경 빈도가 낮은 의존성 캐싱에 유리
- `500 kB chunk warning`이 앱 코드 전체 문제처럼 보이는 상황을 줄임

### 3. 빌드 산출물 확인

최적화 후 `npm run build` 기준 대표 산출물은 다음 수준으로 정리되었습니다.

```text
dist/assets/query-*.js       약 36 kB
dist/assets/index-*.js       약 45 kB
dist/assets/react-*.js       약 182 kB
dist/assets/firebase-*.js    약 366 kB
dist/assets/index-*.css      약 50 kB
```

큰 한글 폰트 파일이 `dist/assets`에서 빠졌고, Firebase는 별도 chunk로 분리되어 앱 코드와 독립적으로 캐시될 수 있습니다.

## 현재 빌드 명령

```bash
npm run build
```

내부적으로 다음을 실행합니다.

```bash
tsc -b && vite build
```

Capacitor 네이티브 앱에 반영할 때는 다음 명령을 사용합니다.

```bash
npm run cap:sync
```

이 명령은 `npm run build` 후 `npx cap sync`를 실행합니다.

## 유지보수 기준

다음 변경을 할 때 빌드 크기를 다시 확인합니다.

- 한글 폰트 weight 추가
- 새 UI 라이브러리 추가
- Firebase SDK import 범위 확대
- 차트/캘린더/에디터 같은 큰 패키지 추가
- AI SDK를 클라이언트 번들로 잘못 import하는 변경

확인 명령:

```bash
npm run build
```

빌드 결과에서 `dist/assets`에 큰 파일이 추가되면 원인을 먼저 봅니다.

## 주의사항

`api/summary.ts`의 Vercel AI SDK 코드는 서버 함수입니다. 이 코드를 React 컴포넌트나 클라이언트 서비스에서 직접 import하면 AI SDK와 서버 전용 코드가 클라이언트 번들에 들어갈 수 있습니다.

클라이언트에서는 반드시 `src/features/diary/summary-service.ts`처럼 `/api/summary`에 HTTP 요청만 보내는 구조를 유지합니다.
