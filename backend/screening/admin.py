from django.contrib import admin
from .models import JobDescription, ScreeningSession, Resume, ScreeningResult


admin.site.register(JobDescription)
admin.site.register(ScreeningSession)
admin.site.register(Resume)
admin.site.register(ScreeningResult)
