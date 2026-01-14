from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from django.contrib.auth.hashers import make_password  
from usuarios.models import Usuario
from microempresas.models import Microempresa
from .email_utils import generar_token, enviar_email_recuperacion, validar_token

@api_view(['POST'])
def solicitar_recuperacion(request):
    """
    Endpoint para solicitar recuperación de contraseña
    Body: {
        "email": "usuario@email.com",
        "tipo": "usuario" o "microempresa"
    }
    """
    email = request.data.get('email')
    tipo = request.data.get('tipo', 'usuario')
    
    if not email:
        return Response({
            'success': False,
            'message': 'El email es requerido'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Buscar el usuario según el tipo
        if tipo == 'usuario':
            user = Usuario.objects.get(email=email)
        else:
            user = Microempresa.objects.get(email=email)
        
        # Generar token único
        token = generar_token()
        
        # Guardar el token y la fecha
        user.reset_password_token = token
        user.reset_password_token_created = timezone.now()
        user.save()
        
        # Enviar el correo
        email_enviado = enviar_email_recuperacion(email, token, tipo)
        
        if email_enviado:
            return Response({
                'success': True,
                'message': 'Correo de recuperación enviado exitosamente'
            })
        else:
            return Response({
                'success': False,
                'message': 'Error al enviar el correo'
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
    except (Usuario.DoesNotExist, Microempresa.DoesNotExist):
        # Por seguridad, no revelar si el email existe o no
        return Response({
            'success': True,
            'message': 'Si el correo existe, recibirás un enlace de recuperación'
        })

@api_view(['POST'])
def restablecer_password(request):
    """
    Endpoint para restablecer la contraseña
    Body: {
        "token": "el_token_del_email",
        "tipo": "usuario" o "microempresa",
        "nueva_password": "nueva123"
    }
    """
    token = request.data.get('token')
    tipo = request.data.get('tipo', 'usuario')
    nueva_password = request.data.get('nueva_password')
    
    if not all([token, nueva_password]):
        return Response({
            'success': False,
            'message': 'Token y nueva contraseña son requeridos'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Buscar el usuario por token
        if tipo == 'usuario':
            user = Usuario.objects.get(reset_password_token=token)
        else:
            user = Microempresa.objects.get(reset_password_token=token)
        
        # Validar que el token no haya expirado
        if not validar_token(token, user.reset_password_token_created):
            return Response({
                'success': False,
                'message': 'El token ha expirado. Solicita uno nuevo.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # ✅ CORRECCIÓN: Usar make_password() en lugar de bcrypt
        user.password = make_password(nueva_password)
        
        # Limpiar el token
        user.reset_password_token = None
        user.reset_password_token_created = None
        user.save()
        
        return Response({
            'success': True,
            'message': 'Contraseña restablecida exitosamente'
        })
        
    except (Usuario.DoesNotExist, Microempresa.DoesNotExist):
        return Response({
            'success': False,
            'message': 'Token inválido'
        }, status=status.HTTP_400_BAD_REQUEST)