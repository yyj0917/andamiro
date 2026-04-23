import { generateText } from 'ai'

interface ApiRequest {
  method?: string
  body?: unknown
}

interface ApiResponse {
  setHeader: (name: string, value: string) => void
  status: (code: number) => {
    json: (body: unknown) => void
  }
}

interface SummaryEntry {
  date: string
  title: string
  content: string
}

interface SummaryRequestBody {
  monthLabel?: string
  entries?: SummaryEntry[]
}

export default async function handler(req: ApiRequest, res: ApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  if (!process.env.AI_GATEWAY_API_KEY) {
    return res.status(500).json({
      error: 'AI Gateway API key is not configured.',
    })
  }

  const { entries = [], monthLabel = '이번 달' } =
    (req.body ?? {}) as SummaryRequestBody

  if (!entries.length) {
    return res.status(400).json({
      error: '요약할 일기가 없습니다.',
    })
  }

  const diaryText = entries
    .map(
      (entry, index) =>
        `#${index + 1}\n날짜: ${entry.date}\n제목: ${entry.title || '제목 없음'}\n내용:\n${entry.content}`,
    )
    .join('\n\n---\n\n')

  const result = await generateText({
    model: 'openai/gpt-5.4-mini',
    system:
      '너는 개인 일기 앱의 조용하고 사려 깊은 회고 도우미다. 사용자의 일기를 과장하지 말고, 한국어로 따뜻하지만 담백하게 요약한다. 민감한 판단, 진단, 단정은 피한다.',
    prompt: `${monthLabel} 일기들을 요약해줘.\n\n요구사항:\n- 4문장 이내의 짧은 문단으로 요약\n- 감정 흐름 2~3개\n- 반복적으로 보이는 키워드 3~5개\n- 다음 달을 위한 작은 문장 1개\n\n일기:\n${diaryText}`,
  })

  return res.status(200).json({ summary: result.text })
}
