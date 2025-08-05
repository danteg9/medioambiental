from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Punto, Foto, Usuario

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
            'fotos', 'mail',
        ]

class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    repetir_password = serializers.CharField(write_only=True)

    class Meta:
        model = Usuario
        fields = ["nombres", "apellidos", "email", "password", "repetir_password"]

    def validate(self, data):
        if data["password"] != data["repetir_password"]:
            raise serializers.ValidationError("Las contraseñas no coinciden")
        return data

    def create(self, validated_data):
        validated_data.pop("repetir_password")
        return Usuario.objects.create_user(**validated_data)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(email=data["email"], password=data["password"])
        if not user:
            raise serializers.ValidationError("Credenciales inválidas")
        data["user"] = user
        return data
    
class UsuarioAdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ['id', 'nombres', 'apellidos', 'email', 'is_superuser']

class UsuarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Usuario
        fields = ["email", "nombres", "apellidos"]
