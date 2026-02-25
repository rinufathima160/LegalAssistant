import { useEffect, useState } from "react"
import { EvaluationChart } from "../components/EvaluationChart"

import "../lib/chartSetup"

interface EvaluationResult {
  query: string
  retrieval: {
    mrr: number
    precision: number
  }
  groundedness: number   // ✅ ADD THIS
}

interface EvaluationData {
  average_precision: number
  average_mrr: number
  average_groundedness: number   // ✅ ADD THIS
  results: EvaluationResult[]
}

export function EvaluationPage() {

  const [data, setData] = useState<EvaluationData | null>(null)

  useEffect(() => {
    fetch("http://127.0.0.1:8000/evaluation/")
      .then(res => res.json())
      .then(setData)
  }, [])

  if (!data) return <p>Loading...</p>

  return (
    <div className="p-6 space-y-10">

      <h2 className="text-2xl font-bold">Performance Evaluation</h2>

      <p>Average Precision: {data.average_precision}</p>
      <p>Average MRR: {data.average_mrr}</p>
      <p>Average Groundedness: {data.average_groundedness}</p> {/* ✅ NEW */}

      <EvaluationChart results={data.results || []} />

    </div>
  )
}