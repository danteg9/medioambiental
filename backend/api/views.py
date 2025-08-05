from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Punto, Foto, Usuario
from .serializers import PuntoSerializer, RegistroSerializer, LoginSerializer, UsuarioAdminSerializer, UsuarioSerializer

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
            mail=request.user.email
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
        'is_superuser': user.is_superuser,
        'is_staff': user.is_staff,
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def listar_usuarios_admin(request):
    if not request.user.is_staff:
        return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

    usuarios = Usuario.objects.all()
    serializer = UsuarioAdminSerializer(usuarios, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def toggle_superuser(request, pk):
    if not request.user.is_staff:
        return Response({'detail': 'No autorizado'}, status=status.HTTP_403_FORBIDDEN)

    try:
        usuario = Usuario.objects.get(pk=pk)
    except Usuario.DoesNotExist:
        return Response({'detail': 'Usuario no encontrado'}, status=status.HTTP_404_NOT_FOUND)

    usuario.is_superuser = not usuario.is_superuser
    usuario.save()
    return Response({'is_superuser': usuario.is_superuser})

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def obtener_usuario_por_email(request):
    email = request.query_params.get("email")
    if not email:
        return Response({"error": "Falta el parámetro 'email'"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        usuario = Usuario.objects.get(email=email)
        serializer = UsuarioSerializer(usuario)
        return Response(serializer.data)
    except Usuario.DoesNotExist:
        return Response({"error": "Usuario no encontrado"}, status=status.HTTP_404_NOT_FOUND)