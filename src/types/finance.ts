export interface AnalysisRequest {
  symbol: string
  analysisType: 'recommendations' | 'price' | 'info' | 'news'
}

export interface AnalysisResponse {
  response?: string
  error?: string
}