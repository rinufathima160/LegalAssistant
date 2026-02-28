# app/rag/retriever.py

from chromadb import Client
from chromadb.config import Settings

class Retriever:
    def __init__(self):
        self.client = Client(Settings(
            persist_directory="vector_store"
        ))

        # ✅ IMPORTANT
        self.collection = self.client.get_or_create_collection("legal_docs")

        print("📦 COLLECTION COUNT:", self.collection.count())

    def search(self, query: str, top_k: int = 4):
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k
        )

        print("🔍 RAW RESULT:", results)

        return results["documents"][0] if results["documents"] else []