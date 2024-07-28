from django.db import models


class Organization(models.Model):
	name = models.CharField(max_length=255)
	description = models.TextField(blank=True, null=True)
	members = models.ManyToManyField('users.CustomUser', related_name='organizations', blank=True)

	def __str__(self):
		return self.name
