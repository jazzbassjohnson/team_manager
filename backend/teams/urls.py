from django.urls import path

from teams.views import TeamListCreateView

urlpatterns = [
	path('teams/', TeamListCreateView.as_view(), name='team-list-create'),
]
