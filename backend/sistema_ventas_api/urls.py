from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from authentication.views import AdministradorViewSet, UsuarioInternoViewSet, NotificacionViewSet, LoginView
from microempresas.views import MicroempresaViewSet, ClienteViewSet, ProveedorViewSet, CompraViewSet, VentaViewSet, PlanViewSet, SolicitudUpgradeViewSet
from productos.views import CategoriaViewSet, ProductoViewSet, InventarioMovimientoViewSet
from usuarios.views import UsuarioViewSet
from .views import solicitar_recuperacion, restablecer_password 

# Router para la API REST
router = DefaultRouter()

# Authentication
router.register(r'administradores', AdministradorViewSet)
router.register(r'usuarios-internos', UsuarioInternoViewSet)
router.register(r'notificaciones', NotificacionViewSet)
router.register(r'auth', LoginView, basename='auth')

# Microempresas
router.register(r'microempresas', MicroempresaViewSet)
router.register(r'clientes', ClienteViewSet)
router.register(r'proveedores', ProveedorViewSet)
router.register(r'compras', CompraViewSet)
router.register(r'ventas', VentaViewSet)
router.register(r'planes', PlanViewSet)
router.register(r'solicitudes-upgrade', SolicitudUpgradeViewSet)

# Productos
router.register(r'categorias', CategoriaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'inventario-movimientos', InventarioMovimientoViewSet)

# Usuarios (compradores)
router.register(r'usuarios', UsuarioViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/password/solicitar/', solicitar_recuperacion, name='solicitar_recuperacion'),  # ✅ Recuperación
    path('api/password/restablecer/', restablecer_password, name='restablecer_password'),  # ✅ Restablecer
]

from django.conf import settings
from django.conf.urls.static import static

# Servir archivos media en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)