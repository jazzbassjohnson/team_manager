from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from users.views import UserRegistrationView

api_urlpatterns = [
	path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
	path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
	path('user/register/', UserRegistrationView.as_view(), name='register'),
	path('users/', include('users.urls')),
	path('organizations/', include('organizations.urls')),
	path('teams/', include('teams.urls')),
]
urlpatterns = [
	path('admin/', admin.site.urls),
	path('api-auth/', include('rest_framework.urls')),
	path('api/', include(api_urlpatterns)),
]

# Static files serving
if settings.DEBUG:
	urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
