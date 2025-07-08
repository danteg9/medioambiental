from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Punto, Foto
from .serializers import PuntoSerializer, RegistroSerializer, LoginSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
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
@permission_classes([IsAuthenticated])
def listar_puntos(request):
    puntos = Punto.objects.all().order_by('-fecha')
    serializer = PuntoSerializer(puntos, many=True, context={'request': request})
    return Response(serializer.data)

@api_view(['POST'])
def registro(request):
    serializer = RegistroSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Generar tokens JWT
        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def obtener_usuario(request):
    user = request.user
    data = {
        'nombres': user.nombres,
        'apellidos': user.apellidos,
        'email': user.email,
    }
    return Response(data, status=status.HTTP_200_OK)