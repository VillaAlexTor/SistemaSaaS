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
  },
  async solicitarRecuperacion(email, tipo) {
    try {
      const response = await fetch(`${API_URL}/password/solicitar/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, tipo })
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Error al conectar con el servidor' };
    }
  },

  async restablecerPassword(token, tipo, nueva_password) {
    try {
      const response = await fetch(`${API_URL}/password/restablecer/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, tipo, nueva_password })
      });
      return await response.json();
    } catch (error) {
      return { success: false, message: 'Error al conectar con el servidor' };
    }
  },
  // ==================== ADMINISTRACIÓN AVANZADA ====================
  // Actualizar microempresa completa
  updateMicroempresa: async (id, datos) => {
    try {
      const response = await fetch(`${API_URL}/microempresas/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: 'Error al actualizar', errors: result };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Actualizar usuario completo
  updateUsuario: async (id, datos) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: 'Error al actualizar', errors: result };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Obtener detalles de microempresa con productos
  getMicroempresaDetalle: async (id) => {
    try {
      const [micro, productos] = await Promise.all([
        fetch(`${API_URL}/microempresas/${id}/`),
        fetch(`${API_URL}/productos/?microempresa=${id}`)
      ]);
      
      const microData = await micro.json();
      const productosData = await productos.json();
      
      return { 
        success: true, 
        data: { 
          ...microData, 
          productos: productosData 
        } 
      };
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Cambiar plan de microempresa
  cambiarPlanMicroempresa: async (id, nuevoPlan) => {
    try {
      const response = await fetch(`${API_URL}/microempresas/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: nuevoPlan })
      });
      const result = await response.json();
      return response.ok ? { success: true, data: result } : { success: false };
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },
  // ==================== DETALLES DE MICROEMPRESA ====================

  // Obtener detalles completos de una microempresa
  getMicroempresaDetalleCompleto: async (id) => {
    try {
      const [micro, productos, ventas, clientes, proveedores] = await Promise.all([
        fetch(`${API_URL}/microempresas/${id}/`),
        fetch(`${API_URL}/productos/?microempresa=${id}`),
        fetch(`${API_URL}/ventas/?microempresa=${id}`),
        fetch(`${API_URL}/clientes/?microempresa=${id}`),
        fetch(`${API_URL}/proveedores/?microempresa=${id}`)
      ]);

      const microData = await micro.json();
      const productosData = await productos.json();
      const ventasData = await ventas.json();
      const clientesData = await clientes.json();
      const proveedoresData = await proveedores.json();

      return {
        success: true,
        data: {
          ...microData,
          productos: productosData,
          ventas: ventasData,
          clientes: clientesData,
          proveedores: proveedoresData
        }
      };
    } catch (error) {
      console.error('Error al obtener detalles:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },
  // ==================== REPORTES GLOBALES (ADMIN) ====================

  // Obtener reportes globales del sistema
  getReportesGlobales: async () => {
    try {
      const [microempresas, usuarios, productos, ventas] = await Promise.all([
        fetch(`${API_URL}/microempresas/`),
        fetch(`${API_URL}/usuarios/`),
        fetch(`${API_URL}/productos/`),
        fetch(`${API_URL}/ventas/`)
      ]);

      const microData = await microempresas.json();
      const usuariosData = await usuarios.json();
      const productosData = await productos.json();
      const ventasData = await ventas.json();

      return {
        success: true,
        data: {
          microempresas: microData,
          usuarios: usuariosData,
          productos: productosData,
          ventas: ventasData
        }
      };
    } catch (error) {
      console.error('Error al obtener reportes:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },
  // ==================== GESTIÓN DE PLANES ====================

  // Obtener todos los planes
  getPlanes: async () => {
    try {
      const response = await fetch(`${API_URL}/planes/`);
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error al obtener planes:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Actualizar un plan
  updatePlan: async (id, datos) => {
    try {
      const response = await fetch(`${API_URL}/planes/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: 'Error al actualizar plan', errors: result };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Crear un nuevo plan
  createPlan: async (datos) => {
    try {
      const response = await fetch(`${API_URL}/planes/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: 'Error al crear plan', errors: result };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },
  // ==================== CONFIGURACIÓN DE MICROEMPRESA ====================

  // Obtener información completa de la microempresa
  getMicroempresaInfo: async (id) => {
    try {
      const response = await fetch(`${API_URL}/microempresas/${id}/`);
      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: 'Error al obtener información' };
      }
    } catch (error) {
      console.error('Error al obtener info de microempresa:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Actualizar configuración de microempresa
  updateConfiguracionMicroempresa: async (id, datos) => {
    try {
      console.log(' Enviando PATCH a:', `${API_URL}/microempresas/${id}/`);
      console.log(' Datos a enviar:', datos);
      const response = await fetch(`${API_URL}/microempresas/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      
      const result = await response.json();
      
      console.log(' Respuesta del servidor:', result);
      console.log(' Status:', response.status);
      
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: 'Error al actualizar', errors: result };
      }
    } catch (error) {
      console.error(' Error de conexión:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Cambiar contraseña de microempresa
  cambiarPasswordMicroempresa: async (id, passwordActual, nuevaPassword) => {
    try {
      const response = await fetch(`${API_URL}/microempresas/${id}/cambiar-password/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          password_actual: passwordActual,
          nueva_password: nuevaPassword
        })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Solicitar cambio de plan
  solicitarCambioPlan: async (microempresaId, planDestino) => {
    try {
      const response = await fetch(`${API_URL}/microempresas/${microempresaId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: planDestino })
      });
      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: 'Error al cambiar plan' };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },
  // Cancelar suscripción Premium (bajar a plan básico) 
  cancelarSuscripcion: async (microempresaId) => {
    try {
      const response = await fetch(`${API_URL}/microempresas/${microempresaId}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: 'basico' })
      });
      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: 'Error al cancelar suscripción' };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },
  // ==================== GESTIÓN DE PERFIL DE USUARIO ====================

  // Obtener información del usuario
  getUsuarioInfo: async (id) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}/`);
      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: 'Error al obtener información' };
      }
    } catch (error) {
      console.error('Error al obtener info de usuario:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Actualizar perfil de usuario
  updatePerfilUsuario: async (id, datos) => {
    try {
      const response = await fetch(`${API_URL}/usuarios/${id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datos)
      });
      const result = await response.json();
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: 'Error al actualizar', errors: result };
      }
    } catch (error) {
      return { success: false, message: 'Error de conexión' };
    }
  },
  // ==================== SOLICITUDES DE UPGRADE ====================

  // Crear solicitud de upgrade con comprobante
  crearSolicitudUpgrade: async (microempresaId, archivoComprobante) => {
    try {
      const formData = new FormData();
      formData.append('microempresa', microempresaId);
      formData.append('comprobante', archivoComprobante);
      formData.append('monto', 29.00);

      const response = await fetch(`${API_URL}/solicitudes-upgrade/`, {
        method: 'POST',
        body: formData // NO enviar Content-Type, el navegador lo maneja automáticamente
      });

      const result = await response.json();
      
      if (response.ok) {
        return { success: true, data: result };
      } else {
        return { success: false, message: 'Error al crear solicitud', errors: result };
      }
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Obtener todas las solicitudes (para admin)
  getSolicitudesUpgrade: async () => {
    try {
      const response = await fetch(`${API_URL}/solicitudes-upgrade/`);
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Obtener solicitudes de una microempresa específica
  getSolicitudesMicroempresa: async (microempresaId) => {
    try {
      const response = await fetch(`${API_URL}/solicitudes-upgrade/?microempresa=${microempresaId}`);
      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('Error al obtener solicitudes:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Aprobar solicitud (admin)
  aprobarSolicitud: async (solicitudId, comentario = '') => {
    try {
      const response = await fetch(`${API_URL}/solicitudes-upgrade/${solicitudId}/aprobar/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comentario })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error al aprobar solicitud:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },

  // Rechazar solicitud (admin)
  rechazarSolicitud: async (solicitudId, comentario = '') => {
    try {
      const response = await fetch(`${API_URL}/solicitudes-upgrade/${solicitudId}/rechazar/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comentario })
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error al rechazar solicitud:', error);
      return { success: false, message: 'Error de conexión' };
    }
  },
};
