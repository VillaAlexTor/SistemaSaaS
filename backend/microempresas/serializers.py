from rest_framework import serializers
from .models import Microempresa, Cliente, Proveedor, Compra, DetalleCompra, Venta, DetalleVenta, Plan
from django.contrib.auth.hashers import make_password
from .models import Microempresa, Cliente, Proveedor, Compra, DetalleCompra, Venta, DetalleVenta, Plan, SolicitudUpgrade

class MicroempresaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Microempresa
        fields = ['id', 'nombre', 'nit', 'email', 'password', 'telefono', 'direccion', 'rubro', 'plan', 'activo', 'logo', 'descripcion', 'fecha_registro']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class ClienteSerializer(serializers.ModelSerializer):
    microempresa_nombre = serializers.CharField(source='microempresa.nombre', read_only=True)
    
    class Meta:
        model = Cliente
        fields = ['id', 'microempresa', 'microempresa_nombre', 'nombre', 'apellido', 'email', 'telefono', 'ci_nit', 'direccion', 'es_generico', 'activo', 'fecha_registro']

class ProveedorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proveedor
        fields = '__all__'

class DetalleCompraSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    
    class Meta:
        model = DetalleCompra
        fields = ['id', 'producto', 'producto_nombre', 'cantidad', 'precio_unitario', 'subtotal']

class CompraSerializer(serializers.ModelSerializer):
    detalles = DetalleCompraSerializer(many=True, read_only=True)
    proveedor_nombre = serializers.CharField(source='proveedor.nombre', read_only=True)
    
    class Meta:
        model = Compra
        fields = ['id', 'microempresa', 'proveedor', 'proveedor_nombre', 'numero_factura', 'fecha_compra', 'total', 'observaciones', 'detalles']

class DetalleVentaSerializer(serializers.ModelSerializer):
    producto_nombre = serializers.CharField(source='producto.nombre', read_only=True)
    
    class Meta:
        model = DetalleVenta
        fields = ['id', 'producto', 'producto_nombre', 'cantidad', 'precio_unitario', 'subtotal']

class VentaSerializer(serializers.ModelSerializer):
    detalles = DetalleVentaSerializer(many=True, read_only=True)
    cliente_nombre = serializers.SerializerMethodField()
    vendedor_nombre = serializers.CharField(source='vendedor.nombre', read_only=True)
    
    class Meta:
        model = Venta
        fields = ['id', 'microempresa', 'cliente', 'cliente_nombre', 'vendedor', 'vendedor_nombre', 'numero_venta', 'fecha_venta', 'subtotal', 'descuento', 'total', 'estado', 'metodo_pago', 'observaciones', 'detalles']
    
    def get_cliente_nombre(self, obj):
        if obj.cliente:
            return f"{obj.cliente.nombre} {obj.cliente.apellido or ''}".strip()
        return "Cliente Genérico"

class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class SolicitudUpgradeSerializer(serializers.ModelSerializer):
    microempresa_nombre = serializers.CharField(source='microempresa.nombre', read_only=True)
    microempresa_email = serializers.CharField(source='microempresa.email', read_only=True)
    metodo_pago_display = serializers.CharField(source='get_metodo_pago_display', read_only=True)
    comprobante_url = serializers.SerializerMethodField()  # NUEVO
    
    class Meta:
        model = SolicitudUpgrade
        fields = [
            'id', 'microempresa', 'microempresa_nombre', 'microempresa_email',
            'comprobante', 'comprobante_url', 'metodo_pago', 'metodo_pago_display',  # AGREGADO comprobante_url
            'estado', 'fecha_solicitud', 'fecha_revision', 'comentario_admin', 'monto'
        ]
        read_only_fields = ['fecha_solicitud', 'fecha_revision']
    
    def get_comprobante_url(self, obj):
        """Devolver URL completa del comprobante"""
        if obj.comprobante:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.comprobante.url)
            return obj.comprobante.url
        return None