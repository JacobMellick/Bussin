from django.shortcuts import render
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import CrowdStatus
from .serializers import CrowdStatusSerializer
from django.http import HttpResponse

@api_view(["GET", "POST"])
@authentication_classes([])
@permission_classes([AllowAny])
def crowd_status(request, station_name=None):
    if request.method == "POST":
        if not station_name:
            return Response({"error": "station_name is required"}, status=400)

        count = request.data.get("count", 0)

        if count <= 1:
            status = "no crowd"
        elif count <= 5:
            status = "moderate"
        else:
            status = "overcrowded"

        CrowdStatus.objects.create(count=count, status=status, station=station_name)

        return Response({"status": status, "saved": True, "Station": station_name})

    elif request.method == "GET":
        if station_name:
            latest_crowd_status = CrowdStatus.objects.filter(station=station_name).order_by("-timestamp").first()
        else:
            return Response({"error": "station_name is required"}, status=400)

        if latest_crowd_status:
            serializer = CrowdStatusSerializer(latest_crowd_status)
            return Response({"crowd_status": serializer.data})
        else:
            return Response({"message": "No data available"}, status=404)

from twilio.twiml.messaging_response import MessagingResponse, Message


def sms_endpoint(request):
    """Endpoint for Twilio to respond to incoming text messages"""

    # parse query string [please send help I am not good with Django]
    query_dict = {}
    query_dict["Body"] = ""
    for i in request.META["QUERY_STRING"].split('&'):
        try:
            k,v = i.split("=")
            query_dict[k] = v.replace("+"," ")
        except:
            pass

    # match syntax of text
    match query_dict["Body"].split(" "):
        case [stop_id] if len(stop_id) > 0: message_str = f"Stop: {stop_id}"
        case [stop_id, route]: message_str = f"Stop: {stop_id}\nRoute: {route}"
        case _: message_str = "Format: <Stop ID> <Optional Route Number>"

    # prepare response, MessagingResponse might be overkill
    response = MessagingResponse()
    response.message(message_str)
    return HttpResponse(str(response))
