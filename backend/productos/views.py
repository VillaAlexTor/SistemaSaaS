from rest_framework import viewsets
from .models import Categoria, Producto, InventarioMovimiento
from .serializers import CategoriaSerializer, ProductoSerializer, InventarioMovimientoSerializer

class CategoriaViewSet(viewsets.ModelViewSet):
    queryset = Categoria.objects.all()
    serializer_class = CategoriaSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        microempresa_id = self.request.query_params.get('microempresa', None)
        if microempresa_id:
            queryset = queryset.filter(microempresa_id=microempresa_id)
        return queryset

class ProductoViewSet(viewsets.ModelViewSet):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        microempresa_id = self.request.query_params.get('microempresa', None)
        if microempresa_id:
            queryset = queryset.filter(microempresa_id=microempresa_id)
        return queryset

class InventarioMovimientoViewSet(viewsets.ModelViewSet):
    queryset = InventarioMovimiento.objects.all()
    serializer_class = InventarioMovimientoSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        microempresa_id = self.request.query_params.get('microempresa', None)
        if microempresa_id:
            queryset = queryset.filter(microempresa_id=microempresa_id)
        return queryset