from rest_framework import viewsets, status
from rest_framework.response import Response
from .models import Usuario
from .serializers import UsuarioSerializer
from sistema_ventas_api.utils import verify_recaptcha 

class UsuarioViewSet(viewsets.ModelViewSet):
    queryset = Usuario.objects.all()
    serializer_class = UsuarioSerializer
    
    def create(self, request, *args, **kwargs):
        # Verificar el captcha ANTES de crear el usuario
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
        
        # Si el captcha es válido, continuar con el registro normal
        return super().create(request, *args, **kwargs)