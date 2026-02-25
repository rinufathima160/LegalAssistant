import { Line } from "react-chartjs-2"

interface EvaluationResult {
  query: string
  retrieval: {
    mrr: number
    precision: number
  }
}

export function EvaluationLine({ results }: { results: EvaluationResult[] }) {

  if (!results || results.length === 0) return null

  const data = {
    labels: results.map((_, i) => `Q${i + 1}`),
    datasets: [
      {
        label: "MRR",
        data: results.map(r => r.retrieval.mrr),
        borderColor: "blue",
        tension: 0.4,
      },
      {
        label: "Precision",
        data: results.map(r => r.retrieval.precision),
        borderColor: "green",
        tension: 0.4,
      },
    ],
  }

  return (
    <div style={{ height: "400px" }}>
      <Line data={data} options={{ responsive: true, maintainAspectRatio: false }} />
    </div>
  )
}