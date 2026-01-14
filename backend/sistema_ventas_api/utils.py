import requests
from django.conf import settings

def verify_recaptcha(recaptcha_response):
    """
    Verifica el token de reCAPTCHA con Google
    
    Args:
        recaptcha_response (str): El token recibido del frontend
        
    Returns:
        bool: True si el captcha es válido, False en caso contrario
    """
    url = 'https://www.google.com/recaptcha/api/siteverify'
    
    data = {
        'secret': settings.RECAPTCHA_PRIVATE_KEY,
        'response': recaptcha_response
    }
    
    try:
        response = requests.post(url, data=data)
        result = response.json()
        
        return result.get('success', False)
    except Exception as e:
        print(f'Error al verificar reCAPTCHA: {e}')
        return False