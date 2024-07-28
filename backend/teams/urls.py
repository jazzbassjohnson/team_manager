from django.urls import path

from teams.views import TeamListCreateView, AddTeamMemberView

urlpatterns = [
	path('teams/', TeamListCreateView.as_view(), name='team_list_create'),
	path('add_member/', AddTeamMemberView.as_view(), name='add_team_member'),
]
