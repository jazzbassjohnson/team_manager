from django.urls import path
from users.views import UserList, UserDetail, CreateUserView

urlpatterns = [
	path('', UserList.as_view(), name='user-list'),
	path('create/', CreateUserView.as_view(), name='user-create'),
	path('<int:pk>/', UserDetail.as_view(), name='user-detail'),
]
