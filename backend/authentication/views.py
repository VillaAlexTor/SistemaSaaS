# backend/authentication/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.hashers import check_password

from .models import Administrador, UsuarioInterno, Notificacion
from .serializers import AdministradorSerializer, UsuarioInternoSerializer, NotificacionSerializer
from microempresas.models import Microempresa
from usuarios.models import Usuario


class AdministradorViewSet(viewsets.ModelViewSet):
    queryset = Administrador.objects.all()
    serializer_class = AdministradorSerializer


class UsuarioInternoViewSet(viewsets.ModelViewSet):
    queryset = UsuarioInterno.objects.all()
    serializer_class = UsuarioInternoSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        microempresa_id = self.request.query_params.get('microempresa', None)
        if microempresa_id:
            queryset = queryset.filter(microempresa_id=microempresa_id)
        return queryset


class NotificacionViewSet(viewsets.ModelViewSet):
    queryset = Notificacion.objects.all()
    serializer_class = NotificacionSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        microempresa_id = self.request.query_params.get('microempresa', None)
        if microempresa_id:
            queryset = queryset.filter(microempresa_id=microempresa_id)
        return queryset


# Vista de Login Unificado
class LoginView(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def login(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not email or not password:
            return Response({
                'success': False,
                'message': 'Email y contraseña son requeridos'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # 1. Intentar como Administrador
        try:
            admin = Administrador.objects.get(email=email)
            if check_password(password, admin.password):
                return Response({
                    'success': True,
                    'usuario': {
                        'id': admin.id,
                        'nombre': admin.nombre,
                        'email': admin.email,
                        'rol': 'superadmin'
                    }
                })
        except Administrador.DoesNotExist:
            pass
        
        # 2. Intentar como Microempresa
        try:
            microempresa = Microempresa.objects.get(email=email)
            if check_password(password, microempresa.password):
                return Response({
                    'success': True,
                    'usuario': {
                        'id': microempresa.id,
                        'nombre': microempresa.nombre,
                        'email': microempresa.email,
                        'rol': 'microempresa',
                        'plan': microempresa.plan,
                        'rubro': microempresa.rubro
                    }
                })
        except Microempresa.DoesNotExist:
            pass
        
        # 3. Intentar como Cliente/Empleado (NUEVO)
        try:
            from microempresas.models import Cliente
            cliente = Cliente.objects.get(email=email, rol='vendedor', activo=True, eliminado=False)
            if cliente.password and check_password(password, cliente.password):
                return Response({
                    'success': True,
                    'usuario': {
                        'id': cliente.id,
                        'nombre': f"{cliente.nombre} {cliente.apellido or ''}".strip(),
                        'email': cliente.email,
                        'rol': 'empleado',
                        'microempresa_id': cliente.microempresa.id,
                        'microempresa_nombre': cliente.microempresa.nombre,
                        'microempresa_plan': cliente.microempresa.plan
                    }
                })
        except Cliente.DoesNotExist:
            pass
        
        # 4. Intentar como Usuario
        try:
            usuario = Usuario.objects.get(email=email)
            if check_password(password, usuario.password):
                return Response({
                    'success': True,
                    'usuario': {
                        'id': usuario.id,
                        'nombre': f"{usuario.nombre} {usuario.apellido}",
                        'email': usuario.email,
                        'rol': 'usuario'
                    }
                })
        except Usuario.DoesNotExist:
            pass
        
        # Si ninguno funciona
        return Response({
            'success': False,
            'message': 'Email o contraseña incorrectos'
        }, status=status.HTTP_401_UNAUTHORIZED)