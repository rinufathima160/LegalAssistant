from .pdf_loader import load_pdf_folder
from .text_splitter import split_text
from .embedder import embed_text, get_model
from .vector_store import add_embeddings, search
from app.gemini.gemini_client import generate_text


def initialize_rag():
    print("📄 Loading PDF documents...")
    text = load_pdf_folder("legal_docs")

    print("✂️ Splitting text into chunks...")
    chunks = split_text(text)

    print("🧠 Generating embeddings...")
    vectors = embed_text(chunks)   # [(chunk, vector), ...]

    print("💾 Saving vectors to ChromaDB...")
    add_embeddings(chunks, vectors)

    print("✅ RAG initialized successfully.")


def answer_query(query: str) -> str:
    model = get_model()
    query_vec = model.encode([query], convert_to_numpy=True)[0]

    results = search(query_vec)

    # DEBUG PRINT (VERY IMPORTANT)
    print("Retrieved documents count:",
          len(results.get("documents", [[]])[0]))

    docs = results.get("documents", [[]])[0]

    if not docs:
        return "Information not available in the legal documents."

    # 🔹 Use top 5 chunks always
    context = "\n".join(docs[:5])

    prompt = f"""
You are an AI Legal Assistant specialized in Indian law.

Answer the question using ONLY the following legal context.
If the context is insufficient, say so politely.

LEGAL CONTEXT:
{context}

QUESTION:
{query}
"""

    return generate_text(prompt)
