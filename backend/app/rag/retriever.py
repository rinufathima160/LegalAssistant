# app/rag/retriever.py
from chromadb import Client
from chromadb.config import Settings

class Retriever:
    def __init__(self):
        self.client = Client(Settings(chroma_db_impl="duckdb+parquet", persist_directory="vector_store"))
        self.collection = self.client.get_collection("legal_docs")

    def search(self, query: str, top_k: int = 4):
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k
        )
        return results["documents"][0]
