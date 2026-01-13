from rest_framework import serializers
from .models import Categoria, Producto, InventarioMovimiento

class CategoriaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Categoria
        fields = '__all__'

class ProductoSerializer(serializers.ModelSerializer):
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    microempresa_nombre = serializers.CharField(source='microempresa.nombre', read_only=True)
    
    class Meta:
        model = Producto
        fields = ['id', 'microempresa', 'microempresa_nombre', 'categoria', 'categoria_nombre', 'codigo', 'nombre', 'descripcion', 'precio_compra', 'precio_venta', 'stock', 'stock_minimo', 'imagen', 'activo', 'fecha_creacion', 'fecha_actualizacion']

class InventarioMovimientoSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    usuario_nombre = serializers.CharField(source='usuario.nombre', read_only=True)
    
    class Meta:
        model = InventarioMovimiento
        fields = '__all__'