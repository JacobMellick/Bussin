from django.urls import path
from .views import crowd_status

urlpatterns = [
    path("crowd-status/<str:station_name>/", crowd_status, name="crowd-status"),
]
