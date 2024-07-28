from django.urls import path

from teams.views import TeamListView, TeamMemberView, TeamDetailView

urlpatterns = [
	path('', TeamListView.as_view(), name='team_list'),
	path('<int:pk>/', TeamDetailView.as_view(), name='team'),
	path('add_member/', TeamMemberView.as_view(), name='add_team_member'),
]
