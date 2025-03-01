from django.db import models

class CrowdStatus(models.Model):
    count = models.IntegerField()
    status = models.CharField(max_length=20)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.timestamp} - {self.count} people ({self.status})"

