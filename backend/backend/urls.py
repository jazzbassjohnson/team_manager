from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from users.views import UserRegistrationView

urlpatterns = [
	path('admin/', admin.site.urls),
	path('api-auth/', include('rest_framework.urls')),
	path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
	path('api/token/refresh/', TokenRefreshView.as_view(), name='refresh'),
	path('api/user/register/', UserRegistrationView.as_view(), name='register'),
	path('users/', include('users.urls')),
	path('organizations/', include('organizations.urls')),
	path('teams/', include('teams.urls')),
]

# Static files serving
if settings.DEBUG:
	urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
