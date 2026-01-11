import chromadb

client = chromadb.Client()
collection = client.get_or_create_collection(
    "legal_docs",
    metadata={"hnsw:space": "cosine"}
)

def add_embeddings(chunks, vectors):
    ids = [f"chunk_{i}" for i in range(len(vectors))]
    docs = [v[0] for v in vectors]
    embeddings = [v[1] for v in vectors]

    collection.add(
        ids=ids,
        documents=docs,
        embeddings=embeddings
    )

def search(query_vector, top_k=5):
    return collection.query(
        query_embeddings=[query_vector],
        n_results=top_k
    )
