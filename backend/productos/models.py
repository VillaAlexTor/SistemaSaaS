from django.db import models

class Categoria(models.Model):
    microempresa = models.ForeignKey('microempresas.Microempresa', on_delete=models.CASCADE, related_name='categorias')
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'categorias'
        unique_together = ['microempresa', 'nombre']
    
    def __str__(self):
        return self.nombre

class Producto(models.Model):
    microempresa = models.ForeignKey('microempresas.Microempresa', on_delete=models.CASCADE, related_name='productos')
    categoria = models.ForeignKey(Categoria, on_delete=models.SET_NULL, null=True, blank=True, related_name='productos')
    codigo = models.CharField(max_length=50, blank=True, null=True)  # SKU
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField(blank=True, null=True)
    precio_compra = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    precio_venta = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.IntegerField(default=0)
    stock_minimo = models.IntegerField(default=5)  # Para alertas
    imagen = models.CharField(max_length=255, blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'productos'
        unique_together = ['microempresa', 'codigo']
    
    def __str__(self):
        return self.nombre

class InventarioMovimiento(models.Model):
    TIPO_CHOICES = [
        ('entrada', 'Entrada'),
        ('salida', 'Salida'),
        ('ajuste', 'Ajuste'),
    ]
    
    microempresa = models.ForeignKey('microempresas.Microempresa', on_delete=models.CASCADE, related_name='movimientos_inventario')
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE, related_name='movimientos')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    cantidad = models.IntegerField()
    stock_anterior = models.IntegerField()
    stock_nuevo = models.IntegerField()
    motivo = models.CharField(max_length=255)
    usuario = models.ForeignKey('authentication.UsuarioInterno', on_delete=models.SET_NULL, null=True)
    fecha = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'inventario_movimiento'
    
    def __str__(self):
        return f"{self.tipo} - {self.producto.nombre} ({self.cantidad})"