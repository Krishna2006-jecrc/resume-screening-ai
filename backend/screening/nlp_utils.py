import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def clean_text(text):
    if not text:
        return ""

    text = text.lower()

    text = re.sub(r'\s+', ' ', text)

    text = re.sub(r'[^a-z0-9+#.\- ]', ' ', text)

    text = re.sub(r'\s+', ' ', text)

    return text.strip()


def calculate_similarity(text1, text2):
    if not text1 or not text2:
        return 0.0

    vectorizer = TfidfVectorizer()

    try:
        vectors = vectorizer.fit_transform([text1, text2])
    except ValueError:
        # A document containing only punctuation or stop-like tokens cannot be
        # represented by TF-IDF.  It is a valid, but non-matching, input.
        return 0.0

    similarity = cosine_similarity(vectors[0], vectors[1])

    return similarity[0][0]


if __name__ == "__main__":
    job_description = """
    python django sql rest api git
    """

    resume = """
    python django sql react
    """

    score = calculate_similarity(
        job_description,
        resume
    )

    print("\n========== SIMILARITY SCORE ==========\n")
    print(score)

    print("\n========== PERCENTAGE ==========\n")
    print(round(score * 100, 2), "%")
def extract_skills(text):
    found_skills = []

    text = text.lower()

    for skill in SKILLS:

        pattern = r'(?<!\w)' + re.escape(skill.lower()) + r'(?!\w)'

        if re.search(pattern, text):
            found_skills.append(skill)

    return found_skills

def compare_skills(job_description, resume):
    jd_skills = set(extract_skills(job_description))
    resume_skills = set(extract_skills(resume))

    matched_skills = sorted(jd_skills & resume_skills)
    missing_skills = sorted(jd_skills - resume_skills)

    return matched_skills, missing_skills    

def calculate_final_score(job_description, resume):
    similarity = calculate_similarity(
        job_description,
        resume
    )

    matched_skills, missing_skills = compare_skills(
        job_description,
        resume
    )

    total_skills = len(matched_skills) + len(missing_skills)

    if total_skills > 0:
        skill_score = len(matched_skills) / total_skills
    else:
        skill_score = 0

    final_score = (
        (similarity * 0.6) +
        (skill_score * 0.4)
    )

    return round(final_score * 100, 2)

SKILLS = [
    "python",
    "django",
    "django rest framework",
    "rest api",
    "sql",
    "git",
    "html",
    "css",
    "javascript",
    "react",
    "react.js",
    "postgresql",
    "mysql",
    "docker",
    "java",
    "c++",
    "machine learning",
    "deep learning",
    "tensorflow",
    "pytorch",
    "pandas",
    "numpy",
    "scikit-learn",
]    
if __name__ == "__main__":
    job_description = """
    Python Django REST API SQL Git Docker PostgreSQL
    """

    resume = """
    Python Django SQL React HTML CSS
    """

    matched_skills, missing_skills = compare_skills(
        job_description,
        resume
    )

    print("\n========== MATCHED SKILLS ==========\n")
    print(matched_skills)

    print("\n========== MISSING SKILLS ==========\n")
    print(missing_skills)
