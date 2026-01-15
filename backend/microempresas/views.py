from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Microempresa, Cliente, Proveedor, Compra, Venta, Plan
from .serializers import (
    MicroempresaSerializer, ClienteSerializer, ProveedorSerializer,
    CompraSerializer, VentaSerializer, PlanSerializer
)
from rest_framework.decorators import action
from django.contrib.auth.hashers import check_password, make_password
from sistema_ventas_api.utils import verify_recaptcha
class MicroempresaViewSet(viewsets.ModelViewSet):
    queryset = Microempresa.objects.all()
    serializer_class = MicroempresaSerializer
    
    def create(self, request, *args, **kwargs):
        # Verificar el captcha ANTES de crear la microempresa
        recaptcha_response = request.data.get('recaptcha_token')
        
        if not recaptcha_response:
            return Response({
                'success': False,
                'message': 'Por favor completa el CAPTCHA'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not verify_recaptcha(recaptcha_response):
            return Response({
                'success': False,
                'message': 'CAPTCHA inválido. Por favor inténtalo de nuevo.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Si el captcha es válido, continuar con el registro normal
        return super().create(request, *args, **kwargs)
    @action(detail=True, methods=['post'])
    def cambiar_password(self, request, pk=None):
        """
        Endpoint para cambiar la contraseña de una microempresa
        """
        microempresa = self.get_object()
        password_actual = request.data.get('password_actual')
        nueva_password = request.data.get('nueva_password')
        
        if not password_actual or not nueva_password:
            return Response({
                'success': False,
                'message': 'Se requiere la contraseña actual y la nueva'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Verificar que la contraseña actual sea correcta
        if not check_password(password_actual, microempresa.password):
            return Response({
                'success': False,
                'message': 'La contraseña actual es incorrecta'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Actualizar la contraseña
        microempresa.password = make_password(nueva_password)
        microempresa.save()
        
        return Response({
            'success': True,
            'message': 'Contraseña actualizada correctamente'
        })
class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        microempresa_id = self.request.query_params.get('microempresa', None)
        if microempresa_id:
            queryset = queryset.filter(microempresa_id=microempresa_id)
        return queryset

class ProveedorViewSet(viewsets.ModelViewSet):
    queryset = Proveedor.objects.all()
    serializer_class = ProveedorSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        microempresa_id = self.request.query_params.get('microempresa', None)
        if microempresa_id:
            queryset = queryset.filter(microempresa_id=microempresa_id)
        return queryset

class CompraViewSet(viewsets.ModelViewSet):
    queryset = Compra.objects.all()
    serializer_class = CompraSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        microempresa_id = self.request.query_params.get('microempresa', None)
        if microempresa_id:
            queryset = queryset.filter(microempresa_id=microempresa_id)
        return queryset

class VentaViewSet(viewsets.ModelViewSet):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        microempresa_id = self.request.query_params.get('microempresa', None)
        if microempresa_id:
            queryset = queryset.filter(microempresa_id=microempresa_id)
        return queryset

class PlanViewSet(viewsets.ModelViewSet):
    queryset = Plan.objects.filter(activo=True)
    serializer_class = PlanSerializer