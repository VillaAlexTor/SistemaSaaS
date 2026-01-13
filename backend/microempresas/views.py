from rest_framework import viewsets
from .models import Microempresa, Cliente, Proveedor, Compra, Venta, Plan
from .serializers import (
    MicroempresaSerializer, ClienteSerializer, ProveedorSerializer,
    CompraSerializer, VentaSerializer, PlanSerializer
)

class MicroempresaViewSet(viewsets.ModelViewSet):
    queryset = Microempresa.objects.filter(activo=True)
    serializer_class = MicroempresaSerializer

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