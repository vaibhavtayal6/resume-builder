# import pdfplumber
# import language_tool_python
# import re

# def extract_text_from_pdf(pdf_path):
#     """Extracts text from a PDF resume."""
#     text = ""
#     with pdfplumber.open(pdf_path) as pdf:
#         for page in pdf.pages:
#             page_text = page.extract_text()
#             if page_text:
#                 text += page_text + "\n"
#     return text.strip()

# def check_grammar(text):
#     """Checks grammar mistakes in the resume and returns a Mistake Score."""
#     tool = language_tool_python.LanguageTool("en-US")
#     tool.disable_spellchecking()  # Ignore spellchecking

#     matches = tool.check(text)
    
#     suggestions = []
#     for match in matches:
#         suggestions.append({
#             "error": match.ruleId,
#             "message": match.message,
#             "suggestion": match.replacements,
#             "offset": match.offset,
#             "length": match.errorLength
#         })
    
#     num_errors = len(matches)

#     # Mistake Score based on number of grammar errors
#     if num_errors == 0:
#         mistake_score = 100
#     elif num_errors <= 5:
#         mistake_score = 85 + (5 - num_errors) * 2
#     elif num_errors <= 15:
#         mistake_score = 60 + (15 - num_errors) * 2
#     else:
#         mistake_score = max(30, 50 - num_errors)

#     return {"mistake_score": mistake_score, "errors": suggestions}

# def calculate_resume_score(text):
#     """Evaluates the resume based on ATS-friendly criteria and assigns a Resume Score."""
    
#     # 1️⃣ Check for important sections (Education, Work Experience, Skills, Contact Info)
#     sections = {
#         "Education": re.search(r"\b(Education|Academic Background)\b", text, re.IGNORECASE),
#         "Work Experience": re.search(r"\b(Work Experience|Professional Experience|Employment History)\b", text, re.IGNORECASE),
#         "Skills": re.search(r"\b(Skills|Technical Skills|Core Competencies)\b", text, re.IGNORECASE),
#         "Contact Info": re.search(r"\b(Email|Phone|LinkedIn)\b", text, re.IGNORECASE),
#     }
#     section_score = sum(1 for s in sections.values() if s) / len(sections) * 40  # 40% of total score

#     # 2️⃣ Keyword Density (More keywords related to job = better)
#     keywords = ["Python", "Machine Learning", "Data Analysis", "SQL", "AWS", "Leadership"]  # Example keywords
#     keyword_count = sum(text.lower().count(k.lower()) for k in keywords)
#     keyword_score = min(30, keyword_count * 2)  # 30% of total score

#     # 3️⃣ Bullet Points vs Paragraphs (Bullet points preferred)
#     bullet_points = len(re.findall(r"•|-", text))  # Count bullet points
#     bullet_score = 15 if bullet_points > 5 else 5  # 15% of total score

#     # 4️⃣ Length Optimization (Ideally 300-800 words)
#     word_count = len(text.split())
#     length_score = 15 if 300 <= word_count <= 800 else 5  # 15% of total score

#     # Final Resume Score
#     resume_score = round(section_score + keyword_score + bullet_score + length_score)
    
#     return {"resume_score": resume_score, "section_score": section_score, "keyword_score": keyword_score, "bullet_score": bullet_score, "length_score": length_score}

# if __name__ == "__main__":
#     pdf_path = "sample_resume.pdf"  # Ensure this file exists
#     resume_text = extract_text_from_pdf(pdf_path)

#     if resume_text:
#         print("\n\033[1m📄 Extracted Resume Text:\033[0m\n")
#         print(resume_text)

#         # Mistake Score (Grammar)
#         grammar_result = check_grammar(resume_text)
        
#         print("\n\033[1m📝 Mistake Score: \033[92m", grammar_result["mistake_score"], "/ 100\033[0m")
#         print("\033[1m🔍 Errors Found:\033[0m", len(grammar_result["errors"]))
        
#         if grammar_result["errors"]:
#             print("\n\033[1mTop Grammar Issues:\033[0m")
#             for error in grammar_result["errors"][:5]:  
#                 print(f"🔴 {error['message']} \n   👉 Suggested Fix: {error['suggestion']}\n")
            
#             # Ask the user if they want to see all errors
#             see_all = input("\n📜 Do you want to see all grammar mistakes? (yes/no): ").strip().lower()
#             if see_all == "yes":
#                 print("\n\033[1m📢 Full List of Grammar Mistakes:\033[0m")
#                 for error in grammar_result["errors"]:
#                     print(f"🔴 {error['message']} \n   👉 Suggested Fix: {error['suggestion']}\n")

