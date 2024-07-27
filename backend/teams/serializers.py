from rest_framework import serializers
from .models import Team, Membership, Role


class TeamSerializer(serializers.ModelSerializer):
	class Meta:
		model = Team
		fields = '__all__'


class MembershipSerializer(serializers.ModelSerializer):
	class Meta:
		model = Membership
		fields = '__all__'


class RoleSerializer(serializers.ModelSerializer):
	class Meta:
		model = Role
		fields = '__all__'
