from rest_framework import serializers
from .models import CrowdStatus

class CrowdStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrowdStatus
        fields = ["id", "count", "status", "timestamp"]
