import { AnalysisRequest, AnalysisResponse } from '@/types/finance'

export async function getFinanceAnalysis(request: AnalysisRequest): Promise<AnalysisResponse> {
  const response = await fetch('/api/finance-agent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request)
  })

  const data = await response.json()
  
  if (!response.ok) {
    throw new Error(data.error || 'Failed to analyze stock')
  }

  return data
}