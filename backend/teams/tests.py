from unittest.mock import patch
from django.test import TestCase
from rest_framework import serializers
from organizations.models import Organization
from teams.models import Team, Role, Membership
from teams.serializers import TeamSerializer, TeamMemberSerializer
from users.models import CustomUser


class TeamSerializerTests(TestCase):
	def setUp(self):
		self.organization = Organization.objects.create(
			description='Test Description',
			name='Test Organization',
			owner=CustomUser.objects.create_user(
				username='orguser',
				email='orguser@example.com',
				password='password'
			)
		)
		self.team_data = {
			'name': 'Test Team',
			'organization': self.organization
		}

	def test_create_team(self):
		serializer = TeamSerializer(data=self.team_data)
		self.assertTrue(serializer.is_valid())
		team = serializer.save()
		self.assertEqual(team.name, 'Test Team')
		self.assertEqual(team.organization, self.organization)


class TeamMemberSerializerTests(TestCase):
	def setUp(self):
		self.admin_user = CustomUser.objects.create_user(
			username='admin_user',
			email='admin_user@example.com',
			password='admin_password'
		)
		self.organization = Organization.objects.create(
			description='Test Description',
			name='Test Organization',
			owner=self.admin_user
		)

		self.team = Team.objects.create(
			name='Test Team',
			organization=self.organization
		)
		self.role = Role.objects.create(name='Member')

	@patch('users.serializers.send_mail')
	def test_create_team_member(self, mock_send_mail):
		data = {
			'team_id': self.team.id,
			'username': 'new_member',
			'email': 'new_member@example.com',
			'role': 'Member',
			'first_name': 'First',
			'last_name': 'Last',
			'password': 'member_password'
		}
		serializer = TeamMemberSerializer(data=data)
		self.assertTrue(serializer.is_valid(), serializer.errors)
		membership = serializer.save()

		user = membership.user
		self.assertEqual(user.username, 'new_member')
		self.assertEqual(user.email, 'new_member@example.com')
		self.assertTrue(user.check_password('member_password'))
		self.assertEqual(user.first_name, 'First')
		self.assertEqual(user.last_name, 'Last')
		self.assertEqual(membership.team, self.team)
		self.assertEqual(membership.role, self.role)

		# Ensure email was sent
		mock_send_mail.assert_called_once_with(
			'Your Temporary Password',
			f'Hello new_member,\n\nYour temporary password is: member_password\nPlease log in and change your password.',
			'admin@example.com',
			['new_member@example.com'],
			fail_silently=False,
		)

	def test_validate_team_id(self):
		serializer = TeamMemberSerializer()
		validated_team = serializer.validate_team_id(self.team.id)
		self.assertEqual(validated_team, self.team)

	def test_validate_role(self):
		serializer = TeamMemberSerializer()
		validated_role = serializer.validate_role(self.role.name)
		self.assertEqual(validated_role, self.role)

	def test_invalid_team_id(self):
		serializer = TeamMemberSerializer()
		with self.assertRaises(serializers.ValidationError):
			serializer.validate_team_id(9999)

	def test_invalid_role(self):
		serializer = TeamMemberSerializer()
		with self.assertRaises(serializers.ValidationError):
			serializer.validate_role('InvalidRole')
