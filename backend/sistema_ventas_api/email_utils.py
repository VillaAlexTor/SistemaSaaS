import secrets
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone  # ✅ Importar timezone de Django

def generar_token():
    """Genera un token único de 32 caracteres"""
    return secrets.token_urlsafe(32)

def enviar_email_recuperacion(email, token, tipo_usuario='usuario'):
    """
    Envía el correo de recuperación de contraseña
    
    Args:
        email (str): Email del destinatario
        token (str): Token de recuperación
        tipo_usuario (str): 'usuario' o 'microempresa'
    """
    # URL del frontend donde el usuario ingresará la nueva contraseña
    reset_url = f"http://localhost:3000/reset-password?token={token}&tipo={tipo_usuario}"
    
    subject = '🔐 Recuperación de Contraseña - Sistema de Ventas'
    
    message = f"""
Hola,

Has solicitado recuperar tu contraseña en el Sistema de Ventas.

Para crear una nueva contraseña, haz clic en el siguiente enlace:

{reset_url}

Este enlace es válido por 1 hora.

Si no solicitaste este cambio, puedes ignorar este correo.

---
Equipo de Sistema de Ventas
    """
    
    html_message = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4;">
        <div style="background-color: #2d2d2d; padding: 30px; border-radius: 10px; border: 2px solid #ff9800;">
            <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #ff9800; font-size: 28px;">🔐 Recuperación de Contraseña</h1>
            </div>
            
            <p style="color: #fff; font-size: 16px; line-height: 1.6;">
                Hola,
            </p>
            
            <p style="color: #aaa; font-size: 14px; line-height: 1.6;">
                Has solicitado recuperar tu contraseña en el Sistema de Ventas.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="{reset_url}" 
                   style="display: inline-block; padding: 15px 30px; background-color: #ff9800; 
                          color: #000; text-decoration: none; border-radius: 8px; font-weight: bold;
                          font-size: 16px;">
                    Restablecer Contraseña
                </a>
            </div>
            
            <p style="color: #aaa; font-size: 13px; line-height: 1.6;">
                Este enlace es válido por <strong style="color: #ff9800;">1 hora</strong>.
            </p>
            
            <p style="color: #aaa; font-size: 13px; line-height: 1.6;">
                Si no solicitaste este cambio, puedes ignorar este correo de forma segura.
            </p>
            
            <hr style="border: 1px solid #444; margin: 30px 0;">
            
            <p style="color: #666; font-size: 12px; text-align: center;">
                Equipo de Sistema de Ventas
            </p>
        </div>
    </div>
    """
    
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[email],
            html_message=html_message,
            fail_silently=False,
        )
        return True
    except Exception as e:
        print(f'❌ Error al enviar email: {e}')
        return False

def validar_token(token, fecha_creacion):
    """
    Valida si el token aún es válido (1 hora)
    """
    if not token or not fecha_creacion:
        return False
    
    # El token expira en 1 hora
    expiracion = fecha_creacion + timedelta(hours=1)
    return timezone.now() < expiracion  # ✅ CORRECTO: usar timezone.now()