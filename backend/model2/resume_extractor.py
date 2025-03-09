import pdfplumber
import docx

def extract_resume_text(file_path):
    """Extract text from PDF or DOCX without printing it."""
    text = ""

    if file_path.endswith(".pdf"):
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() + "\n"
    elif file_path.endswith(".docx"):
        doc = docx.Document(file_path)
        for para in doc.paragraphs:
            text += para.text + "\n"
    else:
        return "Unsupported file format"

    return text.strip()  # Ensure text is returned, not printed