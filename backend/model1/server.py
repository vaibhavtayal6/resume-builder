from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import shutil
import os
import random
import time  # Add this import at the top
from atschecker import extract_text_from_pdf, check_grammar, calculate_resume_score

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
if not os.path.exists("uploads"):
    os.makedirs("uploads")

def calculate_job_match(ats_score: float) -> float:
    """Generate a job match score that's within ±10 points of the ATS score with more variance"""
    # Use current timestamp as part of seed to ensure different numbers
    random.seed(time.time())
    
    # Create wider variance based on ATS score ranges
    if ats_score >= 80:
        variance = 15  # More variance for high scores
    elif ats_score >= 60:
        variance = 12  # Medium variance for average scores
    else:
        variance = 8   # Less variance for low scores
    
    min_score = max(0, ats_score - variance)
    max_score = min(100, ats_score + variance)
    
    # Generate random score with decimal precision
    job_match = random.uniform(min_score, max_score)
    
    # Round to one decimal place
    return round(job_match, 1)

@app.post("/analyze-resume/")
async def analyze_resume(file: UploadFile = File(...), job_description: str = Form(...)):
    try:
        # Save uploaded file
        file_path = f"uploads/{file.filename}"
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Extract text from PDF
        resume_text = extract_text_from_pdf(file_path)
        if not resume_text:
            return {"error": "Could not extract text from PDF"}

        # Calculate match based on job description
        job_match = calculate_job_match_with_description(resume_text, job_description)
        
        # Get other analysis results
        grammar_result = check_grammar(resume_text)
        resume_result = calculate_resume_score(resume_text)

        # Clean up uploaded file
        os.remove(file_path)

        return {
            "success": True,
            "data": {
                "grammar_score": grammar_result["mistake_score"],
                "grammar_errors": grammar_result["error_count"],
                "ats_score": resume_result["resume_score"],
                "job_match": job_match,
                "breakdown": {
                    "section_score": round(resume_result["section_score"], 2),
                    "keyword_score": round(resume_result["keyword_score"], 2),
                    "bullet_score": resume_result["bullet_score"],
                    "length_score": resume_result["length_score"]
                }
            }
        }
    except Exception as e:
        return {"success": False, "error": str(e)}

def calculate_job_match_with_description(resume_text: str, job_description: str) -> float:
    """Calculate job match score based on resume and job description similarity"""
    # Basic implementation - you can make this more sophisticated
    resume_words = set(resume_text.lower().split())
    job_words = set(job_description.lower().split())
    
    # Calculate overlap
    common_words = resume_words.intersection(job_words)
    match_score = len(common_words) / len(job_words) * 100
    
    # Ensure score is between 0 and 100
    return min(100, max(0, match_score))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)