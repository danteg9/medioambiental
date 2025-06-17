from django.urls import path
from .views import crear_punto, listar_puntos

urlpatterns = [
    path('puntos/crear/', crear_punto, name='crear_punto'),
    path('puntos/listar/', listar_puntos, name='listar_puntos'),
]