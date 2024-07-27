from django.conf import settings
from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth import get_user_model
from organizations.models import Organization


class Team(models.Model):
	name = models.CharField(max_length=255)
	organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name='teams')

	def __str__(self):
		return self.name


class Role(models.Model):
	name = models.CharField(max_length=255)

	def __str__(self):
		return self.name


class Membership(models.Model):
	user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
	team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name='memberships')
	role = models.ForeignKey(Role, on_delete=models.SET_NULL, null=True, blank=True)

	def __str__(self):
		return f'{self.user.username} in {self.team.name} as {self.role.name if self.role else "Member"}'
