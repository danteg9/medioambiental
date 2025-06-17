from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import Punto, Foto
from .serializers import PuntoSerializer

@api_view(['POST'])
def crear_punto(request):
    try:
        data = request.data

        punto = Punto.objects.create(
            nombre=data.get('nombre'),
            descripcion=data.get('descripcion', ''),
            tipo=data.get('tipo', ''),
            latitud=data.get('latitud'),
            longitud=data.get('longitud'),
            fecha=data.get('fecha'),
            cultivos=data.get('cultivos', ''),
            cambios=data.get('cambios', ''),
            temperatura=data.get('temperatura', ''),
            humedad=data.get('humedad', ''),
            viento=data.get('viento', ''),
        )

        for imagen in request.FILES.getlist('fotos'):
            Foto.objects.create(punto=punto, imagen=imagen)

        return Response(PuntoSerializer(punto).data, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def listar_puntos(request):
    puntos = Punto.objects.all().order_by('-fecha')
    serializer = PuntoSerializer(puntos, many=True, context={'request': request})
    return Response(serializer.data)