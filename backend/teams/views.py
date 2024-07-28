from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Team
from .permissions import IsAdmin
from .serializers import TeamMemberSerializer
from .serializers import TeamSerializer
from organizations.models import Organization


class TeamListView(generics.ListCreateAPIView):
	serializer_class = TeamSerializer

	def get_queryset(self):
		# get authenticated user's organization
		organization = Organization.objects.filter(owner=self.request.user)
		# get all teams where the authenticated user is the has a membership
		return Team.objects.filter(organization=organization[0])

	def perform_create(self, serializer):
		serializer.save(owner=self.request.user)


class TeamCreateView(generics.CreateAPIView):
	serializer_class = TeamSerializer
	permission_classes = [IsAuthenticated]

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		team = serializer.save(owner=request.user)

		return Response({
			'id': team.id,
			'name': team.name,
			'organization': team.organization.name
		}, status=status.HTTP_201_CREATED)


class TeamMemberView(generics.CreateAPIView):
	serializer_class = TeamMemberSerializer
	permission_classes = [IsAuthenticated, IsAdmin]

	def create(self, request, *args, **kwargs):
		serializer = self.get_serializer(data=request.data)
		serializer.is_valid(raise_exception=True)
		membership = serializer.save()

		return Response({
			'id': membership.id,
			'user': {
				'username': membership.user.username,
				'email': membership.user.email,
				'first_name': membership.user.first_name,
				'last_name': membership.user.last_name,
			},
			'team': membership.team.name,
			'role': membership.role.name
		}, status=status.HTTP_201_CREATED)


class TeamDetailView(generics.RetrieveUpdateDestroyAPIView):
	serializer_class = TeamSerializer
	permission_classes = [IsAuthenticated]

	def get_queryset(self):
		pk = self.kwargs['pk']
		organization = Organization.objects.filter(
			owner=self.request.user)
		return Team.objects.filter(organization=organization[0], pk=pk)
