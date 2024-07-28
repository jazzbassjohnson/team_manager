import string

from django.test import TestCase
from django.contrib.auth import get_user_model
from unittest.mock import patch
from rest_framework import serializers
from users.serializers import UserCreateSerializer

CustomUser = get_user_model()


class UserCreateSerializerTests(TestCase):

	@patch('users.serializers.send_mail')
	def test_create_user_with_provided_password(self, mock_send_mail):
		data = {
			'username': 'test_user',
			'email': 'test_user@example.com',
			'password': 'secure_password',
			'first_name': 'First',
			'last_name': 'Last'
		}
		serializer = UserCreateSerializer(data=data)
		self.assertTrue(serializer.is_valid(), serializer.errors)
		user = serializer.save()

		self.assertIsNotNone(user)
		self.assertEqual(user.username, 'test_user')
		self.assertTrue(user.check_password('secure_password'))
		self.assertEqual(user.email, 'test_user@example.com')
		self.assertEqual(user.first_name, 'First')
		self.assertEqual(user.last_name, 'Last')

		# Ensure email was sent
		mock_send_mail.assert_called_once_with(
			'Your Temporary Password',
			f'Hello test_user,\n\nYour temporary password is: secure_password\nPlease log in and change your password.',
			'admin@example.com',
			['test_user@example.com'],
			fail_silently=False,
		)

	@patch('users.serializers.send_mail')
	def test_create_user_with_temporary_password(self, mock_send_mail):
		data = {
			'username': 'testuser',
			'email': 'testuser@example.com',
			'first_name': 'First',
			'last_name': 'Last'
		}
		serializer = UserCreateSerializer(data=data)
		self.assertTrue(serializer.is_valid(), serializer.errors)
		user = serializer.save()

		self.assertIsNotNone(user)
		self.assertEqual(user.username, 'testuser')
		self.assertEqual(user.email, 'testuser@example.com')
		self.assertEqual(user.first_name, 'First')
		self.assertEqual(user.last_name, 'Last')

		# Ensure a temporary password was generated and email was sent
		args, kwargs = mock_send_mail.call_args
		self.assertIn('Your Temporary Password', args)
		self.assertIn('testuser', args[1])
		self.assertIn(user.email, args[3])

	def test_generate_temporary_password(self):
		password = UserCreateSerializer.generate_temporary_password()
		self.assertEqual(len(password), 8)
		self.assertTrue(all(c in string.ascii_letters + string.digits for c in password))
