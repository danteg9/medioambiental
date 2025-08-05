from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models

class Punto(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True)
    tipo = models.CharField(max_length=50, blank=True)

    latitud = models.FloatField()
    longitud = models.FloatField()

    fecha = models.DateTimeField()

    cultivos = models.TextField(blank=True)
    cambios = models.TextField(blank=True)

    temperatura = models.CharField(max_length=50, blank=True)
    humedad = models.CharField(max_length=50, blank=True)
    viento = models.CharField(max_length=50, blank=True)

    mail = models.EmailField(blank=True)

    def __str__(self):
        return self.nombre


class Foto(models.Model):
    punto = models.ForeignKey(Punto, related_name='fotos', on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='fotos/')

class UsuarioManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("El email es obligatorio")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)  # encripta
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)

class Usuario(AbstractBaseUser, PermissionsMixin):
    nombres = models.CharField(max_length=100)
    apellidos = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    objects = UsuarioManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["nombres", "apellidos"]

    def __str__(self):
        return self.email