from django.urls import path

from organizations.views import OrganizationListCreateView

urlpatterns = [
	path('organizations/', OrganizationListCreateView.as_view(), name='organization-list-create'),
]
