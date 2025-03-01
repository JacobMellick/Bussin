from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import CrowdStatus
from .serializers import CrowdStatusSerializer  # Import the serializer

@api_view(["GET", "POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def crowd_status(request):
    if request.method == "POST":
        count = request.data.get("count", 0)

        if count <= 1:
            status = "no crowd"
        elif count <= 5:
            status = "moderate"
        else:
            status = "overcrowded"

        CrowdStatus.objects.create(count=count, status=status)

        return Response({"status": status, "saved": True})

    elif request.method == "GET":
        latest_crowd_status = CrowdStatus.objects.order_by("-timestamp").first()  # Get the latest record
        if latest_crowd_status:
            serializer = CrowdStatusSerializer(latest_crowd_status)
            return Response({"crowd_status": serializer.data})
        else:
            return Response({"message": "No data available"}, status=404)
