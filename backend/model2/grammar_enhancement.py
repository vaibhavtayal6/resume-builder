import fitz  # PyMuPDF for PDF processing
import language_tool_python
from spellchecker import SpellChecker
import nltk
from nltk.corpus import names
import geonamescache  # For filtering city and country names
import re
import multiprocessing

# Ensure NLTK dataset is downloaded
nltk.download("names")

# Define words to ignore (programming-related terms, websites, etc.)
ignore_words = {
    "LeetCode", "HackerRank", "CodeChef", "Codeforces", "Atcoder",
    "GitHub", "LinkedIn", "TechFest", "CPU", "AI", "ML", "API"
}

def extract_resume_text(pdf_path):
    """Extracts text from a PDF file."""
    try:
        doc = fitz.open(pdf_path)
        text = "\n".join([page.get_text("text") for page in doc])
        doc.close()
        return text.strip()
    except Exception as e:
        print(f"❌ Error extracting text: {e}")
        return ""

def extract_name_from_resume(pdf_path):
    """Extracts the candidate's name from the first non-empty line of the resume."""
    text = extract_resume_text(pdf_path)
    first_line = text.split("\n")[0].strip()
    return first_line if first_line else "Unknown"

def check_grammar(sentence):
    """Checks grammar for a single sentence."""
    tool = language_tool_python.LanguageTool("en-US")
    matches = tool.check(sentence)
    for match in matches:
        suggestion = match.replacements[0] if match.replacements else None
        if suggestion:
            return sentence.replace(match.context, suggestion)
    return sentence  # Return unchanged if no correction

def check_spelling(word, spell):
    """Checks spelling for a single word."""
    if word.lower() in ignore_words:
        return None  # Ignore known terms
    correction = spell.correction(word)
    return (word, correction) if correction and correction != word else None

def enhance_resume(resume_text):
    """Enhances the resume by fixing grammar and spelling mistakes (FAST VERSION)."""

    # Initialize tools
    tool = language_tool_python.LanguageTool("en-US")
    spell = SpellChecker()

    # Load proper names and locations to ignore
    all_names = set(names.words())
    gc = geonamescache.GeonamesCache()
    cities = {city["name"] for city in gc.get_cities().values()}
    countries = {country["name"] for country in gc.get_countries().values()}

    # Step 1: **Grammar Checking (Parallel)**
    sentences = resume_text.split(". ")
    with multiprocessing.Pool(processes=4) as pool:  # Use 4 CPU cores for faster processing
        enhanced_sentences = pool.map(check_grammar, sentences)

    enhanced_text = ". ".join(enhanced_sentences)

    # Step 2: **Optimized Spell-Checking (Parallel)**
    words = re.findall(r'\b\w+\b', resume_text)
    with multiprocessing.Pool(processes=4) as pool:
        spelling_issues = pool.starmap(check_spelling, [(word, spell) for word in words])

    # Remove None values (ignored words)
    spelling_issues = [issue for issue in spelling_issues if issue is not None]

    # Step 3: **Weak Sentences Detection**
    weak_sentences = [sentence.strip() for sentence in sentences if len(sentence.split()) < 5 and len(sentence) > 0]

    return enhanced_text, spelling_issues[:5], weak_sentences[:5]  # Show top 5 spelling and weak sentences

if __name__ == "__main__":
    pdf_path = "sample_resume.pdf"  # Change this to your actual file
    resume_text = extract_resume_text(pdf_path)
    
    if not resume_text:
        print("❌ Error: Could not extract text from resume.")
    else:
        print("\n🔍 Enhancing resume...")
        enhanced_text, spelling_fixes, weak_sentences = enhance_resume(resume_text)

        print("\n📊 **Resume Enhancement Summary**")

        # Spelling Fixes
        if spelling_fixes:
            print("\n🔤 **Spelling Corrections:**")
            for word, correction in spelling_fixes:  
                print(f" - ❌ {word} → ✅ {correction}")
        else:
            print("✅ No major spelling mistakes found!")

        # Weak Sentences
        if weak_sentences:
            print("\n🔹 **Weak Sentences Identified:**")
            for weak in weak_sentences:  
                print(f" - {weak}")
        else:
            print("✅ No weak sentences found!")