from django.db import transaction
from rest_framework import viewsets
from .utils import extract_text_from_pdf
from .nlp_utils import (
    clean_text,
    calculate_similarity,
    compare_skills,
    calculate_final_score
)
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import (
    JobDescription,
    ScreeningSession,
    Resume,
    ScreeningResult
)

from .serializers import (
    JobDescriptionSerializer,
    ScreeningSessionSerializer,
    ResumeSerializer,
    ScreeningResultSerializer
)


class JobDescriptionViewSet(viewsets.ModelViewSet):
    queryset = JobDescription.objects.all()
    serializer_class = JobDescriptionSerializer

    def perform_create(self, serializer):
        job = serializer.save()

        cleaned_description = clean_text(job.description)

        job.cleaned_description = cleaned_description
        job.save()

        print("\n========== CLEANED JOB DESCRIPTION ==========\n")
        print(cleaned_description)
        print("\n=============================================\n")


class ScreeningSessionViewSet(viewsets.ModelViewSet):
    queryset = ScreeningSession.objects.select_related("job_description").order_by("-created_at")
    serializer_class = ScreeningSessionSerializer


class ResumeViewSet(viewsets.ModelViewSet):
    queryset = Resume.objects.all()
    serializer_class = ResumeSerializer

    def perform_create(self, serializer):
        resume = serializer.save()

        if not resume.resume_file.name.lower().endswith(".pdf"):
            return

        text = extract_text_from_pdf(resume.resume_file)
        cleaned_text = clean_text(text)

        resume.resume_text = cleaned_text
        resume.save(update_fields=["resume_text"])

        cleaned_jd = resume.screening_session.job_description.cleaned_description

        if cleaned_jd and cleaned_text:
            score = calculate_similarity(cleaned_jd, cleaned_text)
            match_score = round(score * 100, 2)
            ScreeningResult.objects.create(
                resume=resume,
                match_score=match_score,
            )
            
            
class StartScreeningView(APIView):
    
    def post(self, request):
        title = request.data.get("title")
        description = request.data.get("description")

        if not title or not description:
            return Response(
                {
                    "error": "Title and description are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        cleaned_description = clean_text(description)

        job = JobDescription.objects.create(
            title=title,
            description=description,
            cleaned_description=cleaned_description
        )

        session = ScreeningSession.objects.create(
            job_description=job
        )

        return Response(
            {
                "message": "Screening started successfully.",
                "screening_session_id": session.id,
                "job_description_id": job.id,
                "title": job.title
            },
            status=status.HTTP_201_CREATED
        )
         
class BulkResumeUploadView(APIView):

    def post(self, request, session_id):
        try:
            session = ScreeningSession.objects.get(id=session_id)

        except ScreeningSession.DoesNotExist:
            return Response(
                {"error": "Screening session not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        files = request.FILES.getlist("resumes")

        if not files:
            return Response(
                {"error": "Please upload at least one resume."},
                status=status.HTTP_400_BAD_REQUEST
            )

        uploaded_resumes = []
        errors = []

        cleaned_jd = session.job_description.cleaned_description

        for file in files:

            # Only accept PDF files
            if not file.name.lower().endswith(".pdf"):
                errors.append({
                    "file": file.name,
                    "error": "Only PDF files are supported."
                })
                continue

            try:
                candidate_name = file.name.rsplit(".", 1)[0]

                candidate_name = candidate_name.replace("_", " ")
                candidate_name = candidate_name.replace("-", " ")

                candidate_name = candidate_name.replace(
                    " Resume",
                    ""
                )

                candidate_name = candidate_name.strip().title()

                with transaction.atomic():
                    # Save resume and extract text from its stored file.
                    resume = Resume.objects.create(
                        screening_session=session,
                        candidate_name=candidate_name,
                        resume_file=file,
                    )

                    text = extract_text_from_pdf(resume.resume_file)
                    cleaned_text = clean_text(text)

                    if not cleaned_jd or not cleaned_text:
                        raise ValueError(
                            "Job description or extracted resume text is empty."
                        )

                    resume.resume_text = cleaned_text
                    resume.save(update_fields=["resume_text"])

                    matched_skills, missing_skills = compare_skills(
                        cleaned_jd,
                        cleaned_text
                    )

                    match_score = calculate_final_score(
                        cleaned_jd,
                        cleaned_text
                    )

                    shortlisted = match_score >= 60

                    # Save screening result to database
                    ScreeningResult.objects.create(
                        resume=resume,
                        match_score=match_score,
                        matched_skills=matched_skills,
                        missing_skills=missing_skills,
                        shortlisted=shortlisted
                    )

                uploaded_resumes.append({
                    "resume_id": resume.id,
                    "candidate_name": resume.candidate_name,
                    "match_score": match_score
                })

            except Exception as error:
                errors.append({
                    "file": file.name,
                    "error": str(error)
                })

        return Response(
            {
                "message": "Resume screening process completed.",
                "screening_session_id": session.id,
                "uploaded_resumes": uploaded_resumes,
                "errors": errors
            },
            status=(
                status.HTTP_201_CREATED
                if uploaded_resumes
                else status.HTTP_400_BAD_REQUEST
            )
        )
class ScreeningResultViewSet(viewsets.ModelViewSet):
    queryset = ScreeningResult.objects.select_related("resume").all()
    serializer_class = ScreeningResultSerializer
class ScreeningResultsView(APIView):
    
    def get(self, request, session_id):

        try:
            session = ScreeningSession.objects.get(id=session_id)
        except ScreeningSession.DoesNotExist:
            return Response(
                {"error": "Screening session not found."},
                status=status.HTTP_404_NOT_FOUND
            )

        results = ScreeningResult.objects.filter(
            resume__screening_session=session
        ).select_related(
            "resume"
        ).order_by(
            "-match_score"
        )

        data = []

        for result in results:
            data.append({
    "candidate_name": result.resume.candidate_name,
    "resume_id": result.resume.id,
    "resume_url": request.build_absolute_uri(
        result.resume.resume_file.url
    ),
    "match_score": result.match_score,
    "matched_skills": result.matched_skills,
    "missing_skills": result.missing_skills,
    "shortlisted": result.shortlisted
})

        return Response({
            "screening_session_id": session.id,
            "job_title": session.job_description.title,
            "candidates": data
        })
