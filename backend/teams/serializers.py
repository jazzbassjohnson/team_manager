from rest_framework import serializers

from users.serializers import UserSerializer
from .models import Team, Membership, Role


class TeamSerializer(serializers.ModelSerializer):
	class Meta:
		model = Team
		fields = ['id', 'name', 'organization']

	def create(self, validated_data):
		team = Team.objects.create(**validated_data)
		return team


class TeamMemberSerializer(serializers.Serializer):
	team_id = serializers.IntegerField()
	username = serializers.CharField(max_length=150)
	email = serializers.EmailField()
	role = serializers.CharField(max_length=255)
	first_name = serializers.CharField(max_length=30, required=False)
	last_name = serializers.CharField(max_length=30, required=False)
	password = serializers.CharField(write_only=True)

	@staticmethod
	def validate_role(self, value):
		try:
			role = Role.objects.get(name=value)
		except Role.DoesNotExist:
			raise serializers.ValidationError("Invalid role")
		return role

	@staticmethod
	def validate_team_id(self, value):
		try:
			team = Team.objects.get(id=value)
		except Team.DoesNotExist:
			raise serializers.ValidationError("Invalid team ID")
		return team

	def create(self, validated_data):
		user_data = {
			'username': validated_data['username'],
			'email': validated_data['email'],
			'password': validated_data['password'],
			'first_name': validated_data.get('first_name', ''),
			'last_name': validated_data.get('last_name', '')
		}

		user_serializer = UserCreateSerializer(data=user_data)
		user_serializer.is_valid(raise_exception=True)
		user = user_serializer.save()

		team = validated_data['team_id']
		role = validated_data['role']

		membership = Membership.objects.create(
			user=user,
			team=team,
			role=role
		)

		return membership


class MembershipSerializer(serializers.ModelSerializer):
	class Meta:
		model = Membership
		fields = ['id', 'user', 'team', 'role']


class RoleSerializer(serializers.ModelSerializer):
	class Meta:
		model = Role
		fields = '__all__'
