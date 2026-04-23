import { useMutation } from '@tanstack/react-query'

import { generateMonthlySummary } from './summary-service'

export function useMonthlySummary() {
  return useMutation({
    mutationFn: generateMonthlySummary,
  })
}
