import React, { useState, useEffect } from 'react';

// Modal para crear o editar usuarios
function UserModal({ usuario, cerrarModal, guardarUsuario }) {
  // Datos del formulario
  const [datos, setDatos] = useState({
    nombre: '',
    email: '',
    rol: 'usuario',
    password: '',
    activo: true
  });

  // Cargar datos si es edición
  useEffect(() => {
    if (usuario) {
      setDatos({ ...usuario, password: '' });
    }
  }, [usuario]);

  // Cambiar datos del formulario
  const cambiarDato = (campo, valor) => {
    setDatos({ ...datos, [campo]: valor });
  };

  // Enviar formulario
  const enviar = (e) => {
    e.preventDefault();
    guardarUsuario(datos);
  };

  return (
    // Fondo oscuro del modal
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      {/* Contenedor del modal */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '30px',
        width: '500px',
        maxWidth: '90%',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        {/* Título */}
        <h2 style={{ 
          margin: '0 0 20px 0', 
          color: '#2e7d32',
          borderBottom: '3px solid #4caf50',
          paddingBottom: '10px'
        }}>
          {usuario ? '✏️ Editar Usuario' : '➕ Nuevo Usuario'}
        </h2>

        {/* Formulario */}
        <form onSubmit={enviar}>
          {/* Nombre */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Nombre Completo *
            </label>
            <input
              type="text"
              value={datos.nombre}
              onChange={(e) => cambiarDato('nombre', e.target.value)}
              placeholder="Ej: Juan Pérez"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Correo Electrónico *
            </label>
            <input
              type="email"
              value={datos.email}
              onChange={(e) => cambiarDato('email', e.target.value)}
              placeholder="ejemplo@correo.com"
              required
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Rol */}
          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Rol del Usuario *
            </label>
            <select
              value={datos.rol}
              onChange={(e) => cambiarDato('rol', e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            >
              <option value="administrador">👑 Administrador (Acceso Total)</option>
              <option value="cliente">🏪 Cliente (Vendedor)</option>
              <option value="usuario">🛒 Usuario (Comprador)</option>
            </select>
          </div>

          {/* Contraseña (solo para nuevos usuarios) */}
          {!usuario && (
            <div style={{ marginBottom: '15px' }}>
              <label style={{ 
                display: 'block', 
                marginBottom: '5px', 
                fontWeight: 'bold',
                color: '#333'
              }}>
                Contraseña *
              </label>
              <input
                type="password"
                value={datos.password}
                onChange={(e) => cambiarDato('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength="6"
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #ddd',
                  borderRadius: '5px',
                  fontSize: '14px'
                }}
              />
            </div>
          )}

          {/* Estado */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              fontWeight: 'bold',
              color: '#333'
            }}>
              Estado
            </label>
            <select
              value={datos.activo ? 'activo' : 'inactivo'}
              onChange={(e) => cambiarDato('activo', e.target.value === 'activo')}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            >
              <option value="activo">✓ Activo</option>
              <option value="inactivo">✗ Inactivo</option>
            </select>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={cerrarModal}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#ccc',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              {usuario ? 'Actualizar' : 'Crear'} Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserModal;