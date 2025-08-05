from django.urls import path
from .views import crear_punto, listar_puntos, registro, login, obtener_usuario, listar_usuarios_admin, toggle_superuser, obtener_usuario_por_email
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('puntos/crear/', crear_punto, name='crear_punto'),
    path('puntos/listar/', listar_puntos, name='listar_puntos'),
    path("registro/", registro, name="registro"),
    path("login/", login, name="login"),
    path("usuario/", obtener_usuario, name="obtener_usuario"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('usuarios/admin/', listar_usuarios_admin, name='listar_usuarios_admin'),
    path('usuarios/admin/<int:pk>/toggle_superuser/', toggle_superuser, name='toggle_superuser'),
    path('usuarios/email/', obtener_usuario_por_email, name='obtener_usuario_por_email'),
]