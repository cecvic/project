import React from 'react'
import FinanceAnalysis from '@/app/components/finance-analysis'

export default function Home() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-gray-100">
          Finance Analysis
        </h1>
        <FinanceAnalysis />
      </div>
    </main>
  )
}