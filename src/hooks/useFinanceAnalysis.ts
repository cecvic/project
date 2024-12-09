import { useState } from 'react'
import { AnalysisRequest, AnalysisResponse } from '@/types/finance'
import { getFinanceAnalysis } from '@/services/api'

export function useFinanceAnalysis() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<AnalysisResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const analyze = async (request: AnalysisRequest) => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await getFinanceAnalysis(request)
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    result,
    error,
    analyze
  }
}