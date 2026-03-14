
from .pdf_loader import load_pdf_folder
from .text_splitter import split_text
from .embedder import embed_text, get_model
from .vector_store import add_embeddings, search
from app.gemini.gemini_client import generate_text
from app.rag.embedder import get_model
from .clean_text import clean_text
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

model = get_model()



def initialize_rag():
    print(" Loading PDF documents...")
    text = load_pdf_folder("legal_docs")

    # ✅ CLEAN TEXT
   

    print(" Splitting text into chunks...")
    chunks = split_text(text)

    print(" Generating embeddings...")
    vectors = embed_text(chunks)   # [(chunk, vector), ...]

    print(" Saving vectors to ChromaDB...")
    add_embeddings(chunks, vectors)

    print("📦 Total chunks stored:", len(chunks))   # ✅ ADD THIS

    print("✅ RAG initialized successfully.")
from sklearn.metrics.pairwise import cosine_similarity

def get_relevant_history(current_query, chat_history, top_k=2):

    if not chat_history:
        return []

    query_vec = model.encode(current_query)

    scored = []

    for item in chat_history:
        q = item["question"]

        hist_vec = model.encode(q)

        sim = cosine_similarity(
            query_vec.reshape(1, -1),
            hist_vec.reshape(1, -1)
        )[0][0]

        scored.append((item, sim))

    scored.sort(key=lambda x: x[1], reverse=True)

    relevant = [
        item for item, sim in scored[:top_k]
        if sim > 0.4
    ]

    return relevant

def answer_query(query: str, chat_history=[]) -> str:
    model = get_model()
    query_vec = model.encode([query], convert_to_numpy=True)[0]

    results = search(query_vec)

    # DEBUG PRINT (VERY IMPORTANT)
    print("Retrieved documents count:",
          len(results.get("documents", [[]])[0]))

    docs = results.get("documents", [[]])[0]
    distances = results.get("distances", [[]])[0]
    if not docs:
        return "Information not available in the legal documents."

    # 🔹 Use top 5 chunks always
    context = "\n".join(docs[:5])
    # 🔥 GET ONLY RELEVANT HISTORY
    relevant_history = get_relevant_history(query, chat_history)

    history_text = ""

    for item in relevant_history:
        history_text += f"Q: {item['question']}\nA: {item['answer']}\n"  


    prompt = f"""
You are a friendly AI Legal Assistant for Indian law.

Your job is to explain legal topics in very simple language,
so that a common person with no legal background can understand.

Rules:
- Use short paragraphs
- Avoid legal jargon
-Use only the given legal context.
-Do not add information not present in context.
- Do NOT mention sections unless necessary
- Do NOT say "legal context is insufficient"
- Do NOT talk like a chatbot
- Do NOT say "As an AI language model"
-Do NOT mention previous questions answer if they are not relevant
- Do NOT say "you explained" or "great question"
- If exact procedure is not in documents, give a general explanation
- Explain step-by-step where possible
- Keep answers clear and practical
-Do NOT mix with previous unrelated questions
Previous relevant conversation:
{history_text}
LEGAL CONTEXT:
{context}

USER QUESTION (with context):
{query}
Answer clearly in simple language.
"""
    # 🔥 PASS DOCS + ANSWER
    answer = generate_text(prompt)

    # ✅ THEN EVALUATE
    
    from app.evaluation.evaluator import get_evaluation_results
    get_evaluation_results(query, docs, answer,distances)

    return answer

    



    

