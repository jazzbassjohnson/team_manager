from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Team
from .serializers import TeamMemberSerializer
from .serializers import TeamSerializer


class TeamListView(generics.ListCreateAPIView):
	queryset = Team.objects.all()
	serializer_class = TeamSerializer

	def perform_create(self, serializer):
		serializer.save(owner=self.request.user)

	def get_queryset(self):
		return self.queryset.filter(owner=self.request.user)


class TeamView(generics.CreateAPIView):
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
	permission_classes = [IsAuthenticated]

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
