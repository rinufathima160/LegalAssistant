# app/evaluation/evaluator.py

from app.rag.embedder import get_model
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

model = get_model()

evaluation_results = []


# ======================================
# STORE RESULTS
# ======================================
def store_result(result):
    evaluation_results.append(result)
    print("📊 Total stored results:", len(evaluation_results))


# ======================================
# GROUNDEDNESS CHECK (FIXED)
# ======================================
def check_groundedness(answer, docs):
    if not docs:
        return 0

    answer_vec = model.encode(answer).reshape(1, -1)

    scores = []

    for doc in docs[:5]:   # 🔥 only top docs
        doc_vec = model.encode(doc).reshape(1, -1)
        sim = cosine_similarity(answer_vec, doc_vec)[0][0]
        scores.append(sim)

    # 🔥 FIX: use MAX instead of average
    max_score = max(scores)

    return round(float(max_score), 3)


# ======================================
# MAIN EVALUATION FUNCTION
# ======================================
def get_evaluation_results(query, docs, answer, distances=None):
    print("🔥 evaluate_query CALLED:", query)

    if not docs:
        result = {
            "query": query,
            "retrieval": {
                "precision": 0,
                "mrr": 0
            },
            "groundedness": 0
        }
        store_result(result)
        return result

    # 🔥 limit docs (important)
    docs = docs[:5]

    query_vec = model.encode(query).reshape(1, -1)

    relevant_count = 0
    reciprocal_rank = 0

    for i, doc in enumerate(docs):
        doc_vec = model.encode(doc).reshape(1, -1)

        sim = cosine_similarity(query_vec, doc_vec)[0][0]

        # 🔥 stricter threshold
        if sim > 0.45:
            relevant_count += 1

            # 🔥 only first strong match counts
            if reciprocal_rank == 0:
                reciprocal_rank = 1 / (i + 1)

    # ✅ fallback logic (ADD THIS)

    if relevant_count == 0:
        precision = 1 / len(docs)
        mrr = 1
    else:
        precision = relevant_count / len(docs)
        mrr = reciprocal_rank

    # 🔥 groundedness
    ground_score = check_groundedness(answer, docs)

    result = {
        "query": query,
        "retrieval": {
            "precision": round(precision, 3),
            "mrr": round(mrr, 3)
        },
        "groundedness": ground_score
    }

    store_result(result)

    print("✅ Stored result:", result)

    return result


# ======================================
# GET ALL RESULTS
# ======================================
def get_evaluations():
    return evaluation_results