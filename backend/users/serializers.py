import random
import string
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.core.mail import send_mail

CustomUser = get_user_model()


class UserCreateSerializer(serializers.ModelSerializer):
	password = serializers.CharField(write_only=True, required=False)

	class Meta:
		model = CustomUser
		fields = ['username', 'email', 'password', 'first_name', 'last_name']
		extra_kwargs = {'password': {'write_only': True}}

	def create(self, validated_data):
		password = validated_data.pop('password', None)
		if password is None:
			password = self.generate_temporary_password()
		user = CustomUser(
			username=validated_data['username'],
			email=validated_data['email'],
			first_name=validated_data.get('first_name', ''),
			last_name=validated_data.get('last_name', '')
		)
		user.set_password(password)
		user.save()
		self.send_temporary_password(user, password)
		return user

	@staticmethod
	def generate_temporary_password():
		return ''.join(random.choices(string.ascii_letters + string.digits, k=8))

	@staticmethod
	def send_temporary_password(user, password):
		send_mail(
			'Your Temporary Password',
			f'Hello {user.username},\n\nYour temporary password is: {password}\nPlease log in and change your password.',
			'admin@example.com',
			[user.email],
			fail_silently=False,
		)
