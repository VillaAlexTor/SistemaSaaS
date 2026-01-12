import React, { useState } from 'react';

// Componente para ver y editar el perfil del usuario
function UserProfile({ usuario, cerrarPerfil, actualizarPerfil }) {
  // Datos del perfil
  const [datos, setDatos] = useState({
    nombre: 'Admin Principal',
    email: 'admin@empresa.com',
    telefono: '+591 12345678',
    rol: usuario
  });

  // Estados para cambiar contraseña
  const [mostrarCambiarPass, setMostrarCambiarPass] = useState(false);
  const [passwords, setPasswords] = useState({
    actual: '',
    nueva: '',
    confirmar: ''
  });

  // Historial de actividad simulado
  const [historial] = useState([
    { id: 1, accion: 'Inicio de sesión', fecha: '12/01/2026 10:30 AM' },
    { id: 2, accion: 'Creó usuario: María García', fecha: '12/01/2026 11:15 AM' },
    { id: 3, accion: 'Editó usuario: Carlos López', fecha: '12/01/2026 02:45 PM' },
    { id: 4, accion: 'Eliminó usuario: Pedro Pérez', fecha: '11/01/2026 04:20 PM' },
    { id: 5, accion: 'Cambió contraseña', fecha: '10/01/2026 09:00 AM' }
  ]);

  // Función para guardar cambios del perfil
  const guardarPerfil = (e) => {
    e.preventDefault();
    alert('Perfil actualizado correctamente');
    actualizarPerfil(datos);
  };

  // Función para cambiar contraseña
  const cambiarPassword = (e) => {
    e.preventDefault();
    
    // Validar que la contraseña nueva y confirmación coincidan
    if (passwords.nueva !== passwords.confirmar) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud
    if (passwords.nueva.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    alert('Contraseña cambiada exitosamente');
    setMostrarCambiarPass(false);
    setPasswords({ actual: '', nueva: '', confirmar: '' });
  };

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
      overflow: 'auto',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#2d2d2d',
        borderRadius: '10px',
        padding: '30px',
        width: '800px',
        maxWidth: '100%',
        border: '2px solid #ff9800',
        maxHeight: '90vh',
        overflow: 'auto'
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
            👤 Mi Perfil
          </h2>
          <button
            onClick={cerrarPerfil}
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

        {/* Contenido en dos columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          
          {/* COLUMNA 1: Datos del perfil */}
          <div>
            <h3 style={{ color: '#ff9800', marginBottom: '15px' }}>
              📝 Datos Personales
            </h3>
            
            <form onSubmit={guardarPerfil}>
              {/* Nombre */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontWeight: 'bold' }}>
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={datos.nombre}
                  onChange={(e) => setDatos({...datos, nombre: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #444',
                    borderRadius: '5px',
                    backgroundColor: '#1a1a1a',
                    color: '#fff'
                  }}
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontWeight: 'bold' }}>
                  Email
                </label>
                <input
                  type="email"
                  value={datos.email}
                  onChange={(e) => setDatos({...datos, email: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #444',
                    borderRadius: '5px',
                    backgroundColor: '#1a1a1a',
                    color: '#fff'
                  }}
                />
              </div>

              {/* Teléfono */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontWeight: 'bold' }}>
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={datos.telefono}
                  onChange={(e) => setDatos({...datos, telefono: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #444',
                    borderRadius: '5px',
                    backgroundColor: '#1a1a1a',
                    color: '#fff'
                  }}
                />
              </div>

              {/* Rol (solo lectura) */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontWeight: 'bold' }}>
                  Rol
                </label>
                <input
                  type="text"
                  value={datos.rol}
                  disabled
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '2px solid #444',
                    borderRadius: '5px',
                    backgroundColor: '#1a1a1a',
                    color: '#888'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#ff9800',
                  color: '#000',
                  border: 'none',
                  borderRadius: '5px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                💾 Guardar Cambios
              </button>
            </form>

            {/* Botón cambiar contraseña */}
            <button
              onClick={() => setMostrarCambiarPass(!mostrarCambiarPass)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#444',
                color: '#fff',
                border: '2px solid #ff9800',
                borderRadius: '5px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginTop: '15px'
              }}
            >
              🔑 Cambiar Contraseña
            </button>

            {/* Formulario cambiar contraseña */}
            {mostrarCambiarPass && (
              <form onSubmit={cambiarPassword} style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1a1a1a', borderRadius: '5px', border: '1px solid #444' }}>
                <h4 style={{ color: '#ff9800', marginBottom: '15px' }}>Cambiar Contraseña</h4>
                
                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '13px' }}>
                    Contraseña Actual
                  </label>
                  <input
                    type="password"
                    value={passwords.actual}
                    onChange={(e) => setPasswords({...passwords, actual: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #444',
                      borderRadius: '5px',
                      backgroundColor: '#2d2d2d',
                      color: '#fff'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '13px' }}>
                    Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={passwords.nueva}
                    onChange={(e) => setPasswords({...passwords, nueva: e.target.value})}
                    required
                    minLength="6"
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #444',
                      borderRadius: '5px',
                      backgroundColor: '#2d2d2d',
                      color: '#fff'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '10px' }}>
                  <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '13px' }}>
                    Confirmar Nueva Contraseña
                  </label>
                  <input
                    type="password"
                    value={passwords.confirmar}
                    onChange={(e) => setPasswords({...passwords, confirmar: e.target.value})}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      border: '1px solid #444',
                      borderRadius: '5px',
                      backgroundColor: '#2d2d2d',
                      color: '#fff'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#ff9800',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  ✓ Confirmar Cambio
                </button>
              </form>
            )}
          </div>

          {/* COLUMNA 2: Historial de actividad */}
          <div>
            <h3 style={{ color: '#ff9800', marginBottom: '15px' }}>
              📜 Historial de Actividad
            </h3>
            
            <div style={{
              backgroundColor: '#1a1a1a',
              borderRadius: '5px',
              padding: '15px',
              maxHeight: '500px',
              overflow: 'auto',
              border: '1px solid #444'
            }}>
              {historial.map((item) => (
                <div
                  key={item.id}
                  style={{
                    padding: '12px',
                    marginBottom: '10px',
                    backgroundColor: '#2d2d2d',
                    borderRadius: '5px',
                    borderLeft: '4px solid #ff9800'
                  }}
                >
                  <p style={{ margin: 0, color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                    {item.accion}
                  </p>
                  <p style={{ margin: '5px 0 0 0', color: '#888', fontSize: '12px' }}>
                    🕐 {item.fecha}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;