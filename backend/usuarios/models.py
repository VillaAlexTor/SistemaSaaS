from django.db import models
from django.contrib.auth.hashers import make_password

class Usuario(models.Model):
    nombre = models.CharField(max_length=50)
    apellido = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=255)
    telefono = models.CharField(max_length=20, blank=True, null=True)
    activo = models.BooleanField(default=True)
    fecha_registro = models.DateTimeField(auto_now_add=True)
    
    reset_password_token = models.CharField(max_length=100, blank=True, null=True)
    reset_password_token_created = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.nombre} {self.apellido}"
        
    class Meta:
        db_table = 'usuarios'
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
    
    def save(self, *args, **kwargs):
        if not self.pk and not self.password.startswith('pbkdf2_'):
            self.password = make_password(self.password)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.nombre} {self.apellido}"