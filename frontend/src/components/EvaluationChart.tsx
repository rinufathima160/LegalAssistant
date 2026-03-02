import { Bar } from "react-chartjs-2"

interface EvaluationResult {
  query: string
  retrieval: {
    mrr: number
    precision: number
  }
  groundedness: number   // ✅ ADD THIS
}

export function EvaluationChart({ results }: { results: EvaluationResult[] }) {

  if (!results) {
    return <p>No data available</p>
  }

  if (results.length === 0) {
    return <p>No evaluation data yet</p>
  }

  const labels = results.map(r => {
  const text = (r.query).toLowerCase()

  // remove common words
  const stopWords = ["what", "is", "the", "of", "and", "a", "in"]

  const filtered = text
    .split(" ")
    .filter(word => !stopWords.includes(word))
    .slice(0, 3)
    .join(" ")

  return filtered
})

  const mrrData = results.map(r => r.retrieval.mrr)
  const precisionData = results.map(r => r.retrieval.precision)
  const groundednessData = results.map(r => r.groundedness || 0) // ✅ NEW

  const data = {
    labels,
    datasets: [
      {
        label: "MRR",
        data: mrrData,
        backgroundColor: "rgba(59,130,246,0.7)",
        borderRadius: 6,
      },
      {
        label: "Precision",
        data: precisionData,
        backgroundColor: "rgba(16,185,129,0.7)",
        borderRadius: 6,
      },
      {
        label: "Groundedness", // ✅ NEW
        data: groundednessData,
        backgroundColor: "rgba(255,99,132,0.7)",
        borderRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1, // ✅ important
      },
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
  }

  return (
    <div style={{ height: "400px" }}>
      <Bar data={data} options={options} />
    </div>
  )
}