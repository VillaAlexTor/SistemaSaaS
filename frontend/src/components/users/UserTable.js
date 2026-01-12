import React from 'react';

// Tabla para mostrar los usuarios
function UserTable({ usuarios, editarUsuario, eliminarUsuario, cambiarEstado }) {
  
  // Función para obtener el color según el rol
  const obtenerColorRol = (rol) => {
    if (rol === 'administrador') return '#9c27b0';
    if (rol === 'cliente') return '#2196f3';
    return '#ff9800';
  };

  // Función para obtener el icono según el rol
  const obtenerIconoRol = (rol) => {
    if (rol === 'administrador') return '👑';
    if (rol === 'cliente') return '🏪';
    return '🛒';
  };

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ 
        width: '100%', 
        borderCollapse: 'collapse',
        backgroundColor: 'white'
      }}>
        {/* Encabezado de la tabla */}
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ 
              padding: '12px', 
              textAlign: 'left',
              borderBottom: '2px solid #ddd',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Nombre
            </th>
            <th style={{ 
              padding: '12px', 
              textAlign: 'left',
              borderBottom: '2px solid #ddd',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Email
            </th>
            <th style={{ 
              padding: '12px', 
              textAlign: 'left',
              borderBottom: '2px solid #ddd',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Rol
            </th>
            <th style={{ 
              padding: '12px', 
              textAlign: 'center',
              borderBottom: '2px solid #ddd',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Estado
            </th>
            <th style={{ 
              padding: '12px', 
              textAlign: 'center',
              borderBottom: '2px solid #ddd',
              fontWeight: 'bold',
              color: '#333'
            }}>
              Acciones
            </th>
          </tr>
        </thead>

        {/* Cuerpo de la tabla */}
        <tbody>
          {usuarios.map((user) => (
            <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
              {/* Nombre */}
              <td style={{ padding: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: '#e3f2fd',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    👤
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#333' }}>
                    {user.nombre}
                  </span>
                </div>
              </td>

              {/* Email */}
              <td style={{ padding: '15px', color: '#666' }}>
                {user.email}
              </td>

              {/* Rol */}
              <td style={{ padding: '15px' }}>
                <span style={{
                  display: 'inline-block',
                  padding: '5px 12px',
                  borderRadius: '15px',
                  backgroundColor: obtenerColorRol(user.rol),
                  color: 'white',
                  fontSize: '13px',
                  fontWeight: 'bold'
                }}>
                  {obtenerIconoRol(user.rol)} {user.rol.toUpperCase()}
                </span>
              </td>

              {/* Estado */}
              <td style={{ padding: '15px', textAlign: 'center' }}>
                <button
                  onClick={() => cambiarEstado(user.id)}
                  style={{
                    padding: '5px 15px',
                    borderRadius: '15px',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    backgroundColor: user.activo ? '#c8e6c9' : '#ffcdd2',
                    color: user.activo ? '#2e7d32' : '#c62828'
                  }}
                >
                  {user.activo ? '✓ ACTIVO' : '✗ INACTIVO'}
                </button>
              </td>

              {/* Acciones */}
              <td style={{ padding: '15px', textAlign: 'center' }}>
                <button
                  onClick={() => editarUsuario(user)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#2196f3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '5px',
                    fontSize: '13px'
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => eliminarUsuario(user.id)}
                  style={{
                    padding: '6px 12px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mensaje si no hay usuarios */}
      {usuarios.length === 0 && (
        <div style={{ 
          textAlign: 'center', 
          padding: '40px',
          color: '#999'
        }}>
          <p style={{ fontSize: '18px' }}>😕 No hay usuarios registrados</p>
        </div>
      )}
    </div>
  );
}

export default UserTable;