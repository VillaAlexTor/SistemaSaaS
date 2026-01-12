import React from 'react';
import { PERMISOS } from '../../utils/permissions';

// Componente para mostrar la tabla de permisos
function PermissionsTable({ cerrar }) {
  // Lista de todos los permisos disponibles
  const listaPermisos = [
    { key: 'verUsuarios', nombre: 'Ver Usuarios' },
    { key: 'crearUsuarios', nombre: 'Crear Usuarios' },
    { key: 'editarUsuarios', nombre: 'Editar Usuarios' },
    { key: 'eliminarUsuarios', nombre: 'Eliminar Usuarios' },
    { key: 'cambiarEstadoUsuarios', nombre: 'Activar/Desactivar Usuarios' },
    { key: 'verProductos', nombre: 'Ver Productos' },
    { key: 'crearProductos', nombre: 'Crear Productos' },
    { key: 'editarProductos', nombre: 'Editar Productos' },
    { key: 'eliminarProductos', nombre: 'Eliminar Productos' },
    { key: 'verVentas', nombre: 'Ver Ventas' },
    { key: 'crearVentas', nombre: 'Crear Ventas' },
    { key: 'verReportes', nombre: 'Ver Reportes' },
    { key: 'configurarSistema', nombre: 'Configurar Sistema' }
  ];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#2d2d2d',
        borderRadius: '10px',
        padding: '30px',
        maxWidth: '900px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '2px solid #ff9800'
      }}>
        {/* Encabezado */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '25px',
          borderBottom: '3px solid #ff9800',
          paddingBottom: '15px'
        }}>
          <h2 style={{ margin: 0, color: '#ff9800', fontSize: '28px' }}>
            🔐 Tabla de Permisos por Rol
          </h2>
          <button
            onClick={cerrar}
            style={{
              backgroundColor: '#444',
              color: '#fff',
              border: 'none',
              padding: '8px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            ✖ Cerrar
          </button>
        </div>

        {/* Descripción */}
        <p style={{ color: '#aaa', marginBottom: '20px', fontSize: '14px' }}>
          Esta tabla muestra qué acciones puede realizar cada tipo de usuario en el sistema.
        </p>

        {/* Tabla de permisos */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1a1a' }}>
                <th style={{
                  padding: '15px',
                  textAlign: 'left',
                  color: '#ff9800',
                  fontWeight: 'bold',
                  border: '1px solid #444'
                }}>
                  Permiso
                </th>
                {Object.keys(PERMISOS).map((rol) => (
                  <th key={rol} style={{
                    padding: '15px',
                    textAlign: 'center',
                    color: PERMISOS[rol].color,
                    fontWeight: 'bold',
                    border: '1px solid #444'
                  }}>
                    {PERMISOS[rol].icono} {PERMISOS[rol].nombre}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {listaPermisos.map((permiso) => (
                <tr key={permiso.key} style={{ backgroundColor: '#2d2d2d' }}>
                  <td style={{
                    padding: '12px',
                    color: '#fff',
                    border: '1px solid #444'
                  }}>
                    {permiso.nombre}
                  </td>
                  {Object.keys(PERMISOS).map((rol) => (
                    <td key={rol} style={{
                      padding: '12px',
                      textAlign: 'center',
                      border: '1px solid #444'
                    }}>
                      {PERMISOS[rol].puede[permiso.key] ? (
                        <span style={{ color: '#4caf50', fontSize: '20px' }}>✓</span>
                      ) : (
                        <span style={{ color: '#f44336', fontSize: '20px' }}>✗</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Leyenda */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#1a1a1a',
          borderRadius: '5px',
          border: '1px solid #444'
        }}>
          <p style={{ color: '#fff', fontWeight: 'bold', marginBottom: '10px' }}>
            Leyenda:
          </p>
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#4caf50', fontSize: '20px' }}>✓</span>
              <span style={{ color: '#aaa', fontSize: '14px' }}>= Tiene permiso</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ color: '#f44336', fontSize: '20px' }}>✗</span>
              <span style={{ color: '#aaa', fontSize: '14px' }}>= No tiene permiso</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PermissionsTable;