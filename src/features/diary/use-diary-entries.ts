import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useMemo } from 'react'

import { getDiaryEntries, subscribeDiaryEntries } from './diary-service'

export const diaryEntriesQueryKey = (userId: string | undefined) => [
  'diary-entries',
  userId,
]

export function useDiaryEntries(userId: string | undefined) {
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: diaryEntriesQueryKey(userId),
    queryFn: () => getDiaryEntries(userId as string),
    enabled: Boolean(userId),
  })

  useEffect(() => {
    if (!userId) {
      return
    }

    return subscribeDiaryEntries(
      userId,
      (nextEntries) => {
        queryClient.setQueryData(diaryEntriesQueryKey(userId), nextEntries)
      },
      (error) => {
        queryClient.setQueryData(diaryEntriesQueryKey(userId), [])
        console.error(error)
      },
    )
  }, [queryClient, userId])

  const entries = useMemo(() => query.data ?? [], [query.data])
  const entryDates = useMemo(
    () => entries.map((entry) => formatDateDots(entry.entryDate)),
    [entries],
  )

  return {
    entries,
    entryDates,
    loading: query.isLoading,
    error: query.error instanceof Error ? getDiaryErrorMessage(query.error) : null,
  }
}

export function formatDateDots(date: string) {
  return date.replaceAll('-', '.')
}

export function todayInputValue() {
  return new Date().toISOString().slice(0, 10)
}

function getDiaryErrorMessage(error: Error) {
  if (error.message.toLowerCase().includes('permission')) {
    return 'Firestore 권한이 아직 설정되지 않았습니다. Firebase 콘솔에서 로그인한 사용자만 자신의 일기를 읽고 쓸 수 있도록 rules를 배포해 주세요.'
  }

  return error.message
}
