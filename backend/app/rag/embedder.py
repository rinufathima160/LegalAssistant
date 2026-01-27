from sentence_transformers import SentenceTransformer

model = None

def get_model():
    global model
    if model is None:
        model = SentenceTransformer("all-MiniLM-L6-v2")
    return model
def embed_text(chunks, batch_size=32):
    model = get_model()
    all_vectors = []

    for i in range(0, len(chunks), batch_size):
        batch = chunks[i:i+batch_size]
        batch_vectors = model.encode(batch, convert_to_numpy=True)
        all_vectors.extend(zip(batch, batch_vectors))

    return all_vectors
