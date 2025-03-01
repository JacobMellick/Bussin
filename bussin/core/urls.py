from django.urls import path
from .views import crowd_status, sms_endpoint

urlpatterns = [
    path("crowd-status/<str:station_name>/", crowd_status, name="crowd-status"),
    path('sms/', sms_endpoint, name="sms"),
]
