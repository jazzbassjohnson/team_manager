from django.contrib.auth.models import User
from rest_framework import serializers

from users.models import CustomUser


class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = CustomUser
		fields = ['id', 'username', 'password', 'email', 'first_name', 'last_name']
		extra_kwargs = {"password": {"write_only": True}}  # should I require this?

	def create(self, validated_data):
		user = CustomUser.objects.create_user(
			username=validated_data['username'],
			email=validated_data['email'],
			password=validated_data['password'],
			first_name=validated_data.get('first_name', ''),
			last_name=validated_data.get('last_name', '')
		)
		return user
