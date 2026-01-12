import React, { useState } from 'react';
import UserTable from '../users/UserTable';
import UserModal from '../users/UserModal';

// Dashboard principal del sistema
function Dashboard({ usuario, cerrarSesion }) {
  // Lista de usuarios (simulada)
  const [usuarios, setUsuarios] = useState([
    { id: 1, nombre: 'Admin Principal', email: 'admin@empresa.com', rol: 'administrador', activo: true },
    { id: 2, nombre: 'María García', email: 'maria@empresa.com', rol: 'cliente', activo: true },
    { id: 3, nombre: 'Carlos López', email: 'carlos@empresa.com', rol: 'usuario', activo: false },
  ]);

  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioEditar, setUsuarioEditar] = useState(null);

  // Agregar nuevo usuario
  const agregarUsuario = () => {
    setUsuarioEditar(null);
    setMostrarModal(true);
  };

  // Editar usuario existente
  const editarUsuario = (user) => {
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
    } else {
      // Agregar nuevo usuario
      setUsuarios([...usuarios, { ...datosUsuario, id: Date.now() }]);
    }
    setMostrarModal(false);
  };

  // Eliminar usuario
  const eliminarUsuario = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este usuario?')) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  // Cambiar estado del usuario (activo/inactivo)
  const cambiarEstado = (id) => {
    setUsuarios(usuarios.map(u => 
      u.id === id ? { ...u, activo: !u.activo } : u
    ));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Barra superior */}
      <div style={{ 
        backgroundColor: '#4caf50', 
        color: 'white', 
        padding: '15px 30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '30px' }}>🏪</div>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px' }}>Sistema de Ventas</h2>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
                Gestión de Inventarios
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 'bold' }}>Admin Principal</p>
              <p style={{ margin: 0, fontSize: '12px', opacity: 0.9 }}>
                {usuario}
              </p>
            </div>
            <button
              onClick={cerrarSesion}
              style={{
                padding: '8px 15px',
                backgroundColor: 'white',
                color: '#4caf50',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Salir
            </button>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px' }}>
        {/* Tarjeta de usuarios */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '10px',
          padding: '25px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          {/* Encabezado */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '25px',
            borderBottom: '3px solid #4caf50',
            paddingBottom: '15px'
          }}>
            <div>
              <h2 style={{ margin: 0, color: '#2e7d32', fontSize: '24px' }}>
                👥 Gestión de Usuarios
              </h2>
              <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '14px' }}>
                Administra los usuarios del sistema
              </p>
            </div>
            <button
              onClick={agregarUsuario}
              style={{
                padding: '10px 20px',
                backgroundColor: '#4caf50',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              ➕ Nuevo Usuario
            </button>
          </div>

          {/* Tabla de usuarios */}
          <UserTable
            usuarios={usuarios}
            editarUsuario={editarUsuario}
            eliminarUsuario={eliminarUsuario}
            cambiarEstado={cambiarEstado}
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
    </div>
  );
}

export default Dashboard;