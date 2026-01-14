from .pdf_loader import load_pdf_folder
from .text_splitter import split_text
from .embedder import embed_text
from .vector_store import add_embeddings, search
from app.gemini.gemini_client import generate_text

from sentence_transformers import SentenceTransformer

model = SentenceTransformer("all-MiniLM-L6-v2")

def initialize_rag():
    print(" Loading PDF documents...")
    text = load_pdf_folder("legal_docs")

    print(" Splitting text into chunks...")
    chunks = split_text(text)

    print(" Generating embeddings (local)...")
    vectors = embed_text(chunks)

    print(" Saving vectors to ChromaDB...")
    add_embeddings(chunks, vectors)

    print(" RAG initialized successfully.")

def answer_query(query):
    query_vec = model.encode([query])[0]

    results = search(query_vec)
    context_docs = results["documents"][0]
    context = "\n".join(context_docs)

    prompt = f"""
Use only the following legal context to answer the question.
If the context does not contain the answer, reply: "Information not available in legal documents."

CONTEXT:
{context}

QUESTION:
{query}

Provide a clear, legally correct answer.
"""

    return generate_text(prompt)
