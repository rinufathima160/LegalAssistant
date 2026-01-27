import chromadb

client = chromadb.Client()
collection = client.get_or_create_collection(
    "legal_docs",
    metadata={"hnsw:space": "cosine"}
)

def add_embeddings(chunks, vectors, batch_size=1000):
    ids = [f"chunk_{i}" for i in range(len(vectors))]
    docs = [v[0] for v in vectors]
    embeddings = [v[1] for v in vectors]

    for i in range(0, len(embeddings), batch_size):
        collection.add(
            ids=ids[i:i+batch_size],
            documents=docs[i:i+batch_size],
            embeddings=embeddings[i:i+batch_size]
        )

def search(query_vector, top_k=5):
    return collection.query(
        query_embeddings=[query_vector],
        n_results=top_k
    )
