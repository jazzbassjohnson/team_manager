from django.db import models
from django.conf import settings


class Organization(models.Model):
	name = models.CharField(max_length=255)
	description = models.TextField(blank=True, null=True)
	owner = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, on_delete=models.CASCADE)

	def __str__(self):
		return self.name
