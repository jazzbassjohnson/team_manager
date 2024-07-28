from django.contrib.auth import get_user_model
from rest_framework import serializers

CustomUser = get_user_model()


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
