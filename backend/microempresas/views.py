from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Microempresa, Cliente, Proveedor, Compra, Venta, Plan
from .serializers import (
    MicroempresaSerializer, ClienteSerializer, ProveedorSerializer,
    CompraSerializer, VentaSerializer, PlanSerializer
)
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