#         # Resume Score (ATS Optimization)
#         resume_result = calculate_resume_score(resume_text)

#         print("\n\033[1m📊 Resume Score: \033[94m", resume_result["resume_score"], "/ 100\033[0m")
#         print("\n📌 \033[1mDetailed Breakdown:\033[0m")
#         print(f"✅ Section Score: \033[93m{resume_result['section_score']}/40\033[0m")
#         print(f"🔑 Keyword Score: \033[93m{resume_result['keyword_score']}/30\033[0m")
#         print(f"📌 Bullet Point Score: \033[93m{resume_result['bullet_score']}/15\033[0m")
#         print(f"📏 Length Optimization Score: \033[93m{resume_result['length_score']}/15\033[0m")

#         print("\n🎯 \033[1mFinal Thoughts:\033[0m Optimize your resume based on the scores above for better ATS compatibility!")


import pdfplumber
import language_tool_python
import re

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF resume."""
    text = ""
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    text += page_text + "\n"
    except Exception as e:
        print(f"❌ Error reading PDF: {e}")
        return None
    
    return text.strip() if text else None

def check_grammar(text):
    """Checks grammar mistakes in the resume and returns a Mistake Score."""
    tool = language_tool_python.LanguageTool("en-US")
    tool.disable_spellchecking()  # Ignore spellchecking

    matches = tool.check(text)
    
    num_errors = len(matches)
    mistake_score = max(30, 100 - num_errors * 2)  # Scaled mistake score

    return {"mistake_score": mistake_score, "error_count": num_errors}

def calculate_resume_score(text):
    """Evaluates the resume based on ATS-friendly criteria and assigns a Resume Score."""
    
    # 1️⃣ Important Sections Check
    sections = {
        "Education": re.search(r"\b(Education|Academic Background)\b", text, re.IGNORECASE),
        "Work Experience": re.search(r"\b(Work Experience|Professional Experience|Employment History)\b", text, re.IGNORECASE),
        "Skills": re.search(r"\b(Skills|Technical Skills|Core Competencies)\b", text, re.IGNORECASE),
        "Contact Info": re.search(r"\b(Email|Phone|LinkedIn)\b", text, re.IGNORECASE),
    }
    section_score = sum(1 for s in sections.values() if s) / len(sections) * 40  

    # 2️⃣ Keyword Density (Industry-related words)
    keywords = ["Python", "Machine Learning", "Data Analysis", "SQL", "AWS", "Leadership"]
    keyword_count = sum(text.lower().count(k.lower()) for k in keywords)
    keyword_score = min(30, keyword_count * 2)  

    # 3️⃣ Bullet Points Check
    bullet_points = len(re.findall(r"•|-", text))  
    bullet_score = 15 if bullet_points > 5 else 5  

    # 4️⃣ Length Optimization (Ideal range: 300-800 words)
    word_count = len(text.split())
    length_score = 15 if 300 <= word_count <= 800 else 5  

    resume_score = round(section_score + keyword_score + bullet_score + length_score)
    
    return {"resume_score": resume_score, "section_score": section_score, "keyword_score": keyword_score, "bullet_score": bullet_score, "length_score": length_score}

def main():
    pdf_path = input("📄 Enter the path of your resume PDF file: ").strip()

    resume_text = extract_text_from_pdf(pdf_path)

    if not resume_text:
        print("❌ Error: Unable to extract text from the PDF.")
        return

    # ✅ Calculate Grammar Score
    grammar_result = check_grammar(resume_text)
    
    # ✅ Calculate ATS Resume Score
    resume_result = calculate_resume_score(resume_text)

    # 🔹 Display Final Results
    print("\n\033[1m📊 Final Resume Evaluation:\033[0m")
    print(f"\n📝 Mistake Score: \033[92m{grammar_result['mistake_score']}/100\033[0m")
    print(f"🔍 Grammar Errors Found: {grammar_result['error_count']}")

    print(f"\n📊 Resume ATS Score: \033[94m{resume_result['resume_score']}/100\033[0m")
    print(f"\n📌 \033[1mDetailed Breakdown:\033[0m")
    print(f"✅ Section Score: \033[93m{resume_result['section_score']}/40\033[0m")
    print(f"🔑 Keyword Score: \033[93m{resume_result['keyword_score']}/30\033[0m")
    print(f"📌 Bullet Point Score: \033[93m{resume_result['bullet_score']}/15\033[0m")
    print(f"📏 Length Optimization Score: \033[93m{resume_result['length_score']}/15\033[0m")

    print("\n🎯 \033[1mFinal Thoughts:\033[0m Optimize your resume based on the scores above for better ATS compatibility!")

if __name__ == "__main__":
    main()