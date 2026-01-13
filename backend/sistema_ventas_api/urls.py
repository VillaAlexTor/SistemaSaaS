from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from authentication.views import AdministradorViewSet, UsuarioInternoViewSet, NotificacionViewSet, LoginView
from microempresas.views import MicroempresaViewSet, ClienteViewSet, ProveedorViewSet, CompraViewSet, VentaViewSet, PlanViewSet
from productos.views import CategoriaViewSet, ProductoViewSet, InventarioMovimientoViewSet
from usuarios.views import UsuarioViewSet

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

# Productos
router.register(r'categorias', CategoriaViewSet)
router.register(r'productos', ProductoViewSet)
router.register(r'inventario-movimientos', InventarioMovimientoViewSet)

# Usuarios (compradores)
router.register(r'usuarios', UsuarioViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
]