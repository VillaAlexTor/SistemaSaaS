const API_URL = 'http://127.0.0.1:8000/api';

export const api = {
  // ==================== AUTENTICACIÓN ====================
  
  // Login unificado
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        return { success: false, message: data.message || 'Error en login' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error de conexión con el servidor. Verifica que Django esté corriendo en http://127.0.0.1:8000' };
    }
  },

  // ==================== USUARIOS (Compradores) ====================
  
  // Registrar usuario
  registerUsuario: async (datos) => {
    try {
      console.log('📤 Enviando datos al servidor:', datos);
      console.log('🌐 URL:', `${API_URL}/usuarios/`);
      
      const response = await fetch(`${API_URL}/usuarios/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
      });
      
      console.log('📥 Respuesta del servidor - Status:', response.status);
      
      const result = await response.json();
      console.log('📥 Respuesta del servidor - Data:', result);
      
      if (response.ok) {
        return { success: true, data: result };
      } else {
        // Intentar extraer mensajes de error específicos
        let errorMsg = 'Error al registrar usuario';
        
        if (result.email) {
          errorMsg = `Email: ${result.email[0]}`;
        } else if (result.password) {
          errorMsg = `Password: ${result.password[0]}`;
        } else if (result.detail) {
          errorMsg = result.detail;
        } else if (result.message) {
          errorMsg = result.message;
        }
        
        return { success: false, message: errorMsg, errors: result };
      }
    } catch (error) {
      console.error('❌ Error en registro de usuario:', error);
      console.error('❌ Tipo de error:', error.name);
      console.error('❌ Mensaje:', error.message);
      
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        return { 
          success: false, 
          message: '🔴 No se pudo conectar con el servidor. Asegúrate de que Django esté corriendo en http://127.0.0.1:8000' 
        };
      }
      
      return { 
        success: false, 
        message: `Error de conexión: ${error.message}` 
      };
    }
  },

  // Obtener todos los usuarios
  getUsuarios: async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios/`);
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // ==================== MICROEMPRESAS ====================
  
  // Registrar microempresa
  registerMicroempresa: async (datos) => {
    try {
      console.log('📤 Enviando datos de microempresa:', datos);
      
      const response = await fetch(`${API_URL}/microempresas/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
      });
      
      console.log('📥 Respuesta - Status:', response.status);
      
      const result = await response.json();
      console.log('📥 Respuesta - Data:', result);
      
      if (response.ok) {
        return { success: true, data: result };
      } else {
        let errorMsg = 'Error al registrar microempresa';
        
        if (result.email) {
          errorMsg = `Email: ${result.email[0]}`;
        } else if (result.nit) {
          errorMsg = `NIT: ${result.nit[0]}`;
        } else if (result.detail) {
          errorMsg = result.detail;
        }
        
        return { success: false, message: errorMsg, errors: result };
      }
    } catch (error) {
      console.error('❌ Error en registro de microempresa:', error);
      return { 
        success: false, 
        message: '🔴 No se pudo conectar con el servidor. Verifica que Django esté corriendo.' 
      };
    }
  },

  // Obtener todas las microempresas
  getMicroempresas: async () => {
    try {
      const response = await fetch(`${API_URL}/microempresas/`);
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error al obtener microempresas:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // ==================== PRODUCTOS ====================
  
  // Obtener productos (opcionalmente filtrados por microempresa)
  getProductos: async (microempresaId = null) => {
    try {
      const url = microempresaId 
        ? `${API_URL}/productos/?microempresa=${microempresaId}`
        : `${API_URL}/productos/`;
      
      const response = await fetch(url);
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Crear producto
  createProducto: async (datos) => {
    try {
      const response = await fetch(`${API_URL}/productos/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datos)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: 'Error al crear producto', errors: result };
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // ==================== CLIENTES ====================
  
  // Obtener clientes de una microempresa
  getClientes: async (microempresaId) => {
    try {
      const response = await fetch(`${API_URL}/clientes/?microempresa=${microempresaId}`);
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // ==================== CATEGORÍAS ====================
  
  // Obtener categorías de una microempresa
  getCategorias: async (microempresaId) => {
    try {
      const response = await fetch(`${API_URL}/categorias/?microempresa=${microempresaId}`);
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error al obtener categorías:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },
  // ==================== ADMINISTRACIÓN ====================

  // Obtener todas las microempresas (para admin)
  getAllMicroempresas: async () => {
    try {
      const response = await fetch(`${API_URL}/microempresas/`);
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error al obtener microempresas:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Actualizar estado de microempresa (activar/desactivar)
  updateMicroempresaEstado: async (id, activo) => {
    try {
      const response = await fetch(`${API_URL}/microempresas/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo })
      });
      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: 'Error al actualizar estado' };
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Eliminar microempresa
  deleteMicroempresa: async (id) => {
    try {
      const response = await fetch(`${API_URL}/microempresas/${id}/`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: 'Error al eliminar' };
      }
    } catch (error) {
      console.error('Error al eliminar microempresa:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Obtener todos los usuarios (para admin)
  getAllUsuarios: async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios/`);
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Actualizar estado de usuario
  updateUsuarioEstado: async (id, activo) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}/`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ activo })
      });
      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: 'Error al actualizar estado' };
      }
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Eliminar usuario
  deleteUsuario: async (id) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}/`, {
        method: 'DELETE'
      });
      if (response.ok) {
        return { success: true };
      } else {
        return { success: false, message: 'Error al eliminar' };
      }
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },
  // ==================== MICROEMPRESA - Dashboard ====================

  // Obtener estadísticas de la microempresa
  getEstadisticasMicroempresa: async (microempresaId) => {
    try {
      // Por ahora, obtener datos básicos de diferentes endpoints
      const [productos, ventas, clientes] = await Promise.all([
        fetch(`${API_URL}/productos/?microempresa=${microempresaId}`),
        fetch(`${API_URL}/ventas/?microempresa=${microempresaId}`),
        fetch(`${API_URL}/clientes/?microempresa=${microempresaId}`)
      ]);

      const productosData = await productos.json();
      const ventasData = await ventas.json();
      const clientesData = await clientes.json();

      return {
        success: true,
        data: {
          totalProductos: productosData.length || 0,
          totalVentas: ventasData.length || 0,
          totalClientes: clientesData.length || 0,
          productos: productosData || [],
          ventas: ventasData || [],
          clientes: clientesData || []
        }
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Obtener productos de una microempresa
  getProductosMicroempresa: async (microempresaId) => {
    try {
      const response = await fetch(`${API_URL}/productos/?microempresa=${microempresaId}`);
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error al obtener productos:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Obtener ventas de una microempresa
  getVentasMicroempresa: async (microempresaId) => {
    try {
      const response = await fetch(`${API_URL}/ventas/?microempresa=${microempresaId}`);
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error al obtener ventas:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Obtener clientes de una microempresa
  getClientesMicroempresa: async (microempresaId) => {
    try {
      const response = await fetch(`${API_URL}/clientes/?microempresa=${microempresaId}`);
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      return { success: false, message: 'Error de conexión' };
    }
  }
};
