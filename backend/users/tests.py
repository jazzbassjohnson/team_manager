import random
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
			'username': 'testuser',
			'email': 'testuser@example.com',
			'password': 'securepassword',
			'first_name': 'First',
			'last_name': 'Last'
		}
		serializer = UserCreateSerializer(data=data)
		self.assertTrue(serializer.is_valid())
		user = serializer.save()

		self.assertIsNotNone(user)

		self.assertEqual(user.username, 'testuser')

		# Ensure the password is hashed when the user is created
		self.assertNotEqual(user.password, 'securepassword')

		# Check if the hashed password is stored correctly
		stored_hashed_password = user.password

		# Verify the password using the check_password method
		self.assertTrue(user.check_password('securepassword'))

		self.assertEqual(user.email, 'testuser@example.com')
		self.assertEqual(user.first_name, 'First')
		self.assertEqual(user.last_name, 'Last')

		# Ensure email was sent
		mock_send_mail.assert_called_once_with(
			'Your Temporary Password',
			f'Hello testuser,\n\nYour temporary password is: securepassword\nPlease log in and change your password.',
			'admin@example.com',
			['testuser@example.com'],
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
		self.assertTrue(serializer.is_valid())
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
