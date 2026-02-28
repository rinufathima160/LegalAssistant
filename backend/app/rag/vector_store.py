# app/rag/vector_store.py

from chromadb import Client
from chromadb.config import Settings

# ✅ PERSISTENT DATABASE (IMPORTANT FIX)
client = Client(Settings(
    persist_directory="vector_store"
))

collection = client.get_or_create_collection(
    name="legal_docs",
    metadata={"hnsw:space": "cosine"}
)

# =====================================
# ADD EMBEDDINGS
# =====================================
def add_embeddings(chunks, vectors, batch_size=1000):
    ids = [f"chunk_{i}" for i in range(len(vectors))]
    docs = [v[0] for v in vectors]
    embeddings = [v[1].tolist() for v in vectors]  # ✅ FIX

    for i in range(0, len(embeddings), batch_size):
        collection.add(
            ids=ids[i:i+batch_size],
            documents=docs[i:i+batch_size],
            embeddings=embeddings[i:i+batch_size]
        )

    print("📦 Stored documents:", len(embeddings))
    print("📦 Collection count:", collection.count())


# =====================================
# SEARCH
# =====================================
def search(query_vector, top_k=5):
    results = collection.query(
        query_embeddings=[query_vector.tolist()],
        n_results=top_k,
        include=["documents", "distances"]  # ✅ ADD THIS
    )

    print("🔍 RAW CHROMA RESULT:", results)

    return results