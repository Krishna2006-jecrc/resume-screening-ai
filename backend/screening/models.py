from django.db import models


class JobDescription(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField()
    cleaned_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ScreeningSession(models.Model):
    job_description = models.ForeignKey(
        JobDescription,
        on_delete=models.CASCADE,
        related_name='screening_sessions'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.job_description.title} - {self.created_at.strftime('%Y-%m-%d %H:%M')}"


class Resume(models.Model):
    screening_session = models.ForeignKey(
        ScreeningSession,
        on_delete=models.CASCADE,
        related_name='resumes'
    )

    candidate_name = models.CharField(max_length=200)
    resume_file = models.FileField(upload_to='resumes/')
    resume_text = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.candidate_name


class ScreeningResult(models.Model):
    resume = models.OneToOneField(
        Resume,
        on_delete=models.CASCADE,
        related_name='screening_result'
    )

    match_score = models.FloatField()
    matched_skills = models.JSONField(default=list)
    missing_skills = models.JSONField(default=list)
    shortlisted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.resume.candidate_name} - {self.match_score}%"