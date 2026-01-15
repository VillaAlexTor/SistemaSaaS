from rest_framework import serializers
from .models import Administrador, UsuarioInterno, Notificacion
from django.contrib.auth.hashers import make_password

class AdministradorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Administrador
        fields = ['id', 'nombre', 'email', 'password', 'rol', 'activo', 'fecha_registro']
        extra_kwargs = {
            'password': {'write_only': True}  
        }
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class UsuarioInternoSerializer(serializers.ModelSerializer):
    microempresa_nombre = serializers.CharField(source='microempresa.nombre', read_only=True)
    
    class Meta:
        model = UsuarioInterno
        fields = ['id', 'microempresa', 'microempresa_nombre', 'nombre', 'email', 'password', 'telefono', 'rol', 'activo', 'fecha_registro']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        return super().create(validated_data)

class NotificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notificacion
        fields = '__all__'