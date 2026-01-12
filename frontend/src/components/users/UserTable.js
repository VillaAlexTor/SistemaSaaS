import React, { useState } from 'react';

// Tabla para mostrar los usuarios con búsqueda y filtros
function UserTable({ usuarios, editarUsuario, eliminarUsuario, cambiarEstado, rolUsuarioActual }) {
  // Estados para búsqueda y filtros
  const [busqueda, setBusqueda] = useState('');
  const [filtroRol, setFiltroRol] = useState('todos');
  const [filtroEstado, setFiltroEstado] = useState('todos');

  // Función para filtrar usuarios
  const usuariosFiltrados = usuarios.filter((user) => {
    // Filtro de búsqueda (nombre o email)
    const coincideBusqueda = 
      user.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      user.email.toLowerCase().includes(busqueda.toLowerCase());

    // Filtro de rol
    const coincideRol = filtroRol === 'todos' || user.rol === filtroRol;

    // Filtro de estado
    const coincideEstado = 
      filtroEstado === 'todos' ||
      (filtroEstado === 'activo' && user.activo) ||
      (filtroEstado === 'inactivo' && !user.activo);

    return coincideBusqueda && coincideRol && coincideEstado;
  });

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

  // Verificar si el usuario actual puede editar/eliminar
  const puedeEditar = rolUsuarioActual === 'administrador';
  const puedeEliminar = rolUsuarioActual === 'administrador';

  return (
    <div>
      {/* Barra de búsqueda y filtros */}
      <div style={{
        backgroundColor: '#1a1a1a',
        padding: '20px',
        borderRadius: '8px',
        marginBottom: '20px',
        border: '1px solid #444'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '15px' }}>
          
          {/* Buscador */}
          <div>
            <label style={{ display: 'block', color: '#ff9800', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
              🔍 Buscar por Nombre o Email
            </label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Escribe para buscar..."
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #444',
                borderRadius: '5px',
                backgroundColor: '#2d2d2d',
                color: '#fff',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Filtro por Rol */}
          <div>
            <label style={{ display: 'block', color: '#ff9800', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
              👥 Filtrar por Rol
            </label>
            <select
              value={filtroRol}
              onChange={(e) => setFiltroRol(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #444',
                borderRadius: '5px',
                backgroundColor: '#2d2d2d',
                color: '#fff',
                fontSize: '14px'
              }}
            >
              <option value="todos">Todos los roles</option>
              <option value="administrador">Administrador</option>
              <option value="cliente">Cliente</option>
              <option value="usuario">Usuario</option>
            </select>
          </div>

          {/* Filtro por Estado */}
          <div>
            <label style={{ display: 'block', color: '#ff9800', marginBottom: '5px', fontWeight: 'bold', fontSize: '13px' }}>
              ⚡ Filtrar por Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #444',
                borderRadius: '5px',
                backgroundColor: '#2d2d2d',
                color: '#fff',
                fontSize: '14px'
              }}
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Contador de resultados */}
        <div style={{ marginTop: '15px', color: '#aaa', fontSize: '13px' }}>
          Mostrando <strong style={{ color: '#ff9800' }}>{usuariosFiltrados.length}</strong> de <strong>{usuarios.length}</strong> usuarios
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ 
          width: '100%', 
          borderCollapse: 'collapse',
          backgroundColor: '#2d2d2d',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {/* Encabezado de la tabla */}
          <thead>
            <tr style={{ backgroundColor: '#1a1a1a' }}>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left',
                borderBottom: '2px solid #444',
                fontWeight: 'bold',
                color: '#ff9800'
              }}>
                Nombre
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left',
                borderBottom: '2px solid #444',
                fontWeight: 'bold',
                color: '#ff9800'
              }}>
                Email
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left',
                borderBottom: '2px solid #444',
                fontWeight: 'bold',
                color: '#ff9800'
              }}>
                Rol
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center',
                borderBottom: '2px solid #444',
                fontWeight: 'bold',
                color: '#ff9800'
              }}>
                Estado
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center',
                borderBottom: '2px solid #444',
                fontWeight: 'bold',
                color: '#ff9800'
              }}>
                Acciones
              </th>
            </tr>
          </thead>

          {/* Cuerpo de la tabla */}
          <tbody>
            {usuariosFiltrados.map((user) => (
              <tr key={user.id} style={{ borderBottom: '1px solid #444' }}>
                {/* Nombre */}
                <td style={{ padding: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      backgroundColor: '#ff9800',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '20px'
                    }}>
                      👤
                </div>
                <span style={{ fontWeight: 'bold', color: '#fff' }}>
                  {user.nombre}
                </span>
              </div>
            </td>

            {/* Email */}
            <td style={{ padding: '15px', color: '#aaa' }}>
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
                disabled={!puedeEditar}
                style={{
                  padding: '5px 15px',
                  borderRadius: '15px',
                  border: 'none',
                  cursor: puedeEditar ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold',
                  fontSize: '12px',
                  backgroundColor: user.activo ? '#4caf50' : '#f44336',
                  color: '#fff',
                  opacity: puedeEditar ? 1 : 0.5
                }}
              >
                {user.activo ? '✓ ACTIVO' : '✗ INACTIVO'}
              </button>
            </td>

            {/* Acciones */}
            <td style={{ padding: '15px', textAlign: 'center' }}>
              <button
                onClick={() => editarUsuario(user)}
                disabled={!puedeEditar}
                style={{
                  padding: '6px 12px',
                  backgroundColor: puedeEditar ? '#2196f3' : '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: puedeEditar ? 'pointer' : 'not-allowed',
                  marginRight: '5px',
                  fontSize: '13px'
                }}
              >
                ✏️ Editar
              </button>
              <button
                onClick={() => eliminarUsuario(user.id)}
                disabled={!puedeEliminar}
                style={{
                  padding: '6px 12px',
                  backgroundColor: puedeEliminar ? '#f44336' : '#666',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: puedeEliminar ? 'pointer' : 'not-allowed',
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

    {/* Mensaje si no hay resultados */}
    {usuariosFiltrados.length === 0 && (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#888',
        backgroundColor: '#2d2d2d'
      }}>
        <p style={{ fontSize: '18px' }}>😕 No se encontraron usuarios</p>
        <p style={{ fontSize: '14px', marginTop: '10px' }}>
          Intenta cambiar los filtros de búsqueda
        </p>
      </div>
    )}
  </div>
</div>
);
}
export default UserTable;