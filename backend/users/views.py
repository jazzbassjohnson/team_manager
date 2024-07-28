from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response

from organizations.models import Organization
from teams.models import Role, Team, Membership
from .serializers import UserSerializer

CustomUser = get_user_model()


# Register a new user and create an organization for them
class UserRegistrationView(generics.CreateAPIView):
	serializer_class = UserSerializer

	def create(self, request, *args, **kwargs):
		user_serializer = self.get_serializer(data=request.data)
		user_serializer.is_valid(raise_exception=True)
		user = self.perform_create(user_serializer)

		# Create a new organization and set the user as the owner
		organization = Organization.objects.create(
			name=f"{user.username}'s Organization",
			owner=user
		)

		# Create a default team for the organization
		team = Team.objects.create(
			name=f"{user.username}'s Team",
			organization=organization
		)

		# Assign the user as an admin of the team
		admin_role, created = Role.objects.get_or_create(name='Admin')
		Membership.objects.create(
			user=user,
			team=team,
			role=admin_role
		)

		headers = self.get_success_headers(user_serializer.data)
		return Response(user_serializer.data, status=status.HTTP_201_CREATED, headers=headers)

	def perform_create(self, serializer):
		return serializer.save()


# List all users
class UserList(generics.ListCreateAPIView):
	queryset = CustomUser.objects.all()
	serializer_class = UserSerializer

	def get_object(self):
		queryset = self.get_queryset()
		obj = get_object_or_404(queryset, pk=self.kwargs['pk'])
		return obj


# Retrieve, update, or delete a user
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = CustomUser.objects.all()
	serializer_class = UserSerializer

	def get_object(self):
		queryset = self.get_queryset()
		obj = get_object_or_404(queryset, pk=self.kwargs['pk'])
		return obj
