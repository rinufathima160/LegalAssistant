from sentence_transformers import SentenceTransformer

model = None

def get_model():
    global model
    if model is None:
        model = SentenceTransformer("all-MiniLM-L6-v2")
    return model
def embed_text(chunks):
    """Generate embeddings using local SentenceTransformer"""
    model=get_model()
    vectors = model.encode(chunks, convert_to_numpy=True)
    return list(zip(chunks, vectors))
