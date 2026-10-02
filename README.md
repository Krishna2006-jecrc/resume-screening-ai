# AI Resume Screening System

An AI-powered resume screening system that helps recruiters screen multiple resumes against a job description and rank candidates based on text similarity, semantic similarity, and skill matching.

## Features

* Create a new screening session with a fresh job description
* Upload multiple PDF resumes
* Extract text from PDF resumes
* Clean and preprocess resume and job description text
* TF-IDF based text similarity
* Semantic matching using Sentence Transformers
* Skill extraction and skill comparison
* Identify matched and missing skills
* Calculate an overall resume match score
* Automatically shortlist candidates based on the configured threshold
* Rank candidates by match score
* View individual resumes
* Screening history
* View previous screening results
* Resume upload validation
* Loading and error handling

## AI / NLP Approach

The system combines three different signals to calculate the final candidate score.

### 1. TF-IDF Similarity

TF-IDF (Term Frequency-Inverse Document Frequency) is used to compare the textual similarity between the job description and the resume.

This helps identify the overlap of important terms between the two documents.

### 2. Semantic Similarity

The system uses the `all-MiniLM-L6-v2` Sentence Transformer model to generate text embeddings.

This allows the system to compare the meaning of the job description and resume rather than relying only on exact word matches.

For example, two sentences can have similar meanings even when they use different words.

### 3. Skill Matching

The system extracts technical skills from both the job description and resume.

It identifies:

* Matched skills
* Missing skills

The current skill dictionary includes technologies such as:

* Python
* Django
* Django REST Framework
* REST API
* SQL
* Git
* HTML
* CSS
* JavaScript
* React
* PostgreSQL
* MySQL
* Docker
* Java
* C++
* Machine Learning
* Deep Learning
* TensorFlow
* PyTorch
* Pandas
* NumPy
* Scikit-learn

## Final Scoring

The current scoring formula combines the three signals:

* TF-IDF similarity: 20%
* Semantic similarity: 30%
* Skill matching: 50%

```text
Final Score =
    (TF-IDF Similarity × 0.20)
  + (Semantic Similarity × 0.30)
  + (Skill Score × 0.50)
```

The current shortlist threshold is:

```text
Match Score >= 60%
```

Candidates meeting this configured threshold are marked as shortlisted.

## Technology Stack

### Frontend

* React
* Vite
* JavaScript
* Axios

### Backend

* Python
* Django
* Django REST Framework
* SQLite

### AI / NLP

* Scikit-learn
* Sentence Transformers
* `all-MiniLM-L6-v2`
* TF-IDF
* Cosine Similarity

### PDF Processing

* PDF text extraction

## Project Structure

```text
resume/
│
├── backend/
│   ├── backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   │
│   ├── screening/
│   │   ├── models.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   ├── nlp_utils.py
│   │   └── utils.py
│   │
│   ├── manage.py
│   └── ...
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── StartScreening/
│   │   │   ├── UploadResumes/
│   │   │   ├── Results/
│   │   │   └── ScreeningHistory/
│   │   │
│   │   ├── services/
│   │   └── ...
│   │
│   ├── package.json
│   └── ...
│
└── README.md
```

## Application Workflow

```text
Recruiter
   ↓
Create New Screening
   ↓
Enter Job Description
   ↓
Screening Session Created
   ↓
Upload Multiple PDF Resumes
   ↓
Extract Resume Text
   ↓
Clean Resume Text
   ↓
┌─────────────────────────────┐
│ TF-IDF Similarity            │
│ Semantic Similarity          │
│ Skill Matching               │
└─────────────────────────────┘
              ↓
       Final Match Score
              ↓
      Candidate Ranking
              ↓
   Shortlisted / Not Shortlisted
              ↓
        Results Dashboard
              ↓
       Screening History
```

## Backend Setup

### 1. Clone the repository

```bash
git clone https://github.com/Krishna2006-jecrc/resume-screening-ai.git
cd resume-screening-ai
```

### 2. Create and activate virtual environment

Windows:

```powershell
python -m venv env
.\env\Scripts\activate
```

### 3. Install backend dependencies

```powershell
cd backend
pip install -r requirements.txt
```

### 4. Run migrations

```powershell
python manage.py migrate
```

### 5. Start Django server

```powershell
python manage.py runserver
```

Backend will run at:

```text
http://127.0.0.1:8000/
```

## Frontend Setup

Open another terminal.

```powershell
cd frontend
npm install
npm run dev
```

Frontend will normally run at:

```text
http://localhost:5173/
```

## Screening Process

1. Open the frontend application.
2. Create a new screening session.
3. Enter the job title and job description.
4. Upload one or more PDF resumes.
5. The backend extracts the resume text.
6. Resume and job description text are cleaned.
7. TF-IDF similarity is calculated.
8. Semantic similarity is calculated using Sentence Transformers.
9. Required skills are extracted and compared.
10. The final match score is calculated.
11. Candidates are ranked by score.
12. Candidates meeting the configured threshold are marked as shortlisted.
13. Results can be viewed later through Screening History.

## API Overview

### Start Screening

```text
POST /api/start-screening/
```

Creates a new job description and screening session.

### Upload Resumes

```text
POST /api/screenings/<session_id>/upload-resumes/
```

Uploads multiple PDF resumes and screens them against the selected job description.

### Get Screening Results

```text
GET /api/screenings/<session_id>/results/
```

Returns ranked screening results for a session.

### Screening History

```text
GET /api/sessions/
```

Returns previous screening sessions.

## Current Limitations

* Resume files must be PDF files.
* Skill matching depends on the configured skill dictionary.
* The scoring weights are configurable and are not intended to represent a universal hiring standard.
* Semantic similarity is based on a pretrained Sentence Transformer model.
* The current system is designed as an academic/college project and should support recruiter review rather than replace human decision-making.

## Future Improvements

Possible future improvements include:

* More comprehensive skill and technology dictionaries
* Better extraction of structured resume information
* Experience and education analysis
* Improved handling of resume sections
* More advanced ranking methods
* Authentication and recruiter accounts
* Database deployment for production
* Cloud file storage
* Improved model evaluation using a labelled resume dataset
* Recruiter analytics and reports

## Project Status

The core resume screening workflow is implemented and tested:

* PDF resume upload
* Text extraction
* Text cleaning
* TF-IDF similarity
* Semantic matching
* Skill matching
* Match scoring
* Candidate ranking
* Shortlisting
* Screening history
* Results dashboard
