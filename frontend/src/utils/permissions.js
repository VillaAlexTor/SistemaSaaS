// Sistema de permisos por rol
// Este archivo define qué puede hacer cada tipo de usuario

// Permisos de cada rol
export const PERMISOS = {
  administrador: {
    nombre: 'Administrador',
    icono: '👑',
    color: '#9c27b0',
    puede: {
      verUsuarios: true,
      crearUsuarios: true,
      editarUsuarios: true,
      eliminarUsuarios: true,
      cambiarEstadoUsuarios: true,
      verProductos: true,
      crearProductos: true,
      editarProductos: true,
      eliminarProductos: true,
      verVentas: true,
      crearVentas: true,
      verReportes: true,
      configurarSistema: true
    }
  },
  cliente: {
    nombre: 'Cliente (Vendedor)',
    icono: '🏪',
    color: '#2196f3',
    puede: {
      verUsuarios: false,
      crearUsuarios: false,
      editarUsuarios: false,
      eliminarUsuarios: false,
      cambiarEstadoUsuarios: false,
      verProductos: true,
      crearProductos: true,
      editarProductos: true,
      eliminarProductos: false,
      verVentas: true,
      crearVentas: true,
      verReportes: true,
      configurarSistema: false
    }
  },
  usuario: {
    nombre: 'Usuario (Comprador)',
    icono: '🛒',
    color: '#ff9800',
    puede: {
      verUsuarios: false,
      crearUsuarios: false,
      editarUsuarios: false,
      eliminarUsuarios: false,
      cambiarEstadoUsuarios: false,
      verProductos: true,
      crearProductos: false,
      editarProductos: false,
      eliminarProductos: false,
      verVentas: true,
      crearVentas: true,
      verReportes: false,
      configurarSistema: false
    }
  }
};

// Función para verificar si un usuario tiene un permiso
export const tienePermiso = (rol, permiso) => {
  if (!PERMISOS[rol]) return false;
  return PERMISOS[rol].puede[permiso] || false;
};

// Función para obtener todos los permisos de un rol
export const obtenerPermisos = (rol) => {
  return PERMISOS[rol] || null;
};