from rest_framework import serializers
from .models import JobDescription, ScreeningSession, Resume, ScreeningResult


class JobDescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobDescription
        fields = '__all__'

class ScreeningSessionSerializer(serializers.ModelSerializer):
    job_title = serializers.CharField(
        source="job_description.title",
        read_only=True
    )

    class Meta:
        model = ScreeningSession
        fields = [
            "id",
            "job_title",
            "created_at",
        ]


class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'
        read_only_fields = ["resume_text", "uploaded_at"]


class ScreeningResultSerializer(serializers.ModelSerializer):
    candidate_name = serializers.CharField(source="resume.candidate_name", read_only=True)

    class Meta:
        model = ScreeningResult
        fields = [
            "id",
            "resume",
            "candidate_name",
            "match_score",
            "matched_skills",
            "missing_skills",
            "shortlisted",
            "created_at",
        ]
        read_only_fields = [
            "candidate_name",
            "created_at",
        ]
