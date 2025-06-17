from rest_framework import serializers
from .models import Punto, Foto

class FotoSerializer(serializers.ModelSerializer):
    imagen = serializers.SerializerMethodField()

    class Meta:
        model = Foto
        fields = ['id', 'imagen']

    def get_imagen(self, obj):
        request = self.context.get('request')
        return request.build_absolute_uri(obj.imagen.url) if request else obj.imagen.url


class PuntoSerializer(serializers.ModelSerializer):
    fotos = FotoSerializer(many=True, read_only=True)

    class Meta:
        model = Punto
        fields = [
            'id', 'nombre', 'descripcion', 'tipo',
            'latitud', 'longitud', 'fecha',
            'cultivos', 'cambios',
            'temperatura', 'humedad', 'viento',
            'fotos',
        ]
