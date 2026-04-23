import type { DiaryEntry } from './types'

interface GenerateSummaryInput {
  monthLabel: string
  entries: DiaryEntry[]
}

export async function generateMonthlySummary({
  monthLabel,
  entries,
}: GenerateSummaryInput) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''

  const response = await fetch(`${apiBaseUrl}/api/summary`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      monthLabel,
      entries: entries.map((entry) => ({
        date: entry.entryDate,
        title: entry.title,
        content: entry.content,
      })),
    }),
  })

  const data = (await response.json()) as { summary?: string; error?: string }

  if (!response.ok) {
    throw new Error(data.error ?? 'AI 요약 생성에 실패했습니다.')
  }

  return data.summary ?? ''
}
