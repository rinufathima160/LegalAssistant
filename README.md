# ⚖️ Personal AI Legal Assistant for India

An AI-powered legal assistant that helps users understand Indian laws using Retrieval-Augmented Generation (RAG). The application retrieves relevant legal information from trusted sources and generates context-aware, easy-to-understand responses.

> **Disclaimer:** This application is for educational and informational purposes only. It does not provide legal advice and should not replace consultation with a qualified legal professional.

---

## 🚀 Features

* 🤖 AI-powered legal question answering
* 📚 Retrieval-Augmented Generation (RAG)
* 🔍 Semantic search using vector embeddings
* 📝 Context-aware responses based on Indian legal documents
* 💬 User-friendly chat interface
* ⚡ Fast and relevant legal information retrieval
* 🔒 Secure handling of user queries

---

## 🛠️ Tech Stack

### Frontend

* React.js
* HTML5
* CSS3
* JavaScript

### Backend

* FastAPI
* Python

### Database

* PostgreSQL
* ChromaDB (Vector Database)

### AI & Machine Learning

* Google Gemini Flash
* Sentence Transformers
* Retrieval-Augmented Generation (RAG)

---

## 📂 Project Structure

```text
legal-assistant/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── app/
│   ├── routes/
│   ├── services/
│   ├── models/
│   ├── database/
│   └── requirements.txt
│
├── data/
│
├── chroma_db/
│
├── README.md
└── .gitignore
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone https://github.com/your-username/legal-assistant.git
```

```bash
cd legal-assistant
```

### Backend

Create a virtual environment

```bash
python -m venv venv
```

Activate it

Windows

```bash
venv\Scripts\activate
```

Linux/macOS

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run the backend

```bash
uvicorn app.main:app --reload
```

---

### Frontend

```bash
cd frontend
```

Install packages

```bash
npm install
```

Run

```bash
npm run dev
```

---

## 📖 How It Works

1. The user submits a legal question.
2. The system converts the query into vector embeddings.
3. ChromaDB retrieves the most relevant legal documents.
4. The retrieved context is sent to the Gemini Flash model.
5. The AI generates a grounded, context-aware response.

---

## 🎯 Example Questions

* What are the rights of a tenant in India?
* How can I file an FIR?
* What is anticipatory bail?
* What documents are required for property registration?
* What are consumer rights under Indian law?

---

## 📈 Future Improvements

* Voice-based interaction
* Multi-language support
* Document upload and analysis
* Citation highlighting
* Case law recommendations
* User authentication
* Conversation history

---

## 👩‍💻 Author

**Rinu Fathima**

Master of Computer Applications (MCA)

---

## 📄 License

This project is licensed under the MIT License.
