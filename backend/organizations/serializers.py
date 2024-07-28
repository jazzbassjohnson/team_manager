from django.contrib.auth import get_user_model
from rest_framework import serializers

from users.serializers import UserSerializer
from .models import Organization

CustomUser = get_user_model()


class OrganizationSerializer(serializers.ModelSerializer):
	owner = UserSerializer()

	class Meta:
		model = Organization
		fields = ['id', 'name', 'description', 'owner']

	def create(self, validated_data):
		user_data = validated_data.pop('owner')
		user = CustomUser.objects.create_user(**user_data)
		organization = Organization.objects.create(owner=user, **validated_data)
		return organization
