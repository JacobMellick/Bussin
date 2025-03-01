from django.urls import path
from .views import crowd_status

urlpatterns = [
    path("crowd-status/", crowd_status, name="crowd-status"),
]
