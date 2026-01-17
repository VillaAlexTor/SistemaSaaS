import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import DetalleMicroempresaModal from './DetalleMicroempresaModal';
import VistaSolicitudes from './VistaSolicitudes';
import VistaEmpleadosPorEmpresa from './VistaEmpleadosPorEmpresa.jsx';
function Dashboard({ usuario, cerrarSesion }) {
  const [vistaActual, setVistaActual] = useState('inicio');
  const [microempresas, setMicroempresas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busquedaMicro, setBusquedaMicro] = useState('');
  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  
  // Estados para modales
  const [modalEditar, setModalEditar] = useState(null); // { tipo: 'micro'|'usuario', data: {} }
  const [modalDetalle, setModalDetalle] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    const [resMicro, resUsuarios] = await Promise.all([
      api.getAllMicroempresas(),
      api.getAllUsuarios()
    ]);
    
    if (resMicro.success) setMicroempresas(resMicro.data);
    if (resUsuarios.success) setUsuarios(resUsuarios.data);
    setCargando(false);
  };

  const cambiarEstadoMicro = async (id) => {
    const micro = microempresas.find(m => m.id === id);
    const resultado = await api.updateMicroempresaEstado(id, !micro.activo);
    
    if (resultado.success) {
      alert(micro.activo ? '✅ Microempresa enviada a la papelera' : '✅ Microempresa reactivada');
      await cargarDatos();
    } else {
      alert('Error al cambiar estado');
    }
  };

  const eliminarMicroPermanente = async (id) => {
    if (!window.confirm('⚠️ ¿ELIMINAR PERMANENTEMENTE? Esta acción NO se puede deshacer.')) return;
    
    const resultado = await api.deleteMicroempresa(id);
    if (resultado.success) {
      alert('🗑️ Microempresa eliminada permanentemente');
      cargarDatos();
    }
  };

  const cambiarEstadoUsuario = async (id) => {
    const user = usuarios.find(u => u.id === id);
    const resultado = await api.updateUsuarioEstado(id, !user.activo);
    
    if (resultado.success) {
      alert(user.activo ? '✅ Usuario enviado a la papelera' : '✅ Usuario reactivado');
      cargarDatos();
    }
  };

  const eliminarUsuarioPermanente = async (id) => {
    if (!window.confirm('⚠️ ¿ELIMINAR PERMANENTEMENTE? Esta acción NO se puede deshacer.')) return;
    
    const resultado = await api.deleteUsuario(id);
    if (resultado.success) {
      alert('🗑️ Usuario eliminado permanentemente');
      cargarDatos();
    }
  };

  // Filtros
  const microsActivas = microempresas.filter(m => m.activo);
  const microsInactivas = microempresas.filter(m => !m.activo);
  const usuariosActivos = usuarios.filter(u => u.activo);
  const usuariosInactivos = usuarios.filter(u => !u.activo);

  const microsFiltradas = microsActivas.filter(m =>
    (m.nombre?.toLowerCase().includes(busquedaMicro.toLowerCase())) ||
    (m.email?.toLowerCase().includes(busquedaMicro.toLowerCase())) ||
    (m.rubro?.toLowerCase().includes(busquedaMicro.toLowerCase()))
  );

  const usuariosFiltrados = usuariosActivos.filter(u =>
    (u.nombre?.toLowerCase().includes(busquedaUsuario.toLowerCase())) ||
    (u.apellido?.toLowerCase().includes(busquedaUsuario.toLowerCase())) ||
    (u.email?.toLowerCase().includes(busquedaUsuario.toLowerCase()))
  );

  const stats = {
    totalMicros: microempresas.length,
    microsActivas: microsActivas.length,
    microsInactivas: microsInactivas.length,
    microsPremium: microsActivas.filter(m => m.plan === 'premium').length,
    microsBasico: microsActivas.filter(m => m.plan === 'basico').length,
    totalUsuarios: usuarios.length,
    usuariosActivos: usuariosActivos.length,
    usuariosInactivos: usuariosInactivos.length
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#2d2d2d', padding: '15px 30px', boxShadow: '0 2px 10px rgba(0,0,0,0.5)', borderBottom: '2px solid #ff9800' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '30px' }}>👑</div>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#ff9800' }}>Panel de Administración</h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>Sistema de Gestión Completo</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 15px', backgroundColor: '#3d3d3d', borderRadius: '8px', border: '1px solid #444' }}>
              <div style={{ width: '35px', height: '35px', backgroundColor: '#ff9800', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                👤
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>{usuario?.nombre || 'Super Admin'}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#ff9800' }}>Administrador</p>
              </div>
            </div>
            <button onClick={cerrarSesion} style={{ padding: '8px 15px', backgroundColor: '#ff9800', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 10px rgba(255,152,0,0.3)' }}>
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <div style={{ backgroundColor: '#2d2d2d', padding: '15px 30px', borderBottom: '1px solid #3d3d3d' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { id: 'inicio', icono: '🏠', texto: 'Inicio' },
            { id: 'microempresas', icono: '🏪', texto: 'Microempresas' },
            { id: 'usuarios', icono: '👥', texto: 'Usuarios' },
            { id: 'empleados', icono: '👔', texto: 'Empleados' }, // ✅ NUEVO
            { id: 'reportes', icono: '📊', texto: 'Reportes' },
            { id: 'planes', icono: '💎', texto: 'Planes' },  
            { id: 'solicitudes', icono: '📋', texto: 'Solicitudes', badge: 0 },
            { id: 'papelera', icono: '🗑️', texto: 'Papelera', badge: microsInactivas.length + usuariosInactivos.length }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setVistaActual(item.id)}
              style={{
                padding: '10px 20px',
                backgroundColor: vistaActual === item.id ? '#ff9800' : 'transparent',
                color: vistaActual === item.id ? '#000' : '#fff',
                border: vistaActual === item.id ? 'none' : '1px solid #444',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease',
                position: 'relative'
              }}
            >
              {item.icono} {item.texto}
              {item.badge > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  backgroundColor: '#f44336',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '22px',
                  height: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px' }}>
        {cargando ? (
          <div style={{ textAlign: 'center', padding: '60px', backgroundColor: '#2d2d2d', borderRadius: '10px', border: '1px solid #3d3d3d' }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
            <p style={{ color: '#ff9800', fontSize: '18px', margin: 0 }}>Cargando datos del sistema...</p>
          </div>
        ) : (
          <>
            {vistaActual === 'inicio' && (
              <>
                <h2 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '28px' }}>📊 Estadísticas Generales</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                  <StatCard titulo="Total Microempresas" valor={stats.totalMicros} icono="🏪" color="#ff9800" />
                  <StatCard titulo="Empresas Activas" valor={stats.microsActivas} icono="✅" color="#4caf50" />
                  <StatCard titulo="En Papelera" valor={stats.microsInactivas} icono="🗑️" color="#f44336" />
                  <StatCard titulo="Planes Premium" valor={stats.microsPremium} icono="⭐" color="#ffb74d" />
                  <StatCard titulo="Planes Básico" valor={stats.microsBasico} icono="📦" color="#666" />
                  <StatCard titulo="Total Usuarios" valor={stats.totalUsuarios} icono="👥" color="#2196f3" />
                  <StatCard titulo="Usuarios Activos" valor={stats.usuariosActivos} icono="✔️" color="#4caf50" />
                  <StatCard titulo="En Papelera" valor={stats.usuariosInactivos} icono="🗑️" color="#f44336" />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <InfoCard titulo="🏪 Últimas Microempresas Registradas" items={microsActivas.slice(0, 5)} tipo="micro" />
                  <InfoCard titulo="👥 Últimos Usuarios Registrados" items={usuariosActivos.slice(0, 5)} tipo="usuario" />
                </div>
              </>
            )}

            {vistaActual === 'microempresas' && (
              <>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h2 style={{ color: '#ff9800', margin: '0 0 5px 0' }}>🏪 Gestión de Microempresas</h2>
                    <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>Total: {microsActivas.length} Activas</p>
                  </div>
                  <input
                    type="text"
                    placeholder="🔍 Buscar por nombre, email o rubro..."
                    value={busquedaMicro}
                    onChange={(e) => setBusquedaMicro(e.target.value)}
                    style={{ padding: '10px 15px', width: '350px', borderRadius: '5px', border: '2px solid #444', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px' }}
                  />
                </div>

                <div style={{ backgroundColor: '#2d2d2d', borderRadius: '10px', padding: '20px', overflowX: 'auto', border: '1px solid #3d3d3d' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ff9800' }}>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Nombre</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Rubro</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Plan</th>
                        <th style={{ padding: '12px', textAlign: 'center', color: '#ff9800', fontSize: '13px' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {microsFiltradas.map(m => (
                        <tr key={m.id} style={{ borderBottom: '1px solid #3d3d3d' }}>
                          <td style={{ padding: '12px', color: '#fff', fontSize: '14px' }}>{m.nombre}</td>
                          <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>{m.email}</td>
                          <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>{m.rubro || 'Sin rubro'}</td>
                          <td style={{ padding: '12px' }}>
                            <span style={{ padding: '4px 12px', borderRadius: '15px', backgroundColor: m.plan === 'premium' ? '#ffb74d' : '#666', color: m.plan === 'premium' ? '#000' : '#fff', fontSize: '11px', fontWeight: 'bold' }}>
                              {m.plan === 'premium' ? '⭐ PREMIUM' : '📦 BÁSICO'}
                            </span>
                          </td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap' }}>
                              <button 
                                onClick={() => setModalEditar({ tipo: 'micro', data: m })}
                                style={{ padding: '6px 12px', backgroundColor: '#2196f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                              >
                                ✏️ Editar
                              </button>
                              {/* ✅ AGREGAR ESTE BOTÓN */}
                              <button 
                                onClick={() => setModalDetalle(m.id)}
                                style={{ padding: '6px 12px', backgroundColor: '#9c27b0', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                              >
                                👁️ Ver Detalles
                              </button>
                              <button 
                                onClick={() => cambiarEstadoMicro(m.id)}
                                style={{ padding: '6px 12px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                              >
                                🗑️ Papelera
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {microsFiltradas.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                      <div style={{ fontSize: '60px', marginBottom: '15px' }}>😕</div>
                      <p style={{ margin: 0, fontSize: '16px' }}>No se encontraron microempresas</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {vistaActual === 'empleados' && (
              <VistaEmpleadosPorEmpresa />
            )}

            {vistaActual === 'usuarios' && (
              <>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h2 style={{ color: '#ff9800', margin: '0 0 5px 0' }}>👥 Gestión de Usuarios</h2>
                    <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>Total: {usuariosActivos.length} Activos</p>
                  </div>
                  <input
                    type="text"
                    placeholder="🔍 Buscar por nombre o email..."
                    value={busquedaUsuario}
                    onChange={(e) => setBusquedaUsuario(e.target.value)}
                    style={{ padding: '10px 15px', width: '350px', borderRadius: '5px', border: '2px solid #444', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px' }}
                  />
                </div>

                <div style={{ backgroundColor: '#2d2d2d', borderRadius: '10px', padding: '20px', overflowX: 'auto', border: '1px solid #3d3d3d' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #ff9800' }}>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Nombre Completo</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Email</th>
                        <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Teléfono</th>
                        <th style={{ padding: '12px', textAlign: 'center', color: '#ff9800', fontSize: '13px' }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usuariosFiltrados.map(u => (
                        <tr key={u.id} style={{ borderBottom: '1px solid #3d3d3d' }}>
                          <td style={{ padding: '12px', color: '#fff', fontSize: '14px' }}>{u.nombre} {u.apellido}</td>
                          <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>{u.email}</td>
                          <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>{u.telefono || 'Sin teléfono'}</td>
                          <td style={{ padding: '12px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', flexWrap: 'wrap' }}>
                              <button 
                                onClick={() => setModalEditar({ tipo: 'usuario', data: u })}
                                style={{ padding: '6px 12px', backgroundColor: '#2196f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                              >
                                ✏️ Editar
                              </button>
                              <button 
                                onClick={() => cambiarEstadoUsuario(u.id)}
                                style={{ padding: '6px 12px', backgroundColor: '#f44336', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                              >
                                🗑️ Papelera
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {usuariosFiltrados.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                      <div style={{ fontSize: '60px', marginBottom: '15px' }}>😕</div>
                      <p style={{ margin: 0, fontSize: '16px' }}>No se encontraron usuarios</p>
                    </div>
                  )}
                </div>
              </>
            )}
            {vistaActual === 'reportes' && (
              <VistaReportes microempresas={microempresas} usuarios={usuarios} />
            )},
            {vistaActual === 'planes' && (
              <VistaPlanes microempresas={microempresas} />
            )},
            {vistaActual === 'solicitudes' && (
              <VistaSolicitudes actualizarDatos={cargarDatos} />
            )},
            {vistaActual === 'papelera' && (
              <>
                <h2 style={{ color: '#f44336', marginBottom: '20px', fontSize: '28px' }}>🗑️ Papelera de Reciclaje</h2>
                <p style={{ color: '#aaa', marginBottom: '30px' }}>Elementos desactivados. Puedes reactivarlos o eliminarlos permanentemente.</p>

                <div style={{ marginBottom: '40px' }}>
                  <h3 style={{ color: '#ff9800', marginBottom: '15px', fontSize: '20px' }}>🏪 Microempresas Desactivadas ({microsInactivas.length})</h3>
                  
                  {microsInactivas.length === 0 ? (
                    <div style={{ backgroundColor: '#2d2d2d', borderRadius: '10px', padding: '40px', textAlign: 'center', border: '1px solid #3d3d3d' }}>
                      <div style={{ fontSize: '60px', marginBottom: '15px', opacity: 0.5 }}>✨</div>
                      <p style={{ color: '#aaa', margin: 0 }}>No hay microempresas en la papelera</p>
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#2d2d2d', borderRadius: '10px', padding: '20px', overflowX: 'auto', border: '1px solid #3d3d3d' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #f44336' }}>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#f44336', fontSize: '13px' }}>Nombre</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#f44336', fontSize: '13px' }}>Email</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#f44336', fontSize: '13px' }}>Rubro</th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#f44336', fontSize: '13px' }}>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {microsInactivas.map(m => (
                            <tr key={m.id} style={{ borderBottom: '1px solid #3d3d3d', opacity: 0.7 }}>
                              <td style={{ padding: '12px', color: '#fff', fontSize: '14px' }}>{m.nombre}</td>
                              <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>{m.email}</td>
                              <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>{m.rubro || 'Sin rubro'}</td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <button 
                                  onClick={() => cambiarEstadoMicro(m.id)}
                                  style={{ padding: '6px 12px', marginRight: '5px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                >
                                  ♻️ Reactivar
                                </button>
                                <button 
                                  onClick={() => eliminarMicroPermanente(m.id)}
                                  style={{ padding: '6px 12px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                >
                                  ❌ Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div>
                  <h3 style={{ color: '#ff9800', marginBottom: '15px', fontSize: '20px' }}>👥 Usuarios Desactivados ({usuariosInactivos.length})</h3>
                  
                  {usuariosInactivos.length === 0 ? (
                    <div style={{ backgroundColor: '#2d2d2d', borderRadius: '10px', padding: '40px', textAlign: 'center', border: '1px solid #3d3d3d' }}>
                      <div style={{ fontSize: '60px', marginBottom: '15px', opacity: 0.5 }}>✨</div>
                      <p style={{ color: '#aaa', margin: 0 }}>No hay usuarios en la papelera</p>
                    </div>
                  ) : (
                    <div style={{ backgroundColor: '#2d2d2d', borderRadius: '10px', padding: '20px', overflowX: 'auto', border: '1px solid #3d3d3d' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ borderBottom: '2px solid #f44336' }}>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#f44336', fontSize: '13px' }}>Nombre</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#f44336', fontSize: '13px' }}>Email</th>
                            <th style={{ padding: '12px', textAlign: 'left', color: '#f44336', fontSize: '13px' }}>Teléfono</th>
                            <th style={{ padding: '12px', textAlign: 'center', color: '#f44336', fontSize: '13px' }}>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {usuariosInactivos.map(u => (
                            <tr key={u.id} style={{ borderBottom: '1px solid #3d3d3d', opacity: 0.7 }}>
                              <td style={{ padding: '12px', color: '#fff', fontSize: '14px' }}>{u.nombre} {u.apellido}</td>
                              <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>{u.email}</td>
                              <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>{u.telefono || 'Sin teléfono'}</td>
                              <td style={{ padding: '12px', textAlign: 'center' }}>
                                <button
                                  onClick={() => cambiarEstadoUsuario(u.id)}
                                  style={{ padding: '6px 12px', marginRight: '5px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                >
                                  ♻️ Reactivar
                                </button>
                                <button
                                  onClick={() => eliminarUsuarioPermanente(u.id)}
                                  style={{ padding: '6px 12px', backgroundColor: '#d32f2f', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' }}
                                >
                                  ❌ Eliminar
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {/* Modales */}
      {modalEditar && (
        modalEditar.tipo === 'micro' ? (
          <EditarMicroempresaModal 
            micro={modalEditar.data} 
            cerrar={() => setModalEditar(null)}
            actualizar={cargarDatos}
          />
        ) : (
          <EditarUsuarioModal 
            usuario={modalEditar.data}
            cerrar={() => setModalEditar(null)}
            actualizar={cargarDatos}
          />
        )
      )}

      {/* Modal de Detalles */}
      {modalDetalle && (
        <DetalleMicroempresaModal 
          microId={modalDetalle}
          cerrar={() => setModalDetalle(null)}
        />
      )}
    </div>
  );
}
// ============================================
// COMPONENTE DE REPORTES GLOBALES
// ============================================

function VistaReportes({ microempresas, usuarios }) {
  const [reportes, setReportes] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    setCargando(true);
    const resultado = await api.getReportesGlobales();
    
    if (resultado.success) {
      setReportes(resultado.data);
    }
    
    setCargando(false);
  };

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
        <p style={{ color: '#ff9800', fontSize: '18px' }}>Cargando reportes...</p>
      </div>
    );
  }

  if (!reportes) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>❌</div>
        <p style={{ color: '#f44336', fontSize: '18px' }}>Error al cargar reportes</p>
      </div>
    );
  }

  // Calcular estadísticas
  const microsActivas = reportes.microempresas.filter(m => m.activo);
  const microsPremium = microsActivas.filter(m => m.plan === 'premium');
  const microsBasico = microsActivas.filter(m => m.plan === 'basico');
  
  const totalVentas = reportes.ventas.reduce((sum, v) => sum + parseFloat(v.total || 0), 0);
  const ventasHoy = reportes.ventas.filter(v => {
    const hoy = new Date().toDateString();
    const fechaVenta = new Date(v.fecha_venta).toDateString();
    return hoy === fechaVenta;
  });
  const ventasSemana = reportes.ventas.filter(v => {
    const hace7dias = new Date();
    hace7dias.setDate(hace7dias.getDate() - 7);
    return new Date(v.fecha_venta) >= hace7dias;
  });

  const ingresosPremium = microsPremium.length * 29; // $29 por plan premium

  // Calcular productos más vendidos
  const productosVendidos = {};
  reportes.ventas.forEach(venta => {
    if (venta.detalles) {
      venta.detalles.forEach(detalle => {
        const productoId = detalle.producto;
        if (!productosVendidos[productoId]) {
          productosVendidos[productoId] = {
            nombre: detalle.producto_nombre || 'Producto',
            cantidad: 0,
            total: 0
          };
        }
        productosVendidos[productoId].cantidad += detalle.cantidad;
        productosVendidos[productoId].total += parseFloat(detalle.subtotal || 0);
      });
    }
  });

  const top10Productos = Object.values(productosVendidos)
    .sort((a, b) => b.cantidad - a.cantidad)
    .slice(0, 10);

  // Calcular crecimiento de microempresas por mes (últimos 6 meses)
  const crecimientoMicroempresas = calcularCrecimientoPorMes(reportes.microempresas);

  return (
    <div>
      <h2 style={{ color: '#ff9800', marginBottom: '30px', fontSize: '28px' }}>
        📊 Reportes Globales del Sistema
      </h2>

      {/* Estadísticas principales */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        <ReporteStatCard 
          titulo="Total Ventas del Sistema" 
          valor={`Bs ${totalVentas.toFixed(2)}`} 
          icono="💰" 
          color="#4caf50"
          subtitulo={`${reportes.ventas.length} ventas registradas`}
        />
        <ReporteStatCard 
          titulo="Ventas Hoy" 
          valor={ventasHoy.length} 
          icono="📅" 
          color="#2196f3"
          subtitulo={`Bs ${ventasHoy.reduce((sum, v) => sum + parseFloat(v.total || 0), 0).toFixed(2)}`}
        />
        <ReporteStatCard 
          titulo="Ventas esta Semana" 
          valor={ventasSemana.length} 
          icono="📈" 
          color="#ff9800"
          subtitulo={`Bs ${ventasSemana.reduce((sum, v) => sum + parseFloat(v.total || 0), 0).toFixed(2)}`}
        />
        <ReporteStatCard 
          titulo="Ingresos por Planes Premium" 
          valor={`$${ingresosPremium}`} 
          icono="⭐" 
          color="#ffb74d"
          subtitulo={`${microsPremium.length} empresas premium`}
        />
        <ReporteStatCard 
          titulo="Total Productos Registrados" 
          valor={reportes.productos.length} 
          icono="📦" 
          color="#9c27b0"
          subtitulo={`En ${microsActivas.length} microempresas`}
        />
        <ReporteStatCard 
          titulo="Clientes Totales" 
          valor={usuarios.length} 
          icono="👥" 
          color="#00bcd4"
          subtitulo="Usuarios compradores"
        />
      </div>

      {/* Gráficos y tablas */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', marginBottom: '30px' }}>
        {/* Gráfico de crecimiento */}
        <div style={{ backgroundColor: '#2d2d2d', padding: '25px', borderRadius: '15px', border: '1px solid #3d3d3d' }}>
          <h3 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '20px', borderBottom: '2px solid #ff9800', paddingBottom: '10px' }}>
            📈 Crecimiento de Microempresas
          </h3>
          <GraficoCrecimiento datos={crecimientoMicroempresas} />
        </div>

        {/* Distribución de planes */}
        <div style={{ backgroundColor: '#2d2d2d', padding: '25px', borderRadius: '15px', border: '1px solid #3d3d3d' }}>
          <h3 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '20px', borderBottom: '2px solid #ff9800', paddingBottom: '10px' }}>
            📊 Distribución de Planes
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '30px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#fff', fontSize: '14px' }}>⭐ Premium</span>
                <span style={{ color: '#ffb74d', fontWeight: 'bold', fontSize: '16px' }}>
                  {microsPremium.length} ({((microsPremium.length / microsActivas.length) * 100).toFixed(1)}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '12px', backgroundColor: '#1a1a1a', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${(microsPremium.length / microsActivas.length) * 100}%`, 
                  height: '100%', 
                  backgroundColor: '#ffb74d',
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: '#fff', fontSize: '14px' }}>📦 Básico</span>
                <span style={{ color: '#666', fontWeight: 'bold', fontSize: '16px' }}>
                  {microsBasico.length} ({((microsBasico.length / microsActivas.length) * 100).toFixed(1)}%)
                </span>
              </div>
              <div style={{ width: '100%', height: '12px', backgroundColor: '#1a1a1a', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ 
                  width: `${(microsBasico.length / microsActivas.length) * 100}%`, 
                  height: '100%', 
                  backgroundColor: '#666',
                  transition: 'width 0.5s ease'
                }}></div>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#1a1a1a', borderRadius: '10px', textAlign: 'center' }}>
              <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Ingresos Mensuales Estimados</p>
              <p style={{ margin: '5px 0 0 0', color: '#4caf50', fontSize: '28px', fontWeight: 'bold' }}>
                ${ingresosPremium}/mes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top 10 productos más vendidos */}
      <div style={{ backgroundColor: '#2d2d2d', padding: '25px', borderRadius: '15px', border: '1px solid #3d3d3d' }}>
        <h3 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '20px', borderBottom: '2px solid #ff9800', paddingBottom: '10px' }}>
          🏆 Top 10 Productos Más Vendidos
        </h3>
        
        {top10Productos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div style={{ fontSize: '60px', marginBottom: '15px', opacity: 0.5 }}>📦</div>
            <p style={{ color: '#aaa', margin: 0 }}>No hay productos vendidos todavía</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ff9800' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Posición</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Producto</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#ff9800', fontSize: '13px' }}>Cantidad Vendida</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#ff9800', fontSize: '13px' }}>Total Bs</th>
                  <th style={{ padding: '12px', textAlign: 'right', color: '#ff9800', fontSize: '13px' }}>Progreso</th>
                </tr>
              </thead>
              <tbody>
                {top10Productos.map((producto, index) => {
                  const maxCantidad = top10Productos[0].cantidad;
                  const porcentaje = (producto.cantidad / maxCantidad) * 100;
                  
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #3d3d3d' }}>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '30px',
                          height: '30px',
                          borderRadius: '50%',
                          backgroundColor: index < 3 ? '#ffb74d' : '#3d3d3d',
                          color: index < 3 ? '#000' : '#fff',
                          fontWeight: 'bold',
                          fontSize: '14px'
                        }}>
                          {index + 1}
                        </span>
                      </td>
                      <td style={{ padding: '12px', color: '#fff', fontSize: '14px', fontWeight: index < 3 ? 'bold' : 'normal' }}>
                        {index < 3 && <span style={{ marginRight: '5px' }}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>}
                        {producto.nombre}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'center', color: '#4caf50', fontSize: '14px', fontWeight: 'bold' }}>
                        {producto.cantidad}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right', color: '#4caf50', fontSize: '14px', fontWeight: 'bold' }}>
                        {producto.total.toFixed(2)}
                      </td>
                      <td style={{ padding: '12px', textAlign: 'right' }}>
                        <div style={{ width: '100px', height: '8px', backgroundColor: '#1a1a1a', borderRadius: '4px', overflow: 'hidden', display: 'inline-block' }}>
                          <div style={{ 
                            width: `${porcentaje}%`, 
                            height: '100%', 
                            backgroundColor: index < 3 ? '#ffb74d' : '#4caf50',
                            transition: 'width 0.5s ease'
                          }}></div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
// ============================================
// COMPONENTE DE GESTIÓN DE PLANES
// ============================================

function VistaPlanes({ microempresas }) {
  const [planes, setPlanes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalEditar, setModalEditar] = useState(null);

  useEffect(() => {
    cargarPlanes();
  }, []);

  const cargarPlanes = async () => {
    setCargando(true);
    const resultado = await api.getPlanes();
    
    if (resultado.success) {
      setPlanes(resultado.data);
    }
    
    setCargando(false);
  };

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
        <p style={{ color: '#ff9800', fontSize: '18px' }}>Cargando planes...</p>
      </div>
    );
  }

  const microsActivas = microempresas.filter(m => m.activo);
  const microsPorPlan = {};
  
  microsActivas.forEach(m => {
    const plan = m.plan || 'basico';
    microsPorPlan[plan] = (microsPorPlan[plan] || 0) + 1;
  });

  return (
    <div>
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ color: '#ff9800', margin: '0 0 5px 0', fontSize: '28px' }}>💎 Gestión de Planes</h2>
          <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>Administra los planes de suscripción del sistema</p>
        </div>
      </div>

      {/* Tarjetas de planes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '25px', marginBottom: '40px' }}>
        {/* Plan Básico */}
        <TarjetaPlan
          plan={{
            id: 1,
            nombre: 'Básico',
            descripcion: 'Plan gratuito para comenzar',
            precio_mensual: 0,
            max_productos: 50,
            max_usuarios: 2,
            tiene_reportes: false,
            tiene_api: false,
            icono: '📦',
            color: '#666'
          }}
          cantidadEmpresas={microsPorPlan['basico'] || 0}
          onEditar={setModalEditar}
        />

        {/* Plan Premium */}
        <TarjetaPlan
          plan={{
            id: 2,
            nombre: 'Premium',
            descripcion: 'Plan completo con todas las funciones',
            precio_mensual: 29,
            max_productos: 999999,
            max_usuarios: 10,
            tiene_reportes: true,
            tiene_api: true,
            icono: '⭐',
            color: '#ffb74d'
          }}
          cantidadEmpresas={microsPorPlan['premium'] || 0}
          onEditar={setModalEditar}
        />
      </div>

      {/* Estadísticas de planes */}
      <div style={{ backgroundColor: '#2d2d2d', padding: '25px', borderRadius: '15px', border: '1px solid #3d3d3d' }}>
        <h3 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '20px', borderBottom: '2px solid #ff9800', paddingBottom: '10px' }}>
          📊 Estadísticas de Planes
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '10px' }}>
            <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Total Empresas Activas</p>
            <p style={{ margin: '10px 0 0 0', color: '#ff9800', fontSize: '32px', fontWeight: 'bold' }}>
              {microsActivas.length}
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '10px' }}>
            <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Tasa de Conversión a Premium</p>
            <p style={{ margin: '10px 0 0 0', color: '#4caf50', fontSize: '32px', fontWeight: 'bold' }}>
              {microsActivas.length > 0 
                ? ((microsPorPlan['premium'] || 0) / microsActivas.length * 100).toFixed(1)
                : 0}%
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#1a1a1a', borderRadius: '10px' }}>
            <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Ingresos Mensuales Estimados</p>
            <p style={{ margin: '10px 0 0 0', color: '#4caf50', fontSize: '32px', fontWeight: 'bold' }}>
              ${(microsPorPlan['premium'] || 0) * 29}
            </p>
          </div>
        </div>

        {/* Gráfico de distribución */}
        <div style={{ marginTop: '30px' }}>
          <p style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '15px', fontWeight: 'bold' }}>
            Distribución de Planes
          </p>
          <div style={{ display: 'flex', gap: '10px', height: '40px' }}>
            {microsActivas.length > 0 && (
              <>
                <div 
                  style={{ 
                    flex: microsPorPlan['basico'] || 0,
                    backgroundColor: '#666',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  {microsPorPlan['basico'] || 0}
                </div>
                <div 
                  style={{ 
                    flex: microsPorPlan['premium'] || 0,
                    backgroundColor: '#ffb74d',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '14px'
                  }}
                >
                  {microsPorPlan['premium'] || 0}
                </div>
              </>
            )}
          </div>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#666', borderRadius: '3px' }}></div>
              <span style={{ color: '#aaa', fontSize: '13px' }}>Básico</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', backgroundColor: '#ffb74d', borderRadius: '3px' }}></div>
              <span style={{ color: '#aaa', fontSize: '13px' }}>Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de edición */}
      {modalEditar && (
        <ModalEditarPlan 
          plan={modalEditar}
          cerrar={() => setModalEditar(null)}
          actualizar={cargarPlanes}
        />
      )}
    </div>
  );
}

// Componente de tarjeta de plan
function TarjetaPlan({ plan, cantidadEmpresas, onEditar }) {
  return (
    <div style={{ 
      backgroundColor: '#2d2d2d', 
      borderRadius: '15px', 
      padding: '30px',
      border: `2px solid ${plan.color}`,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decoración de fondo */}
      <div style={{
        position: 'absolute',
        top: '-50px',
        right: '-50px',
        width: '150px',
        height: '150px',
        backgroundColor: plan.color,
        opacity: 0.1,
        borderRadius: '50%'
      }}></div>

      {/* Contenido */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>{plan.icono}</div>
            <h3 style={{ margin: 0, color: plan.color, fontSize: '24px', fontWeight: 'bold' }}>
              {plan.nombre}
            </h3>
            <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '13px' }}>
              {plan.descripcion}
            </p>
          </div>
          <button
            onClick={() => onEditar(plan)}
            style={{
              padding: '8px 16px',
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
        </div>

        {/* Precio */}
        <div style={{ marginBottom: '25px' }}>
          <span style={{ color: plan.color, fontSize: '48px', fontWeight: 'bold' }}>
            ${plan.precio_mensual}
          </span>
          <span style={{ color: '#aaa', fontSize: '16px' }}>/mes</span>
        </div>

        {/* Características */}
        <div style={{ marginBottom: '20px' }}>
          <CaracteristicaPlan 
            texto={`Hasta ${plan.max_productos === 999999 ? '∞' : plan.max_productos} productos`}
            activo={true}
          />
          <CaracteristicaPlan 
            texto={`${plan.max_usuarios} usuarios internos`}
            activo={true}
          />
          <CaracteristicaPlan 
            texto="Reportes avanzados"
            activo={plan.tiene_reportes}
          />
          <CaracteristicaPlan 
            texto="Acceso a API"
            activo={plan.tiene_api}
          />
        </div>

        {/* Empresas suscritas */}
        <div style={{ 
          padding: '15px', 
          backgroundColor: '#1a1a1a', 
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>Empresas Suscritas</p>
          <p style={{ margin: '5px 0 0 0', color: plan.color, fontSize: '28px', fontWeight: 'bold' }}>
            {cantidadEmpresas}
          </p>
        </div>
      </div>
    </div>
  );
}

// Componente de característica de plan
function CaracteristicaPlan({ texto, activo }) {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '10px',
      marginBottom: '12px'
    }}>
      <div style={{ 
        width: '20px', 
        height: '20px', 
        borderRadius: '50%',
        backgroundColor: activo ? '#4caf50' : '#666',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px'
      }}>
        {activo ? '✓' : '✗'}
      </div>
      <span style={{ 
        color: activo ? '#fff' : '#666',
        fontSize: '14px'
      }}>
        {texto}
      </span>
    </div>
  );
}

// Modal para editar plan
function ModalEditarPlan({ plan, cerrar, actualizar }) {
  const [datos, setDatos] = useState({
    nombre: plan.nombre,
    descripcion: plan.descripcion,
    precio_mensual: plan.precio_mensual,
    max_productos: plan.max_productos,
    max_usuarios: plan.max_usuarios,
    tiene_reportes: plan.tiene_reportes,
    tiene_api: plan.tiene_api
  });
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    setGuardando(true);
    const resultado = await api.updatePlan(plan.id, datos);
    
    if (resultado.success) {
      alert('✅ Plan actualizado correctamente');
      actualizar();
      cerrar();
    } else {
      alert(`❌ Error: ${resultado.message}`);
    }
    
    setGuardando(false);
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
      zIndex: 1000, 
      padding: '20px' 
    }}>
      <div style={{ 
        backgroundColor: '#2d2d2d', 
        padding: '30px', 
        borderRadius: '15px', 
        maxWidth: '600px', 
        width: '100%', 
        maxHeight: '90vh', 
        overflowY: 'auto', 
        border: '2px solid #ff9800' 
      }}>
        <h2 style={{ color: '#ff9800', marginBottom: '20px' }}>
          ✏️ Editar Plan: {plan.nombre}
        </h2>
        
        <div style={{ display: 'grid', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
              Nombre del Plan *
            </label>
            <input
              type="text"
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px', 
                border: '2px solid #444', 
                backgroundColor: '#1a1a1a', 
                color: '#fff' 
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
              Descripción
            </label>
            <textarea
              value={datos.descripcion}
              onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })}
              rows="3"
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px', 
                border: '2px solid #444', 
                backgroundColor: '#1a1a1a', 
                color: '#fff',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div>
              <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Precio Mensual ($)
              </label>
              <input
                type="number"
                value={datos.precio_mensual}
                onChange={(e) => setDatos({ ...datos, precio_mensual: parseFloat(e.target.value) })}
                min="0"
                step="0.01"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  border: '2px solid #444', 
                  backgroundColor: '#1a1a1a', 
                  color: '#fff' 
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                Máx. Productos
              </label>
              <input
                type="number"
                value={datos.max_productos}
                onChange={(e) => setDatos({ ...datos, max_productos: parseInt(e.target.value) })}
                min="1"
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  borderRadius: '5px', 
                  border: '2px solid #444', 
                  backgroundColor: '#1a1a1a', 
                  color: '#fff' 
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
              Máx. Usuarios Internos
            </label>
            <input
              type="number"
              value={datos.max_usuarios}
              onChange={(e) => setDatos({ ...datos, max_usuarios: parseInt(e.target.value) })}
              min="1"
              style={{ 
                width: '100%', 
                padding: '10px', 
                borderRadius: '5px', 
                border: '2px solid #444', 
                backgroundColor: '#1a1a1a', 
                color: '#fff' 
              }}
            />
          </div>

          <div style={{ display: 'grid', gap: '12px' }}>
            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: '12px',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={datos.tiene_reportes}
                onChange={(e) => setDatos({ ...datos, tiene_reportes: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ color: '#fff', fontSize: '14px' }}>Incluye Reportes Avanzados</span>
            </label>

            <label style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              padding: '12px',
              backgroundColor: '#1a1a1a',
              borderRadius: '8px',
              cursor: 'pointer'
            }}>
              <input
                type="checkbox"
                checked={datos.tiene_api}
                onChange={(e) => setDatos({ ...datos, tiene_api: e.target.checked })}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ color: '#fff', fontSize: '14px' }}>Acceso a API</span>
            </label>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
          <button
            onClick={cerrar}
            disabled={guardando}
            style={{ 
              flex: 1, 
              padding: '12px', 
              backgroundColor: '#444', 
              color: '#fff', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: guardando ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold' 
            }}
          >
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={guardando}
            style={{ 
              flex: 1, 
              padding: '12px', 
              background: guardando ? '#666' : 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', 
              color: guardando ? '#aaa' : '#000', 
              border: 'none', 
              borderRadius: '5px', 
              cursor: guardando ? 'not-allowed' : 'pointer', 
              fontWeight: 'bold' 
            }}
          >
            {guardando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
// Componente de tarjeta de estadística para reportes
function ReporteStatCard({ titulo, valor, icono, color, subtitulo }) {
  return (
    <div style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '10px', border: '1px solid #3d3d3d', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>{titulo}</p>
          <h2 style={{ margin: 0, color, fontSize: '28px', fontWeight: 'bold' }}>{valor}</h2>
          {subtitulo && (
            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '11px' }}>{subtitulo}</p>
          )}
        </div>
        <div style={{ fontSize: '40px', opacity: 0.8 }}>{icono}</div>
      </div>
    </div>
  );
}

// Gráfico simple de crecimiento
function GraficoCrecimiento({ datos }) {
  if (!datos || datos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <p style={{ color: '#aaa' }}>No hay datos suficientes para mostrar</p>
      </div>
    );
  }

  const maxValor = Math.max(...datos.map(d => d.cantidad));

  return (
    <div style={{ marginTop: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '15px', height: '200px', padding: '0 10px' }}>
        {datos.map((dato, index) => {
          const altura = (dato.cantidad / maxValor) * 100;
          
          return (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '100%', 
                height: `${altura}%`, 
                backgroundColor: '#ff9800',
                borderRadius: '5px 5px 0 0',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                paddingTop: '5px',
                transition: 'height 0.5s ease',
                position: 'relative'
              }}>
                <span style={{ color: '#000', fontSize: '12px', fontWeight: 'bold' }}>{dato.cantidad}</span>
              </div>
              <span style={{ color: '#aaa', fontSize: '11px', textAlign: 'center' }}>{dato.mes}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Función para calcular crecimiento por mes
function calcularCrecimientoPorMes(microempresas) {
  const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const ahora = new Date();
  const resultado = [];

  for (let i = 5; i >= 0; i--) {
    const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
    const mesIndex = fecha.getMonth();
    const año = fecha.getFullYear();

    const cantidad = microempresas.filter(m => {
      const fechaRegistro = new Date(m.fecha_registro);
      return fechaRegistro.getMonth() === mesIndex && fechaRegistro.getFullYear() === año;
    }).length;

    resultado.push({
      mes: `${meses[mesIndex]}`,
      cantidad: cantidad
    });
  }

  return resultado;
}
// Componentes auxiliares...
function StatCard({ titulo, valor, icono, color }) {
  return (
    <div style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '10px', border: '1px solid #3d3d3d', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, color: '#aaa', fontSize: '13px', marginBottom: '5px' }}>{titulo}</p>
          <h2 style={{ margin: 0, color, fontSize: '32px', fontWeight: 'bold' }}>{valor}</h2>
        </div>
        <div style={{ fontSize: '45px', opacity: 0.8 }}>{icono}</div>
      </div>
    </div>
  );
}

function InfoCard({ titulo, items, tipo }) {
  return (
    <div style={{ backgroundColor: '#2d2d2d', padding: '20px', borderRadius: '10px', border: '1px solid #3d3d3d', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#ff9800', borderBottom: '2px solid #ff9800', paddingBottom: '10px', fontSize: '18px' }}>{titulo}</h3>
      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px' }}>
          <div style={{ fontSize: '50px', marginBottom: '10px', opacity: 0.5 }}>📭</div>
          <p style={{ color: '#aaa', margin: 0, fontSize: '14px' }}>No hay registros todavía</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
          {items.map(item => (
            <div key={item.id} style={{ padding: '12px', backgroundColor: '#1a1a1a', borderRadius: '8px', borderLeft: '4px solid #ff9800' }}>
              <p style={{ margin: '0 0 5px 0', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                {tipo === 'micro' ? item.nombre : `${item.nombre} ${item.apellido}`}
              </p>
              <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>{item.email}</p>
              {tipo === 'micro' && item.rubro && (
                <p style={{ margin: '5px 0 0 0', color: '#ff9800', fontSize: '11px', fontWeight: 'bold' }}>📂 {item.rubro}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Modal para editar microempresa
function EditarMicroempresaModal({ micro, cerrar, actualizar }) {
  const [datos, setDatos] = useState({
    nombre: micro.nombre,
    email: micro.email,
    telefono: micro.telefono || '',
    direccion: micro.direccion || '',
    rubro: micro.rubro || '',
    plan: micro.plan
  });
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    setGuardando(true);
    const resultado = await api.updateMicroempresa(micro.id, datos);
    if (resultado.success) {
      alert('✅ Microempresa actualizada correctamente');
      await actualizar();
      cerrar();
    } else {
      alert(`❌ Error: ${resultado.message}`);
    }
    setGuardando(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: '#2d2d2d', padding: '30px', borderRadius: '15px', maxWidth: '600px', width: '100%', maxHeight: '90vh', overflowY: 'auto', border: '2px solid #ff9800' }}>
        <h2 style={{ color: '#ff9800', marginBottom: '20px' }}>✏️ Editar Microempresa</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Nombre *</label>
            <input
              type="text"
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '2px solid #444', backgroundColor: '#1a1a1a', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Email *</label>
            <input
              type="email"
              value={datos.email}
              onChange={(e) => setDatos({ ...datos, email: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '2px solid #444', backgroundColor: '#1a1a1a', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Teléfono</label>
            <input
              type="tel"
              value={datos.telefono}
              onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '2px solid #444', backgroundColor: '#1a1a1a', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Dirección</label>
            <input
              type="text"
              value={datos.direccion}
              onChange={(e) => setDatos({ ...datos, direccion: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '2px solid #444', backgroundColor: '#1a1a1a', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Rubro</label>
            <select
              value={datos.rubro}
              onChange={(e) => setDatos({ ...datos, rubro: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '2px solid #444', backgroundColor: '#1a1a1a', color: '#fff' }}
            >
              <option value="">Selecciona un rubro</option>
              <option value="Abarrotes">🛒 Abarrotes</option>
              <option value="Restaurante">🍽️ Restaurante</option>
              <option value="Farmacia">💊 Farmacia</option>
              <option value="Ferretería">🔨 Ferretería</option>
              <option value="Ropa">👔 Ropa</option>
              <option value="Tecnología">💻 Tecnología</option>
              <option value="Servicios">🔧 Servicios</option>
              <option value="Otro">📦 Otro</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Plan</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setDatos({ ...datos, plan: 'basico' })}
                style={{ flex: 1, padding: '12px', backgroundColor: datos.plan === 'basico' ? '#666' : 'transparent', color: '#fff', border: '2px solid #666', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                📦 Básico
              </button>
              <button
                onClick={() => setDatos({ ...datos, plan: 'premium' })}
                style={{ flex: 1, padding: '12px', backgroundColor: datos.plan === 'premium' ? '#ffb74d' : 'transparent', color: datos.plan === 'premium' ? '#000' : '#fff', border: '2px solid #ffb74d', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
              >
                ⭐ Premium
              </button>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
          <button
            onClick={cerrar}
            disabled={guardando}
            style={{ flex: 1, padding: '12px', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '5px', cursor: guardando ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={guardando}
            style={{ flex: 1, padding: '12px', background: guardando ? '#666' : 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', color: guardando ? '#aaa' : '#000', border: 'none', borderRadius: '5px', cursor: guardando ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            {guardando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal para editar usuario
function EditarUsuarioModal({ usuario, cerrar, actualizar }) {
  const [datos, setDatos] = useState({
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    telefono: usuario.telefono || ''
  });
  const [guardando, setGuardando] = useState(false);

  const guardar = async () => {
    setGuardando(true);
    const resultado = await api.updateUsuario(usuario.id, datos);
    if (resultado.success) {
      alert('✅ Usuario actualizado correctamente');
      await actualizar();
      cerrar();
    } else {
      alert(`❌ Error: ${resultado.message}`);
    }
    setGuardando(false);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
      <div style={{ backgroundColor: '#2d2d2d', padding: '30px', borderRadius: '15px', maxWidth: '600px', width: '100%', border: '2px solid #ff9800' }}>
        <h2 style={{ color: '#ff9800', marginBottom: '20px' }}>✏️ Editar Usuario</h2>
        <div style={{ display: 'grid', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Nombre *</label>
            <input
              type="text"
              value={datos.nombre}
              onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '2px solid #444', backgroundColor: '#1a1a1a', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Apellido *</label>
            <input
              type="text"
              value={datos.apellido}
              onChange={(e) => setDatos({ ...datos, apellido: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '2px solid #444', backgroundColor: '#1a1a1a', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Email *</label>
            <input
              type="email"
              value={datos.email}
              onChange={(e) => setDatos({ ...datos, email: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '2px solid #444', backgroundColor: '#1a1a1a', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>Teléfono</label>
            <input
              type="tel"
              value={datos.telefono}
              onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
              style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '2px solid #444', backgroundColor: '#1a1a1a', color: '#fff' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
          <button
            onClick={cerrar}
            disabled={guardando}
            style={{ flex: 1, padding: '12px', backgroundColor: '#444', color: '#fff', border: 'none', borderRadius: '5px', cursor: guardando ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            Cancelar
          </button>
          <button
            onClick={guardar}
            disabled={guardando}
            style={{ flex: 1, padding: '12px', background: guardando ? '#666' : 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', color: guardando ? '#aaa' : '#000', border: 'none', borderRadius: '5px', cursor: guardando ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}
          >
            {guardando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
export default Dashboard;