from django.urls import path
from .views import crear_punto, listar_puntos, registro, login, obtener_usuario
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('puntos/crear/', crear_punto, name='crear_punto'),
    path('puntos/listar/', listar_puntos, name='listar_puntos'),
    path("registro/", registro, name="registro"),
    path("login/", login, name="login"),
    path("usuario/", obtener_usuario, name="obtener_usuario"),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

]