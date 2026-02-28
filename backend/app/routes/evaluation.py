from fastapi import APIRouter
from app.evaluation.evaluator import get_evaluations

router = APIRouter()

@router.get("/")
def get_evaluation():
    results = get_evaluations()

    if not results:
        return {
            "average_precision": 0,
            "average_mrr": 0,
            "average_groundedness": 0,  # ✅ ADD
            "results": []
        }

    avg_precision = sum(r["retrieval"]["precision"] for r in results) / len(results)
    avg_mrr = sum(r["retrieval"]["mrr"] for r in results) / len(results)

    # ✅ NEW: GROUNDEDNESS
    avg_groundedness = sum(
        r.get("groundedness", 0) for r in results
    ) / len(results)

    return {
        "average_precision": round(avg_precision, 3),
        "average_mrr": round(avg_mrr, 3),
        "average_groundedness": round(avg_groundedness, 3),  # ✅ ADD
        "results": results
    }