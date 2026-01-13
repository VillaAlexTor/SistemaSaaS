from django.db import models
from django.contrib.auth.hashers import make_password

class Administrador(models.Model):
    ROL_CHOICES = [
        ('superadmin', 'Super Admin'),
        ('admin', 'Admin'),
    ]
    
    nombre = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    rol = models.CharField(max_length=20, choices=ROL_CHOICES, default='admin')
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'administradores'
        verbose_name = 'Administrador'
        verbose_name_plural = 'Administradores'
    
    def save(self, *args, **kwargs):
        if not self.pk and not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.nombre

class UsuarioInterno(models.Model):
    """Usuarios que trabajan EN una microempresa (vendedores, admins locales)"""
    ROL_CHOICES = [
        ('admin_empresa', 'Administrador de Empresa'),
        ('vendedor', 'Vendedor'),
        ('cajero', 'Cajero'),
    ]
    
    microempresa = models.ForeignKey('microempresas.Microempresa', on_delete=models.CASCADE, related_name='usuarios_internos')
    nombre = models.CharField(max_length=100)
    email = models.EmailField()
    password = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    rol = models.CharField(max_length=20, choices=ROL_CHOICES)
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'usuarios_internos'
        unique_together = ['microempresa', 'email']

class Notificacion(models.Model):
    TIPO_CHOICES = [
        ('stock_bajo', 'Stock Bajo'),
        ('venta', 'Venta Realizada'),
        ('nuevo_cliente', 'Nuevo Cliente'),
        ('sistema', 'Sistema'),
    ]
    
    microempresa = models.ForeignKey('microempresas.Microempresa', on_delete=models.CASCADE, related_name='notificaciones')
    usuario = models.ForeignKey(UsuarioInterno, on_delete=models.CASCADE, related_name='notificaciones')
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    titulo = models.CharField(max_length=200)
    mensaje = models.TextField()
    leida = models.BooleanField(default=False)
    fecha_creacion = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'notificaciones'