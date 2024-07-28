from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken

from organizations.models import Organization
from teams.models import Role, Team, Membership
from .serializers import UserCreateSerializer

CustomUser = get_user_model()


# Register a new user and create an organization for them
class UserRegistrationView(generics.CreateAPIView):
	serializer_class = UserCreateSerializer

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

		tokens = self.get_tokens_for_user(user)

		return Response({
			'user': UserCreateSerializer(user).data,
			'refresh': str(tokens['refresh']),
			'access': str(tokens['access']),  # pycharm is complaining about this line
		}, status=status.HTTP_201_CREATED)

	def perform_create(self, serializer):
		return serializer.save()

	@staticmethod
	def get_tokens_for_user(user):
		refresh = RefreshToken.for_user(user)

		return {
			'refresh': str(refresh),
			'access': str(refresh.access_token),
		}


# List all users
class UserList(generics.ListCreateAPIView):
	queryset = CustomUser.objects.all()
	serializer_class = UserCreateSerializer

	def get_object(self):
		queryset = self.get_queryset()
		obj = get_object_or_404(queryset, pk=self.kwargs['pk'])
		return obj


# Retrieve, update, or delete a user
class UserDetail(generics.RetrieveUpdateDestroyAPIView):
	queryset = CustomUser.objects.all()
	serializer_class = UserCreateSerializer

	def get_object(self):
		queryset = self.get_queryset()
		obj = get_object_or_404(queryset, pk=self.kwargs['pk'])
		return obj
