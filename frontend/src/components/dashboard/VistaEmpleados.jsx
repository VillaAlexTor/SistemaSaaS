import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

function VistaEmpleados({ microempresaId }) {
  const [empleados, setEmpleados] = useState([]);
  const [empleadosEliminados, setEmpleadosEliminados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [vistaActual, setVistaActual] = useState('activos');
  const [modalNuevo, setModalNuevo] = useState(false);
  const [modalEditar, setModalEditar] = useState(null);

  useEffect(() => {
    cargarEmpleados();
  }, [vistaActual]);

  const cargarEmpleados = async () => {
    setCargando(true);
    
    if (vistaActual === 'activos') {
      const resultado = await api.getEmpleados(microempresaId, false);
      if (resultado.success) {
        setEmpleados(resultado.data);
      }
    } else {
      const resultado = await api.getEmpleados(microempresaId, true);
      if (resultado.success) {
        setEmpleadosEliminados(resultado.data);
      }
    }
    
    setCargando(false);
  };

  const eliminarEmpleado = async (id) => {
    if (!window.confirm('¿Enviar este empleado a la papelera?')) return;
    
    const resultado = await api.softDeleteEmpleado(id);
    if (resultado.success) {
      alert('✅ Empleado enviado a la papelera');
      cargarEmpleados();
    } else {
      alert('❌ ' + resultado.message);
    }
  };

  const restaurarEmpleado = async (id) => {
    if (!window.confirm('¿Restaurar este empleado?')) return;
    
    const resultado = await api.restaurarEmpleado(id);
    if (resultado.success) {
      alert('✅ Empleado restaurado');
      cargarEmpleados();
    } else {
      alert('❌ ' + resultado.message);
    }
  };

  const eliminarPermanente = async (id) => {
    if (!window.confirm('⚠️ ¿ELIMINAR PERMANENTEMENTE? Esta acción no se puede deshacer.')) return;
    
    const resultado = await api.eliminarEmpleadoPermanente(id);
    if (resultado.success) {
      alert('✅ Empleado eliminado permanentemente');
      cargarEmpleados();
    } else {
      alert('❌ ' + resultado.message);
    }
  };

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
        <p style={{ color: '#2196f3', fontSize: '18px' }}>Cargando empleados...</p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: '#2196f3', margin: 0, fontSize: '28px' }}>
          👥 Gestión de Empleados
        </h2>
        <button
          onClick={() => setModalNuevo(true)}
          style={{
            padding: '12px 25px',
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(76,175,80,0.3)'
          }}
        >
          ➕ Nuevo Empleado
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => setVistaActual('activos')}
          style={{
            padding: '12px 25px',
            backgroundColor: vistaActual === 'activos' ? '#2196f3' : '#2d2d2d',
            color: '#fff',
            border: vistaActual === 'activos' ? '2px solid #2196f3' : '1px solid #3d3d3d',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          👥 Empleados Activos ({empleados.length})
        </button>
        <button
          onClick={() => setVistaActual('papelera')}
          style={{
            padding: '12px 25px',
            backgroundColor: vistaActual === 'papelera' ? '#f44336' : '#2d2d2d',
            color: '#fff',
            border: vistaActual === 'papelera' ? '2px solid #f44336' : '1px solid #3d3d3d',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🗑️ Papelera ({empleadosEliminados.length})
        </button>
      </div>

      {vistaActual === 'activos' ? (
        <TablaEmpleados 
          empleados={empleados} 
          onEditar={setModalEditar}
          onEliminar={eliminarEmpleado}
        />
      ) : (
        <TablaPapelera 
          empleados={empleadosEliminados}
          onRestaurar={restaurarEmpleado}
          onEliminarPermanente={eliminarPermanente}
        />
      )}

      {modalNuevo && (
        <ModalNuevoEmpleado 
          microempresaId={microempresaId}
          cerrar={() => setModalNuevo(false)}
          onExito={cargarEmpleados}
        />
      )}

      {modalEditar && (
        <ModalEditarEmpleado 
          empleado={modalEditar}
          cerrar={() => setModalEditar(null)}
          onExito={cargarEmpleados}
        />
      )}
    </div>
  );
}

// ============================================
// TABLA DE EMPLEADOS ACTIVOS
// ============================================

function TablaEmpleados({ empleados, onEditar, onEliminar }) {
  if (empleados.length === 0) {
    return (
      <div style={{
        backgroundColor: '#2d2d2d',
        borderRadius: '10px',
        padding: '60px',
        textAlign: 'center',
        border: '1px solid #3d3d3d'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.3 }}>👥</div>
        <p style={{ color: '#aaa', fontSize: '18px', margin: 0 }}>
          No hay empleados registrados
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#2d2d2d',
      borderRadius: '10px',
      padding: '20px',
      border: '1px solid #3d3d3d'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #2196f3' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#2196f3', fontSize: '13px' }}>Nombre</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#2196f3', fontSize: '13px' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#2196f3', fontSize: '13px' }}>Teléfono</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#2196f3', fontSize: '13px' }}>CI/NIT</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#2196f3', fontSize: '13px' }}>Estado</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#2196f3', fontSize: '13px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(emp => (
            <tr key={emp.id} style={{ borderBottom: '1px solid #3d3d3d' }}>
              <td style={{ padding: '12px', color: '#fff', fontSize: '14px' }}>
                {emp.nombre} {emp.apellido}
              </td>
              <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>{emp.email}</td>
              <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>{emp.telefono}</td>
              <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>{emp.ci_nit || '-'}</td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <span style={{
                  padding: '5px 12px',
                  borderRadius: '15px',
                  backgroundColor: emp.activo ? '#1b4d1b' : '#4d1f1f',
                  color: emp.activo ? '#4caf50' : '#f44336',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}>
                  {emp.activo ? '✅ Activo' : '❌ Inactivo'}
                </span>
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    onClick={() => onEditar(emp)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#2196f3',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    onClick={() => onEliminar(emp.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#ff9800',
                      color: '#000',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    🗑️ Papelera
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// TABLA DE PAPELERA
// ============================================

function TablaPapelera({ empleados, onRestaurar, onEliminarPermanente }) {
  if (empleados.length === 0) {
    return (
      <div style={{
        backgroundColor: '#2d2d2d',
        borderRadius: '10px',
        padding: '60px',
        textAlign: 'center',
        border: '1px solid #3d3d3d'
      }}>
        <div style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.3 }}>✅</div>
        <p style={{ color: '#aaa', fontSize: '18px', margin: 0 }}>
          La papelera está vacía
        </p>
      </div>
    );
  }

  return (
    <div style={{
      backgroundColor: '#2d2d2d',
      borderRadius: '10px',
      padding: '20px',
      border: '2px solid #f44336'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #f44336' }}>
            <th style={{ padding: '12px', textAlign: 'left', color: '#f44336', fontSize: '13px' }}>Nombre</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#f44336', fontSize: '13px' }}>Email</th>
            <th style={{ padding: '12px', textAlign: 'left', color: '#f44336', fontSize: '13px' }}>Eliminado</th>
            <th style={{ padding: '12px', textAlign: 'center', color: '#f44336', fontSize: '13px' }}>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {empleados.map(emp => (
            <tr key={emp.id} style={{ borderBottom: '1px solid #3d3d3d' }}>
              <td style={{ padding: '12px', color: '#fff', fontSize: '14px' }}>
                {emp.nombre} {emp.apellido}
              </td>
              <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>{emp.email}</td>
              <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>
                {new Date(emp.fecha_eliminacion).toLocaleDateString('es-BO')}
              </td>
              <td style={{ padding: '12px', textAlign: 'center' }}>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  <button
                    onClick={() => onRestaurar(emp.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#4caf50',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    ♻️ Restaurar
                  </button>
                  <button
                    onClick={() => onEliminarPermanente(emp.id)}
                    style={{
                      padding: '6px 12px',
                      backgroundColor: '#f44336',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    ❌ Eliminar
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================
// MODAL: NUEVO EMPLEADO
// ============================================

function ModalNuevoEmpleado({ microempresaId, cerrar, onExito }) {
  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    telefono: '',
    ci_nit: '',
    direccion: ''
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!datos.email || !datos.password) {
      setError('Email y contraseña son obligatorios');
      return;
    }

    setCargando(true);

    const resultado = await api.createEmpleado({
      ...datos,
      microempresa: microempresaId
    });

    if (resultado.success) {
      alert('✅ Empleado creado exitosamente');
      onExito();
      cerrar();
    } else {
      setError(resultado.message || 'Error al crear empleado');
    }

    setCargando(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: '#2d2d2d',
        borderRadius: '15px',
        maxWidth: '600px',
        width: '100%',
        border: '2px solid #2196f3',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          padding: '25px',
          backgroundColor: '#1a1a1a',
          borderBottom: '2px solid #2196f3',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#2196f3', fontSize: '20px' }}>
            ➕ Nuevo Empleado
          </h3>
          <button
            onClick={cerrar}
            disabled={cargando}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f44336',
              color: '#fff',
              fontSize: '24px',
              cursor: cargando ? 'not-allowed' : 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '25px' }}>
          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#4d1f1f',
              color: '#ff6b6b',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #ff6b6b'
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Nombre *
              </label>
              <input
                type="text"
                value={datos.nombre}
                onChange={(e) => setDatos({...datos, nombre: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '2px solid #3d3d3d',
                  backgroundColor: '#1a1a1a',
                  color: '#fff'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Apellido
              </label>
              <input
                type="text"
                value={datos.apellido}
                onChange={(e) => setDatos({...datos, apellido: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '2px solid #3d3d3d',
                  backgroundColor: '#1a1a1a',
                  color: '#fff'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
              Email (para login) *
            </label>
            <input
              type="email"
              value={datos.email}
              onChange={(e) => setDatos({...datos, email: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '2px solid #3d3d3d',
                backgroundColor: '#1a1a1a',
                color: '#fff'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
              Contraseña *
            </label>
            <input
              type="password"
              value={datos.password}
              onChange={(e) => setDatos({...datos, password: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '2px solid #3d3d3d',
                backgroundColor: '#1a1a1a',
                color: '#fff'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Teléfono *
              </label>
              <input
                type="tel"
                value={datos.telefono}
                onChange={(e) => setDatos({...datos, telefono: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '2px solid #3d3d3d',
                  backgroundColor: '#1a1a1a',
                  color: '#fff'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                CI/NIT
              </label>
              <input
                type="text"
                value={datos.ci_nit}
                onChange={(e) => setDatos({...datos, ci_nit: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '2px solid #3d3d3d',
                  backgroundColor: '#1a1a1a',
                  color: '#fff'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
              Dirección
            </label>
            <textarea
              value={datos.direccion}
              onChange={(e) => setDatos({...datos, direccion: e.target.value})}
              rows="2"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '2px solid #3d3d3d',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                resize: 'vertical'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: cargando ? '#555' : '#4caf50',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: cargando ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            {cargando ? '⏳ Creando...' : '✅ Crear Empleado'}
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================
// MODAL: EDITAR EMPLEADO
// ============================================

function ModalEditarEmpleado({ empleado, cerrar, onExito }) {
  const [datos, setDatos] = useState({
    nombre: empleado.nombre || '',
    apellido: empleado.apellido || '',
    email: empleado.email || '',
    telefono: empleado.telefono || '',
    ci_nit: empleado.ci_nit || '',
    direccion: empleado.direccion || '',
    activo: empleado.activo
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [cambiarPassword, setCambiarPassword] = useState(false);
  const [nuevaPassword, setNuevaPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const datosActualizar = { ...datos };
    if (cambiarPassword && nuevaPassword) {
      datosActualizar.password = nuevaPassword;
    }

    const resultado = await api.updateEmpleado(empleado.id, datosActualizar);

    if (resultado.success) {
      alert('✅ Empleado actualizado exitosamente');
      onExito();
      cerrar();
    } else {
      setError(resultado.message || 'Error al actualizar empleado');
    }

    setCargando(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: '#2d2d2d',
        borderRadius: '15px',
        maxWidth: '600px',
        width: '100%',
        border: '2px solid #2196f3',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <div style={{
          padding: '25px',
          backgroundColor: '#1a1a1a',
          borderBottom: '2px solid #2196f3',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h3 style={{ margin: 0, color: '#2196f3', fontSize: '20px' }}>
            ✏️ Editar Empleado
          </h3>
          <button
            onClick={cerrar}
            disabled={cargando}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f44336',
              color: '#fff',
              fontSize: '24px',
              cursor: cargando ? 'not-allowed' : 'pointer'
            }}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '25px' }}>
          {error && (
            <div style={{
              padding: '12px',
              backgroundColor: '#4d1f1f',
              color: '#ff6b6b',
              borderRadius: '8px',
              marginBottom: '20px',
              border: '1px solid #ff6b6b'
            }}>
              ⚠️ {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Nombre *
              </label>
              <input
                type="text"
                value={datos.nombre}
                onChange={(e) => setDatos({...datos, nombre: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '2px solid #3d3d3d',
                  backgroundColor: '#1a1a1a',
                  color: '#fff'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Apellido
              </label>
              <input
                type="text"
                value={datos.apellido}
                onChange={(e) => setDatos({...datos, apellido: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '2px solid #3d3d3d',
                  backgroundColor: '#1a1a1a',
                  color: '#fff'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight:
            // CONTINUACIÓN DE ModalEditarEmpleado (agregar después de la línea 'fontWeight:')

              'bold' }}>
              Email *
            </label>
            <input
              type="email"
              value={datos.email}
              onChange={(e) => setDatos({...datos, email: e.target.value})}
              required
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '2px solid #3d3d3d',
                backgroundColor: '#1a1a1a',
                color: '#fff'
              }}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: '#fff', 
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={cambiarPassword}
                onChange={(e) => setCambiarPassword(e.target.checked)}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              Cambiar contraseña
            </label>

            {cambiarPassword && (
              <input
                type="password"
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder="Nueva contraseña"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '2px solid #3d3d3d',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  marginTop: '10px'
                }}
              />
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div>
              <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Teléfono *
              </label>
              <input
                type="tel"
                value={datos.telefono}
                onChange={(e) => setDatos({...datos, telefono: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '2px solid #3d3d3d',
                  backgroundColor: '#1a1a1a',
                  color: '#fff'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                CI/NIT
              </label>
              <input
                type="text"
                value={datos.ci_nit}
                onChange={(e) => setDatos({...datos, ci_nit: e.target.value})}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '2px solid #3d3d3d',
                  backgroundColor: '#1a1a1a',
                  color: '#fff'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
              Dirección
            </label>
            <textarea
              value={datos.direccion}
              onChange={(e) => setDatos({...datos, direccion: e.target.value})}
              rows="2"
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '5px',
                border: '2px solid #3d3d3d',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              color: '#fff', 
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={datos.activo}
                onChange={(e) => setDatos({...datos, activo: e.target.checked})}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              Empleado activo
            </label>
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%',
              padding: '15px',
              backgroundColor: cargando ? '#555' : '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: cargando ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            {cargando ? '⏳ Actualizando...' : '✅ Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default VistaEmpleados;