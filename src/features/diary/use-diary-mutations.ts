import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createDiaryEntry,
  deleteDiaryEntry,
  updateDiaryEntry,
} from './diary-service'
import { diaryEntriesQueryKey } from './use-diary-entries'
import type { DiaryEntryInput } from './types'

export function useCreateDiaryEntry(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: DiaryEntryInput) => createDiaryEntry(userId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: diaryEntriesQueryKey(userId),
      })
    },
  })
}

export function useUpdateDiaryEntry(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ entryId, input }: { entryId: string; input: DiaryEntryInput }) =>
      updateDiaryEntry(userId, entryId, input),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: diaryEntriesQueryKey(userId),
      })
    },
  })
}

export function useDeleteDiaryEntry(userId: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (entryId: string) => deleteDiaryEntry(userId, entryId),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: diaryEntriesQueryKey(userId),
      })
    },
  })
}
