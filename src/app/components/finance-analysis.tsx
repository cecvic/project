'use client'

import React, { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/Button'
import { useFinanceAnalysis } from '@/hooks/useFinanceAnalysis'
import type { AnalysisRequest } from '@/types/finance'

export default function FinanceAnalysis() {
  const [symbol, setSymbol] = useState('')
  const [analysisType, setAnalysisType] = useState<AnalysisRequest['analysisType']>('recommendations')
  const { isLoading, result, error, analyze } = useFinanceAnalysis()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!symbol) return

    await analyze({
      symbol: symbol.toUpperCase(),
      analysisType
    })
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="card p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="symbol" className="block text-sm font-medium mb-2 text-gray-200">
              Stock Symbol
            </label>
            <input
              id="symbol"
              type="text" 
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="input-field w-full px-4 py-2 rounded-lg focus:outline-none"
              placeholder="e.g. NVDA"
              aria-label="Stock Symbol"
              required
            />
          </div>

          <div>
            <label htmlFor="analysisType" className="block text-sm font-medium mb-2 text-gray-200">
              Analysis Type
            </label>
            <select
              id="analysisType"
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value as AnalysisRequest['analysisType'])}
              className="input-field w-full px-4 py-2 rounded-lg focus:outline-none"
              aria-label="Analysis Type"
            >
              <option value="recommendations">Analyst Recommendations</option>
              <option value="price">Stock Price Analysis</option>
              <option value="info">Company Info</option>
              <option value="news">Latest News</option>
            </select>
          </div>

          <Button 
            type="submit" 
            isLoading={isLoading}
            className="w-full py-3 text-sm font-medium"
          >
            Analyze Stock
          </Button>
        </form>
      </div>

      {error && (
        <div className="card p-4 mb-6 border-red-500 bg-red-500/10" role="alert">
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {result?.response && (
        <div className="card p-6">
          <ReactMarkdown className="prose prose-invert max-w-none">
            {result.response}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}