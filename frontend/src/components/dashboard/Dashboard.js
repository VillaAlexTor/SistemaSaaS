import React, { useState } from 'react';
import UserTable from '../users/UserTable';
import UserModal from '../users/UserModal';
import UserProfile from '../profile/UserProfile';
import PermissionsTable from '../permissions/PermissionsTable';
import { tienePermiso } from '../../utils/permissions';

// Dashboard principal del sistema
function Dashboard({ usuario, cerrarSesion }) {
  // Lista de usuarios (simulada)
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Admin Principal', email: 'admin@empresa.com', rol: 'administrador', activo: true },
    { id: 2, nombre: 'María García', email: 'maria@empresa.com', rol: 'cliente', activo: true },
    { id: 3, nombre: 'Carlos López', email: 'carlos@gmail.com', rol: 'usuario', activo: false },
    { id: 4, nombre: 'Ana Martínez', email: 'ana@empresa.com', rol: 'cliente', activo: true },
    { id: 5, nombre: 'Pedro Sánchez', email: 'pedro@gmail.com', rol: 'usuario', activo: true },
  ]);

  // Estados para los modales
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);
  const [mostrarPerfil, setMostrarPerfil] = useState(false);
  const [mostrarPermisos, setMostrarPermisos] = useState(false);

  // Verificar permisos del usuario actual
  const puedeCrearUsuarios = tienePermiso(usuario, 'crearUsuarios');
  const puedeEditarUsuarios = tienePermiso(usuario, 'editarUsuarios');
  const puedeEliminarUsuarios = tienePermiso(usuario, 'eliminarUsuarios');

  // Agregar nuevo usuario
  const agregarUsuario = () => {
    if (!puedeCrearUsuarios) {
      alert('No tienes permiso para crear usuarios');
      return;
    }
    setUsuarioEditar(null);
    setMostrarModal(true);
  };

  // Editar usuario existente
  const editarUsuario = (user) => {
    if (!puedeEditarUsuarios) {
      alert('No tienes permiso para editar usuarios');
      return;
    }
    setUsuarioEditar(user);
    setMostrarModal(true);
  };

  // Guardar usuario (nuevo o editado)
  const guardarUsuario = (datosUsuario) => {
    if (usuarioEditar) {
      // Actualizar usuario existente
      setUsuarios(usuarios.map(u => 
        u.id === usuarioEditar.id ? { ...datosUsuario, id: u.id } : u
      ));
      alert('Usuario actualizado correctamente');
    } else {
      // Agregar nuevo usuario
      setUsuarios([...usuarios, { ...datosUsuario, id: Date.now() }]);
      alert('Usuario creado correctamente');
    }
    setMostrarModal(false);
  };

  // Eliminar usuario
  const eliminarUsuario = (id) => {
    if (!puedeEliminarUsuarios) {
      alert('No tienes permiso para eliminar usuarios');
      return;
    }
    
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
      alert('Usuario eliminado correctamente');
    }
  };

  // Cambiar estado del usuario (activo/inactivo)
  const cambiarEstado = (id) => {
    if (!puedeEditarUsuarios) {
      alert('No tienes permiso para cambiar el estado de usuarios');
      return;
    }
    
    setUsuarios(usuarios.map(u => 
      u.id === id ? { ...u, activo: !u.activo } : u
    ));
  };

  // Actualizar perfil del usuario actual
  const actualizarPerfil = (datosPerfil) => {
    alert('Perfil actualizado correctamente');
    setMostrarPerfil(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      {/* Barra superior */}
      <div style={{ 
        backgroundColor: '#2d2d2d', 
        color: 'white', 
        padding: '15px 30px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
        borderBottom: '2px solid #ff9800'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1400px',
          margin: '0 auto'
        }}>
          {/* Logo y título */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '30px' }}>🏪</div>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#ff9800' }}>
                Sistema de Ventas
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>
                Gestión de Inventarios
              </p>
            </div>
          </div>

          {/* Menú de usuario */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {/* Botón Ver Permisos */}
            <button
              onClick={() => setMostrarPermisos(true)}
              style={{
                padding: '8px 15px',
                backgroundColor: '#444',
                color: '#ff9800',
                border: '2px solid #ff9800',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px'
              }}
            >
              🔐 Ver Permisos
            </button>

            {/* Info del usuario */}
            <div 
              onClick={() => setMostrarPerfil(true)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '10px',
                cursor: 'pointer',
                padding: '8px 15px',
                backgroundColor: '#3d3d3d',
                borderRadius: '8px',
                border: '1px solid #444'
              }}
            >
              <div style={{
                width: '35px',
                height: '35px',
                backgroundColor: '#ff9800',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px'
              }}>
                👤
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>
                  {usuario?.nombre || 'Admin Principal'}
                </p>
                <p style={{ margin: 0, fontSize: '11px', color: '#ff9800' }}>
                  {usuario?.rol || 'Administrador'}
                </p>
              </div>
            </div>

            {/* Botón cerrar sesión */}
            <button
              onClick={cerrarSesion}
              style={{
                padding: '8px 15px',
                backgroundColor: '#ff9800',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '13px',
                boxShadow: '0 2px 10px rgba(255,152,0,0.3)'
              }}
            >
              🚪 Salir
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px' }}>
        {/* Estadísticas rápidas */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '20px',
          marginBottom: '30px'
        }}>
          {/* Total usuarios */}
          <div style={{
            backgroundColor: '#2d2d2d',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #3d3d3d',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Total Usuarios</p>
                <h2 style={{ margin: '5px 0', color: '#ff9800', fontSize: '32px' }}>
                  {usuarios.length}
                </h2>
              </div>
              <div style={{ fontSize: '40px' }}>👥</div>
            </div>
          </div>

          {/* Usuarios activos */}
          <div style={{
            backgroundColor: '#2d2d2d',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #3d3d3d',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Usuarios Activos</p>
                <h2 style={{ margin: '5px 0', color: '#4caf50', fontSize: '32px' }}>
                  {usuarios.filter(u => u.activo).length}
                </h2>
              </div>
              <div style={{ fontSize: '40px' }}>✅</div>
            </div>
          </div>

          {/* Usuarios inactivos */}
          <div style={{
            backgroundColor: '#2d2d2d',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #3d3d3d',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Usuarios Inactivos</p>
                <h2 style={{ margin: '5px 0', color: '#f44336', fontSize: '32px' }}>
                  {usuarios.filter(u => !u.activo).length}
                </h2>
              </div>
              <div style={{ fontSize: '40px' }}>❌</div>
            </div>
          </div>

          {/* Rol del usuario actual */}
          <div style={{
            backgroundColor: '#2d2d2d',
            padding: '20px',
            borderRadius: '10px',
            border: '1px solid #3d3d3d',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Tu Rol</p>
                <h2 style={{ margin: '5px 0', color: '#ff9800', fontSize: '20px', textTransform: 'capitalize' }}>
                  {usuario?.rol === 'superadmin' && '👑 Administrador'}
                  {usuario?.rol === 'cliente' && '🏪 Cliente'}
                  {usuario?.rol === 'usuario' && '🛒 Usuario'}
                  {!usuario?.rol && '👑 Administrador'}
                </h2>
              </div>
              <div style={{ fontSize: '40px' }}>🎭</div>
            </div>
          </div>
        </div>

        {/* Tarjeta de gestión de usuarios */}
        <div style={{ 
          backgroundColor: '#2d2d2d', 
          borderRadius: '10px',
          padding: '25px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
          border: '1px solid #3d3d3d'
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
            <div>
              <h2 style={{ margin: 0, color: '#ff9800', fontSize: '24px' }}>
                👥 Gestión de Usuarios
              </h2>
              <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '14px' }}>
                Administra los usuarios del sistema
              </p>
            </div>
            <button
              onClick={agregarUsuario}
              disabled={!puedeCrearUsuarios}
              style={{
                padding: '10px 20px',
                backgroundColor: puedeCrearUsuarios ? '#ff9800' : '#666',
                color: puedeCrearUsuarios ? '#000' : '#aaa',
                border: 'none',
                borderRadius: '5px',
                cursor: puedeCrearUsuarios ? 'pointer' : 'not-allowed',
                fontWeight: 'bold',
                fontSize: '14px',
                boxShadow: puedeCrearUsuarios ? '0 2px 10px rgba(255,152,0,0.3)' : 'none'
              }}
            >
              ➕ Nuevo Usuario
            </button>
          </div>

          {/* Tabla de usuarios con búsqueda y filtros */}
          <UserTable
            usuarios={usuarios}
            editarUsuario={editarUsuario}
            eliminarUsuario={eliminarUsuario}
            cambiarEstado={cambiarEstado}
            rolUsuarioActual={usuario}
          />
        </div>
      </div>

      {/* Modal para crear/editar usuario */}
      {mostrarModal && (
        <UserModal
          usuario={usuarioEditar}
          cerrarModal={() => setMostrarModal(false)}
          guardarUsuario={guardarUsuario}
        />
      )}

      {/* Modal de perfil de usuario */}
      {mostrarPerfil && (
        <UserProfile
          usuario={usuario}
          cerrarPerfil={() => setMostrarPerfil(false)}
          actualizarPerfil={actualizarPerfil}
        />
      )}

      {/* Modal de tabla de permisos */}
      {mostrarPermisos && (
        <PermissionsTable
          cerrar={() => setMostrarPermisos(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;