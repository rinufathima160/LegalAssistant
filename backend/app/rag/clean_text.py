import re

def clean_text(text):
    # Remove multiple spaces
    text = re.sub(r'\s+', ' ', text)
    # Remove unwanted characters
    text = text.replace("\n", " ").replace("\t", " ")
    return text.strip()
