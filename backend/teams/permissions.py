from rest_framework.permissions import BasePermission
from .models import Membership, Role


class IsAdmin(BasePermission):
	def has_permission(self, request, view):
		user = request.user
		team_id = request.data.get('team_id')
		if team_id:
			try:
				membership = Membership.objects.get(user=user, team_id=team_id)
				return membership.role.name == 'Admin'
			except Membership.DoesNotExist:
				return False
		return False
