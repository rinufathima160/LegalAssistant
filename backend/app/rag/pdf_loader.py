import os
from pypdf import PdfReader

def load_pdf_folder(folder_path: str):
    all_text = ""

    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(folder_path, filename)
            reader = PdfReader(pdf_path)

            for page in reader.pages:
                all_text += page.extract_text() + "\n"

    return all_text

