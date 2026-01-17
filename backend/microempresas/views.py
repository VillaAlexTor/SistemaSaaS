# backend/microempresas/views.py

from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Microempresa, Cliente, Proveedor, Compra, Venta, Plan, SolicitudUpgrade
from .serializers import (
    MicroempresaSerializer, ClienteSerializer, ProveedorSerializer,
    CompraSerializer, VentaSerializer, PlanSerializer, SolicitudUpgradeSerializer
)
from rest_framework.decorators import action
from django.contrib.auth.hashers import check_password, make_password
from sistema_ventas_api.utils import verify_recaptcha
from django.utils import timezone

class MicroempresaViewSet(viewsets.ModelViewSet):
    queryset = Microempresa.objects.all()
    serializer_class = MicroempresaSerializer
    
    def create(self, request, *args, **kwargs):
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
        
        return super().create(request, *args, **kwargs)
    
    @action(detail=True, methods=['post'])
    def cambiar_password(self, request, pk=None):
        microempresa = self.get_object()
        password_actual = request.data.get('password_actual')
        nueva_password = request.data.get('nueva_password')
        
        if not password_actual or not nueva_password:
            return Response({
                'success': False,
                'message': 'Se requiere la contraseña actual y la nueva'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not check_password(password_actual, microempresa.password):
            return Response({
                'success': False,
                'message': 'La contraseña actual es incorrecta'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        microempresa.password = make_password(nueva_password)
        microempresa.save()
        
        return Response({
            'success': True,
            'message': 'Contraseña actualizada correctamente'
        })

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        microempresa_id = self.request.query_params.get('microempresa', None)
        eliminados = self.request.query_params.get('eliminados', 'false')
        rol = self.request.query_params.get('rol', None)
        
        if microempresa_id:
            queryset = queryset.filter(microempresa_id=microempresa_id)
        
        # Filtrar por estado eliminado
        if eliminados == 'true':
            queryset = queryset.filter(eliminado=True)
        else:
            queryset = queryset.filter(eliminado=False)
        
        # Filtrar por rol
        if rol:
            queryset = queryset.filter(rol=rol)
        
        return queryset
    
    @action(detail=True, methods=['delete'])
    def soft_delete(self, request, pk=None):
        """Enviar a papelera (soft delete)"""
        cliente = self.get_object()
        
        if cliente.eliminado:
            return Response({
                'success': False,
                'message': 'Este empleado ya está en la papelera'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cliente.eliminado = True
        cliente.activo = False
        cliente.fecha_eliminacion = timezone.now()
        cliente.save()
        
        return Response({
            'success': True,
            'message': 'Empleado enviado a la papelera'
        })
    
    # 🔥 AQUÍ ESTÁ EL FIX - NO USAR get_object()
    @action(detail=True, methods=['post'])
    def restaurar(self, request, pk=None):
        """Restaurar de la papelera"""
        try:
            # ✅ ACCEDER DIRECTAMENTE SIN FILTROS
            cliente = Cliente.objects.get(pk=pk)
        except Cliente.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Cliente no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if not cliente.eliminado:
            return Response({
                'success': False,
                'message': 'Este empleado no está en la papelera'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cliente.eliminado = False
        cliente.activo = True
        cliente.fecha_eliminacion = None
        cliente.save()
        
        return Response({
            'success': True,
            'message': 'Empleado restaurado exitosamente'
        })
    
    @action(detail=True, methods=['delete'])
    def eliminar_permanente(self, request, pk=None):
        """Eliminar permanentemente de la base de datos"""
        try:
            # ✅ ACCEDER DIRECTAMENTE SIN FILTROS
            cliente = Cliente.objects.get(pk=pk)
        except Cliente.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Cliente no encontrado'
            }, status=status.HTTP_404_NOT_FOUND)
        
        if not cliente.eliminado:
            return Response({
                'success': False,
                'message': 'Primero debes enviar el empleado a la papelera'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cliente.delete()
        
        return Response({
            'success': True,
            'message': 'Empleado eliminado permanentemente'
        })
    
    @action(detail=True, methods=['post'])
    def cambiar_password(self, request, pk=None):
        """Cambiar contraseña de empleado"""
        cliente = self.get_object()
        password_actual = request.data.get('password_actual')
        nueva_password = request.data.get('nueva_password')
        
        if not password_actual or not nueva_password:
            return Response({
                'success': False,
                'message': 'Se requiere la contraseña actual y la nueva'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if not check_password(password_actual, cliente.password):
            return Response({
                'success': False,
                'message': 'La contraseña actual es incorrecta'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        cliente.password = make_password(nueva_password)
        cliente.save()
        
        return Response({
            'success': True,
            'message': 'Contraseña actualizada correctamente'
        })

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

class SolicitudUpgradeViewSet(viewsets.ModelViewSet):
    queryset = SolicitudUpgrade.objects.all()
    serializer_class = SolicitudUpgradeSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        microempresa_id = self.request.query_params.get('microempresa', None)
        if microempresa_id:
            queryset = queryset.filter(microempresa_id=microempresa_id)
        return queryset
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
    @action(detail=True, methods=['post'])
    def aprobar(self, request, pk=None):
        solicitud = self.get_object()
        
        if solicitud.estado != 'pendiente':
            return Response({
                'success': False,
                'message': 'Esta solicitud ya fue procesada'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        solicitud.microempresa.plan = 'premium'
        solicitud.microempresa.save()
        
        solicitud.estado = 'aprobado'
        solicitud.fecha_revision = timezone.now()
        solicitud.comentario_admin = request.data.get('comentario', 'Solicitud aprobada')
        solicitud.save()
        
        return Response({
            'success': True,
            'message': 'Solicitud aprobada y plan actualizado a Premium'
        })
    
    @action(detail=True, methods=['post'])
    def rechazar(self, request, pk=None):
        solicitud = self.get_object()
        
        if solicitud.estado != 'pendiente':
            return Response({
                'success': False,
                'message': 'Esta solicitud ya fue procesada'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        solicitud.estado = 'rechazado'
        solicitud.fecha_revision = timezone.now()
        solicitud.comentario_admin = request.data.get('comentario', 'Solicitud rechazada')
        solicitud.save()
        
        return Response({
            'success': True,
            'message': 'Solicitud rechazada'
        })