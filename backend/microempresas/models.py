from django.db import models
from django.contrib.auth.hashers import make_password

class Microempresa(models.Model):
    PLAN_CHOICES = [
        ('basico', 'Básico'),
        ('premium', 'Premium'),
    ]
    
    nombre = models.CharField(max_length=100)
    nit = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.CharField(max_length=255, blank=True, null=True)
    rubro = models.CharField(max_length=50, blank=True, null=True)
    plan = models.CharField(max_length=10, choices=PLAN_CHOICES, default='basico')
    activo = models.BooleanField(default=True)
    logo = models.CharField(max_length=10, default='🏪')
    descripcion = models.TextField(blank=True, null=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'microempresas'
        verbose_name = 'Microempresa'
        verbose_name_plural = 'Microempresas'
    
    def save(self, *args, **kwargs):
        if not self.pk and not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.nombre

class Cliente(models.Model):
    microempresa = models.ForeignKey(Microempresa, on_delete=models.CASCADE, related_name='clientes')
    nombre = models.CharField(max_length=100)
    apellido = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    telefono = models.CharField(max_length=20)
    ci_nit = models.CharField(max_length=20, blank=True, null=True)
    direccion = models.TextField(blank=True, null=True)
    es_generico = models.BooleanField(default=False)  # Para ventas rápidas
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'clientes'
        unique_together = ['microempresa', 'email']

class Proveedor(models.Model):
    microempresa = models.ForeignKey(Microempresa, on_delete=models.CASCADE, related_name='proveedores')
    nombre = models.CharField(max_length=100)
    nit = models.CharField(max_length=20, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    telefono = models.CharField(max_length=20)
    direccion = models.TextField(blank=True, null=True)
    productos_suministrados = models.TextField(blank=True, null=True)  # Lista separada por comas
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'proveedores'

class Compra(models.Model):
    microempresa = models.ForeignKey(Microempresa, on_delete=models.CASCADE, related_name='compras')
    proveedor = models.ForeignKey(Proveedor, on_delete=models.SET_NULL, null=True, related_name='compras')
    numero_factura = models.CharField(max_length=50, blank=True, null=True)
    fecha_compra = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    observaciones = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'compras'

class DetalleCompra(models.Model):
    compra = models.ForeignKey(Compra, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey('productos.Producto', on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        db_table = 'detalle_compra'

# backend/microempresas/models.py (añadir)

class Venta(models.Model):
    ESTADO_CHOICES = [
        ('pendiente', 'Pendiente'),
        ('pagado', 'Pagado'),
        ('entregado', 'Entregado'),
        ('cancelado', 'Cancelado'),
    ]
    
    microempresa = models.ForeignKey(Microempresa, on_delete=models.CASCADE, related_name='ventas')
    cliente = models.ForeignKey(Cliente, on_delete=models.SET_NULL, null=True, related_name='compras')
    vendedor = models.ForeignKey('authentication.UsuarioInterno', on_delete=models.SET_NULL, null=True)
    numero_venta = models.CharField(max_length=50, unique=True)
    fecha_venta = models.DateTimeField(auto_now_add=True)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    descuento = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=10, decimal_places=2)
    estado = models.CharField(max_length=20, choices=ESTADO_CHOICES, default='pendiente')
    metodo_pago = models.CharField(max_length=50, blank=True, null=True)  # QR, efectivo, tarjeta
    observaciones = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'ventas'

class DetalleVenta(models.Model):
    venta = models.ForeignKey(Venta, on_delete=models.CASCADE, related_name='detalles')
    producto = models.ForeignKey('productos.Producto', on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2)
    subtotal = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        db_table = 'detalle_venta'

class Plan(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    descripcion = models.TextField()
    precio_mensual = models.DecimalField(max_digits=10, decimal_places=2)
    max_productos = models.IntegerField()
    max_usuarios = models.IntegerField()
    tiene_reportes = models.BooleanField(default=False)
    tiene_api = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'planes'