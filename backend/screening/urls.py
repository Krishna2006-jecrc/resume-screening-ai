from rest_framework.routers import DefaultRouter
from django.urls import path
from .views import (
    JobDescriptionViewSet,
    ScreeningSessionViewSet,
    ResumeViewSet,
    ScreeningResultViewSet,
    StartScreeningView,
    BulkResumeUploadView,
    ScreeningResultsView
)


router = DefaultRouter()

router.register('jobs', JobDescriptionViewSet)
router.register('sessions', ScreeningSessionViewSet)
router.register('resumes', ResumeViewSet)
router.register('results', ScreeningResultViewSet)


urlpatterns = router.urls

urlpatterns += [
    path('start-screening/', StartScreeningView.as_view()),
      path(
        'screenings/<int:session_id>/upload-resumes/',
        BulkResumeUploadView.as_view()
    ),
      path(
    'screenings/<int:session_id>/results/',
    ScreeningResultsView.as_view()
),
]