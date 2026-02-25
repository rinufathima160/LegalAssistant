import { Radar } from "react-chartjs-2"

interface EvaluationResult {
  query: string
  retrieval: {
    mrr: number
    precision: number
  }
}

export function EvaluationRadar({ results }: { results: EvaluationResult[] }) {

  if (!results || results.length === 0) return null

  const data = {
    labels: results.map((_, i) => `Q${i + 1}`),
    datasets: [
      {
        label: "MRR",
        data: results.map(r => r.retrieval.mrr),
      },
      {
        label: "Precision",
        data: results.map(r => r.retrieval.precision),
      },
    ],
  }

  return (
    <div style={{ height: "400px" }}>
      <Radar data={data} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  )
}