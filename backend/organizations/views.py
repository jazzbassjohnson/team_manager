from rest_framework import generics
from rest_framework.permissions import AllowAny

from .models import Organization
from .serializers import OrganizationSerializer


class OrganizationListCreateView(generics.ListCreateAPIView):
	queryset = Organization.objects.all()
	serializer_class = OrganizationSerializer
	permission_classes = [
		AllowAny
	]
