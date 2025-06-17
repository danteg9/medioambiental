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

    def __str__(self):
        return self.nombre


class Foto(models.Model):
    punto = models.ForeignKey(Punto, related_name='fotos', on_delete=models.CASCADE)
    imagen = models.ImageField(upload_to='fotos/')
