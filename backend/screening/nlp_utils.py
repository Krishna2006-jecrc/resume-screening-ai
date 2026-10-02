import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
semantic_model = SentenceTransformer("all-MiniLM-L6-v2")

# =========================================================
# TEXT CLEANING
# =========================================================

def clean_text(text):
    if not text:
        return ""

    text = text.lower()

    text = re.sub(r"\s+", " ", text)

    text = re.sub(r"[^a-z0-9+#.\- ]", " ", text)

    text = re.sub(r"\s+", " ", text)

    return text.strip()


# =========================================================
# TEXT SIMILARITY
# =========================================================

def calculate_similarity(text1, text2):
    if not text1 or not text2:
        return 0.0

    vectorizer = TfidfVectorizer()

    try:
        vectors = vectorizer.fit_transform([text1, text2])
    except ValueError:
        return 0.0

    similarity = cosine_similarity(vectors[0], vectors[1])

    return similarity[0][0]

def calculate_semantic_similarity(text1, text2):
    if not text1 or not text2:
        return 0.0

    embeddings = semantic_model.encode(
        [text1, text2],
        normalize_embeddings=True
    )

    similarity = cosine_similarity(
        [embeddings[0]],
        [embeddings[1]]
    )

    return float(similarity[0][0])


# =========================================================
# SKILL ALIASES
# =========================================================

SKILL_ALIASES = {
    "drf": "django rest framework",
    "django-rest-framework": "django rest framework",
    "reactjs": "react",
    "react.js": "react",
    "postgres": "postgresql",
    "postgres db": "postgresql",
    "scikit learn": "scikit-learn",
    "sklearn": "scikit-learn",
}


# =========================================================
# SUPPORTED SKILLS
# =========================================================

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


# =========================================================
# SKILL EXTRACTION
# =========================================================

def extract_skills(text):
    found_skills = []

    text = clean_text(text)

    for skill in SKILLS:
        pattern = r"(?<!\w)" + re.escape(skill.lower()) + r"(?!\w)"

        if re.search(pattern, text):
            found_skills.append(skill)

    for alias, actual_skill in SKILL_ALIASES.items():
        pattern = r"(?<!\w)" + re.escape(alias.lower()) + r"(?!\w)"

        if re.search(pattern, text):
            if actual_skill not in found_skills:
                found_skills.append(actual_skill)

    return sorted(found_skills)


# =========================================================
# SKILL COMPARISON
# =========================================================

def compare_skills(job_description, resume):
    jd_skills = set(extract_skills(job_description))
    resume_skills = set(extract_skills(resume))

    matched_skills = sorted(jd_skills & resume_skills)
    missing_skills = sorted(jd_skills - resume_skills)

    return matched_skills, missing_skills


# =========================================================
# FINAL SCREENING SCORE
# =========================================================

def calculate_final_score(job_description, resume):
    similarity = calculate_similarity(
        job_description,
        resume
    )

    semantic_similarity = calculate_semantic_similarity(
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

    TEXT_WEIGHT = 0.20
    SEMANTIC_WEIGHT = 0.30
    SKILL_WEIGHT = 0.50

    final_score = (
        (similarity * TEXT_WEIGHT) +
        (semantic_similarity * SEMANTIC_WEIGHT) +
        (skill_score * SKILL_WEIGHT)
    )

    return round(final_score * 100, 2)


# =========================================================
# TESTING
# =========================================================

if __name__ == "__main__":
    job_description = """
    Python Django REST API SQL Git Docker PostgreSQL
    """

    resume = """
    Python Django SQL React HTML CSS
    """

    similarity = calculate_similarity(
        job_description,
        resume
    )

    semantic_similarity = calculate_semantic_similarity(
        job_description,
        resume
    )

    matched_skills, missing_skills = compare_skills(
        job_description,
        resume
    )

    final_score = calculate_final_score(
        job_description,
        resume
    )

    print("\n========== TEXT SIMILARITY ==========")
    print(round(similarity * 100, 2), "%")

    print("\n========== SEMANTIC SIMILARITY ==========")
    print(round(semantic_similarity * 100, 2), "%")

    print("\n========== MATCHED SKILLS ==========")
    print(matched_skills)

    print("\n========== MISSING SKILLS ==========")
    print(missing_skills)

    print("\n========== FINAL SCORE ==========")
    print(final_score, "%")