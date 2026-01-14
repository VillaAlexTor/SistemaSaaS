import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

function Dashboard({ usuario, cerrarSesion }) {
  const [vistaActual, setVistaActual] = useState('inicio');
  const [microempresas, setMicroempresas] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busquedaMicro, setBusquedaMicro] = useState('');
  const [busquedaUsuario, setBusquedaUsuario] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    
    console.log('📊 Cargando datos del dashboard admin...');
    
    const [resMicro, resUsuarios] = await Promise.all([
      api.getAllMicroempresas(),
      api.getAllUsuarios()
    ]);
    
    console.log('📥 Microempresas:', resMicro);
    console.log('📥 Usuarios:', resUsuarios);
    
    if (resMicro.success) setMicroempresas(resMicro.data);
    if (resUsuarios.success) setUsuarios(resUsuarios.data);
    
    setCargando(false);
  };

  const cambiarEstadoMicro = async (id) => {
    const micro = microempresas.find(m => m.id === id);
    
    console.log('🔍 Microempresa ANTES de cambiar:', micro);
    console.log('🔍 Estado actual:', micro.activo);
    console.log('🔍 Nuevo estado que se enviará:', !micro.activo);
    
    const resultado = await api.updateMicroempresaEstado(id, !micro.activo);
    
    console.log('📥 Respuesta de la API:', resultado);
    
    if (resultado.success) {
      console.log('✅ API respondió exitosamente');
      console.log('📊 Microempresas ANTES de actualizar estado:', microempresas);
      
      // Actualizar el estado local
      const nuevasMicros = microempresas.map(m => 
        m.id === id ? { ...m, activo: !m.activo } : m
      );
      
      console.log('📊 Microempresas DESPUÉS de actualizar estado:', nuevasMicros);
      
      setMicroempresas(nuevasMicros);
      
      if (micro.activo) {
        alert('✅ Microempresa enviada a la papelera');
      } else {
        alert('✅ Microempresa reactivada correctamente');
      }
      
      // Recargar datos para asegurar sincronización
      await cargarDatos();
    } else {
      console.error('❌ Error en la API:', resultado);
      alert('Error al cambiar estado de la microempresa');
    }
  };

  const eliminarMicroPermanente = async (id) => {
    if (!window.confirm('⚠️ ¿Estás seguro de ELIMINAR PERMANENTEMENTE esta microempresa? Esta acción NO se puede deshacer.')) return;
    
    const resultado = await api.deleteMicroempresa(id);
    if (resultado.success) {
      setMicroempresas(microempresas.filter(m => m.id !== id));
      alert('🗑️ Microempresa eliminada permanentemente');
    } else {
      alert('Error al eliminar la microempresa');
    }
  };

  const cambiarEstadoUsuario = async (id) => {
    const user = usuarios.find(u => u.id === id);
    const resultado = await api.updateUsuarioEstado(id, !user.activo);
    
    if (resultado.success) {
      setUsuarios(usuarios.map(u => 
        u.id === id ? { ...u, activo: !u.activo } : u
      ));
      
      if (user.activo) {
        alert('✅ Usuario enviado a la papelera');
      } else {
        alert('✅ Usuario reactivado correctamente');
      }
      
      cargarDatos();
    } else {
      alert('Error al cambiar estado del usuario');
    }
  };

  const eliminarUsuarioPermanente = async (id) => {
    if (!window.confirm('⚠️ ¿Estás seguro de ELIMINAR PERMANENTEMENTE este usuario? Esta acción NO se puede deshacer.')) return;
    
    const resultado = await api.deleteUsuario(id);
    if (resultado.success) {
      setUsuarios(usuarios.filter(u => u.id !== id));
      alert('🗑️ Usuario eliminado permanentemente');
    } else {
      alert('Error al eliminar el usuario');
    }
  };

  // Filtrar microempresas activas e inactivas
  const microsActivas = microempresas.filter(m => m.activo);
  const microsInactivas = microempresas.filter(m => !m.activo);

  // Filtrar usuarios activos e inactivos
  const usuariosActivos = usuarios.filter(u => u.activo);
  const usuariosInactivos = usuarios.filter(u => !u.activo);

  const microsFiltradas = microsActivas.filter(m =>
    (m.nombre && m.nombre.toLowerCase().includes(busquedaMicro.toLowerCase())) ||
    (m.email && m.email.toLowerCase().includes(busquedaMicro.toLowerCase())) ||
    (m.rubro && m.rubro.toLowerCase().includes(busquedaMicro.toLowerCase()))
  );

  const usuariosFiltrados = usuariosActivos.filter(u =>
    (u.nombre && u.nombre.toLowerCase().includes(busquedaUsuario.toLowerCase())) ||
    (u.apellido && u.apellido.toLowerCase().includes(busquedaUsuario.toLowerCase())) ||
    (u.email && u.email.toLowerCase().includes(busquedaUsuario.toLowerCase()))
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
                
                {/* Estadísticas principales */}
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

                {/* Resumen de últimos registros */}
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
                    <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>
                      Total: {microsActivas.length} Activas
                    </p>
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
                            <button 
                              onClick={() => cambiarEstadoMicro(m.id)} 
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
                              🗑️ Enviar a Papelera
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {microsFiltradas.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                      <div style={{ fontSize: '60px', marginBottom: '15px' }}>😕</div>
                      <p style={{ margin: 0, fontSize: '16px' }}>No se encontraron microempresas activas</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {vistaActual === 'usuarios' && (
              <>
                <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                  <div>
                    <h2 style={{ color: '#ff9800', margin: '0 0 5px 0' }}>👥 Gestión de Usuarios</h2>
                    <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>
                      Total: {usuariosActivos.length} Activos
                    </p>
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
                            <button 
                              onClick={() => cambiarEstadoUsuario(u.id)} 
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
                              🗑️ Enviar a Papelera
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {usuariosFiltrados.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                      <div style={{ fontSize: '60px', marginBottom: '15px' }}>😕</div>
                      <p style={{ margin: 0, fontSize: '16px' }}>No se encontraron usuarios activos</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {vistaActual === 'papelera' && (
              <>
                <h2 style={{ color: '#f44336', marginBottom: '20px', fontSize: '28px' }}>
                  🗑️ Papelera de Reciclaje
                </h2>
                <p style={{ color: '#aaa', marginBottom: '30px' }}>
                  Aquí se encuentran los elementos desactivados. Puedes reactivarlos o eliminarlos permanentemente.
                </p>

                {/* Microempresas en papelera */}
                <div style={{ marginBottom: '40px' }}>
                  <h3 style={{ color: '#ff9800', marginBottom: '15px', fontSize: '20px' }}>
                    🏪 Microempresas Desactivadas ({microsInactivas.length})
                  </h3>
                  
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
                                  style={{ 
                                    padding: '6px 12px', 
                                    marginRight: '5px',
                                    backgroundColor: '#4caf50', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '5px', 
                                    cursor: 'pointer', 
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  ♻️ Reactivar
                                </button>
                                <button 
                                  onClick={() => eliminarMicroPermanente(m.id)} 
                                  style={{ 
                                    padding: '6px 12px', 
                                    backgroundColor: '#d32f2f', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '5px', 
                                    cursor: 'pointer', 
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  ❌ Eliminar Permanente
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Usuarios en papelera */}
                <div>
                  <h3 style={{ color: '#ff9800', marginBottom: '15px', fontSize: '20px' }}>
                    👥 Usuarios Desactivados ({usuariosInactivos.length})
                  </h3>
                  
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
                            <th style={{ padding: '12px', textAlign: 'left', color: '#f44336', fontSize: '13px' }}>Nombre Completo</th>
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
                                  style={{ 
                                    padding: '6px 12px', 
                                    marginRight: '5px',
                                    backgroundColor: '#4caf50', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '5px', 
                                    cursor: 'pointer', 
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  ♻️ Reactivar
                                </button>
                                <button 
                                  onClick={() => eliminarUsuarioPermanente(u.id)} 
                                  style={{ 
                                    padding: '6px 12px', 
                                    backgroundColor: '#d32f2f', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '5px', 
                                    cursor: 'pointer', 
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                  }}
                                >
                                  ❌ Eliminar Permanente
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
</div>
);
}
// Componente de tarjeta de estadística
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
// Componente de tarjeta de información
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
<p style={{ margin: '5px 0 0 0', color: '#ff9800', fontSize: '11px', fontWeight: 'bold' }}>
📂 {item.rubro}
</p>
)}
</div>
))}
</div>
)}
</div>
);
}
export default Dashboard;
