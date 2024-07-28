from django.urls import path

from teams.views import TeamListView, TeamMemberView

urlpatterns = [
	path('teams/', TeamListView.as_view(), name='team_list_create'),
	path('add_member/', TeamMemberView.as_view(), name='add_team_member'),
]
