from django.db import models

class CrowdStatus(models.Model):
    station = models.CharField(max_length=100)
    count = models.IntegerField()
    status = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.timestamp} - {self.count} people ({self.status})"

class BusStop(models.Model):
    stop_code = models.CharField(max_length=10)
    stop_name = models.CharField(max_length=50)
    stop_long = models.FloatField()
    stop_lat = models.FloatField()

