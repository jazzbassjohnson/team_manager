from django.urls import path
from users.views import UserList, UserDetail, UserRegistrationView

urlpatterns = [
	path('', UserList.as_view(), name='user-list'),
	path('create/', UserRegistrationView.as_view(), name='user-create'),
	path('<int:pk>/', UserDetail.as_view(), name='user-detail'),
]
