import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

function DashboardUsuario({ usuario, cerrarSesion }) {
  const [empresas, setEmpresas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRubro, setFiltroRubro] = useState('todos');
  
  // Estados para modales
  const [modalProductos, setModalProductos] = useState(null);
  const [modalPerfil, setModalPerfil] = useState(false);

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const cargarEmpresas = async () => {
    setCargando(true);
    const resultado = await api.getMicroempresas();
    
    if (resultado.success) {
      setEmpresas(resultado.data.filter(e => e.activo));
    } else {
      setEmpresas([]);
    }
    
    setCargando(false);
  };

  const rubros = [...new Set(empresas.map(e => e.rubro).filter(Boolean))];

  const empresasFiltradas = empresas.filter(e => {
    const busquedaLower = busqueda.toLowerCase();
    const coincideBusqueda = e.nombre.toLowerCase().includes(busquedaLower) ||
                            (e.descripcion && e.descripcion.toLowerCase().includes(busquedaLower));
    const coincideRubro = filtroRubro === 'todos' || e.rubro === filtroRubro;
    return coincideBusqueda && coincideRubro;
  });

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2d2d2d',
        padding: '20px 30px',
        borderBottom: '2px solid #ff9800',
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '40px' }}>👤</div>
            <div>
              <h1 style={{ margin: 0, color: '#ff9800', fontSize: '24px' }}>
                Mi Dashboard
              </h1>
              <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>
                Bienvenido, {usuario.nombre} {usuario.apellido}
              </p>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setModalPerfil(true)}
              style={{
                padding: '10px 20px',
                backgroundColor: '#2196f3',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ⚙️ Mi Perfil
            </button>
            <button
              onClick={cerrarSesion}
              style={{
                padding: '10px 25px',
                backgroundColor: '#ff9800',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Contenido */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px' }}>
        {cargando ? (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            backgroundColor: '#2d2d2d',
            borderRadius: '10px',
            border: '1px solid #3d3d3d'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
            <p style={{ color: '#ff9800', fontSize: '18px', margin: 0 }}>
              Cargando empresas...
            </p>
          </div>
        ) : (
          <>
            {/* Buscador y filtros */}
            <div style={{
              backgroundColor: '#2d2d2d',
              padding: '20px',
              borderRadius: '10px',
              marginBottom: '30px',
              border: '1px solid #3d3d3d'
            }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', color: '#ff9800', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                    🔍 Buscar Empresa
                  </label>
                  <input
                    type="text"
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    placeholder="Busca por nombre o descripción..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #444',
                      borderRadius: '8px',
                      backgroundColor: '#1a1a1a',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#ff9800', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>
                    📂 Filtrar por Rubro
                  </label>
                  <select
                    value={filtroRubro}
                    onChange={(e) => setFiltroRubro(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #444',
                      borderRadius: '8px',
                      backgroundColor: '#1a1a1a',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  >
                    <option value="todos">Todos los rubros</option>
                    {rubros.map(r => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>

              <p style={{ marginTop: '15px', color: '#aaa', fontSize: '13px', textAlign: 'center' }}>
                Mostrando <strong style={{ color: '#ff9800' }}>{empresasFiltradas.length}</strong> de <strong>{empresas.length}</strong> empresas
              </p>
            </div>

            {/* Grid de empresas */}
            {empresasFiltradas.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {empresasFiltradas.map(empresa => (
                  <TarjetaEmpresa 
                    key={empresa.id}
                    empresa={empresa}
                    onClick={() => setModalProductos(empresa.id)}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '60px',
                backgroundColor: '#2d2d2d',
                borderRadius: '10px',
                border: '1px solid #3d3d3d'
              }}>
                <div style={{ fontSize: '80px', marginBottom: '20px' }}>😕</div>
                <h3 style={{ margin: 0, color: '#fff', fontSize: '24px', marginBottom: '10px' }}>
                  No se encontraron empresas
                </h3>
                <p style={{ margin: '0 0 20px 0', color: '#aaa' }}>
                  Intenta cambiar los filtros de búsqueda
                </p>
                <button
                  onClick={() => { setBusqueda(''); setFiltroRubro('todos'); }}
                  style={{
                    padding: '10px 25px',
                    backgroundColor: '#ff9800',
                    color: '#000',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}
                >
                  🔄 Limpiar Filtros
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modales */}
      {modalProductos && (
        <ModalProductos 
          empresaId={modalProductos}
          cerrar={() => setModalProductos(null)}
        />
      )}

      {modalPerfil && (
        <ModalPerfil 
          usuario={usuario}
          cerrar={() => setModalPerfil(false)}
        />
      )}
    </div>
  );
}

// ============================================
// COMPONENTE: TARJETA DE EMPRESA
// ============================================

function TarjetaEmpresa({ empresa, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        backgroundColor: '#2d2d2d',
        borderRadius: '10px',
        overflow: 'hidden',
        border: '1px solid #3d3d3d',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(255,152,0,0.3)';
        e.currentTarget.style.borderColor = '#ff9800';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = '#3d3d3d';
      }}
    >
      {/* Banner superior */}
      <div style={{
        backgroundColor: '#ff9800',
        padding: '15px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '60px', marginBottom: '5px' }}>
          {empresa.logo}
        </div>
        <div style={{
          display: 'inline-block',
          padding: '5px 15px',
          backgroundColor: empresa.plan === 'premium' ? '#000' : '#666',
          borderRadius: '15px',
          color: '#fff',
          fontSize: '11px',
          fontWeight: 'bold'
        }}>
          {empresa.plan === 'premium' ? '⭐ PREMIUM' : 'BÁSICO'}
        </div>
      </div>

      {/* Contenido */}
      <div style={{ padding: '20px' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '20px' }}>
          {empresa.nombre}
        </h3>
        
        <div style={{ marginBottom: '15px' }}>
          <span style={{
            display: 'inline-block',
            padding: '5px 12px',
            backgroundColor: '#1a1a1a',
            borderRadius: '15px',
            color: '#ff9800',
            fontSize: '12px',
            fontWeight: 'bold'
          }}>
            📂 {empresa.rubro}
          </span>
        </div>

        <p style={{ 
          margin: '0 0 15px 0', 
          color: '#aaa', 
          fontSize: '13px',
          lineHeight: '1.6',
          minHeight: '40px'
        }}>
          {empresa.descripcion || 'Sin descripción disponible'}
        </p>

        <div style={{ 
          padding: '15px', 
          backgroundColor: '#1a1a1a', 
          borderRadius: '8px',
          marginBottom: '15px'
        }}>
          <p style={{ margin: '0 0 8px 0', color: '#aaa', fontSize: '12px' }}>
            📍 {empresa.direccion}
          </p>
          <p style={{ margin: '0 0 8px 0', color: '#aaa', fontSize: '12px' }}>
            📞 {empresa.telefono}
          </p>
          <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>
            📧 {empresa.email}
          </p>
        </div>

        <button style={{
          width: '100%',
          padding: '12px',
          backgroundColor: '#ff9800',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span>🛒</span>
          Ver Productos
        </button>
      </div>
    </div>
  );
}

// ============================================
// MODAL: PRODUCTOS DE EMPRESA
// ============================================

function ModalProductos({ empresaId, cerrar }) {
  const [productos, setProductos] = useState([]);
  const [empresa, setEmpresa] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, [empresaId]);

  const cargarDatos = async () => {
    setCargando(true);
    
    const [resEmpresa, resProductos] = await Promise.all([
      api.getMicroempresaInfo(empresaId),
      api.getProductosMicroempresa(empresaId)
    ]);

    if (resEmpresa.success) setEmpresa(resEmpresa.data);
    if (resProductos.success) setProductos(resProductos.data);
    
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
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: '#2d2d2d',
        borderRadius: '15px',
        maxWidth: '1000px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        border: '2px solid #ff9800',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '25px 30px',
          borderBottom: '2px solid #ff9800',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, color: '#ff9800', fontSize: '24px' }}>
              {empresa ? `${empresa.logo} ${empresa.nombre}` : 'Cargando...'}
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '13px' }}>
              Catálogo de productos
            </p>
          </div>
          <button
            onClick={cerrar}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f44336',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          {cargando ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
              <p style={{ color: '#ff9800', fontSize: '18px', margin: 0 }}>
                Cargando productos...
              </p>
            </div>
          ) : productos.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '80px', marginBottom: '20px' }}>📦</div>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '24px', marginBottom: '10px' }}>
                No hay productos disponibles
              </h3>
              <p style={{ margin: 0, color: '#aaa' }}>
                Esta empresa aún no ha agregado productos
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
              {productos.map(producto => (
                <div key={producto.id} style={{
                  backgroundColor: '#1a1a1a',
                  borderRadius: '10px',
                  padding: '20px',
                  border: '1px solid #3d3d3d'
                }}>
                  <h4 style={{ margin: '0 0 10px 0', color: '#fff', fontSize: '18px' }}>
                    {producto.nombre}
                  </h4>
                  <p style={{ margin: '0 0 15px 0', color: '#aaa', fontSize: '13px', minHeight: '40px' }}>
                    {producto.descripcion || 'Sin descripción'}
                  </p>
                  <div style={{ marginBottom: '15px' }}>
                    <p style={{ margin: '0 0 5px 0', color: '#aaa', fontSize: '12px' }}>
                      📦 Stock: <strong style={{ color: producto.cantidad > 0 ? '#4caf50' : '#f44336' }}>
                        {producto.cantidad}
                      </strong>
                    </p>
                    <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>
                      💰 Precio: <strong style={{ color: '#ff9800', fontSize: '18px' }}>
                        Bs {producto.precio}
                      </strong>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// MODAL: PERFIL DEL USUARIO
// ============================================

function ModalPerfil({ usuario, cerrar }) {
  const [datosPerfil, setDatosPerfil] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: ''
  });
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // ✅ Cargar datos completos al abrir el modal
  useEffect(() => {
    cargarDatosUsuario();
  }, []);

  const cargarDatosUsuario = async () => {
    setCargando(true);
    const resultado = await api.getUsuarioInfo(usuario.id);
    
    if (resultado.success) {
      console.log('✅ Datos del usuario cargados:', resultado.data);
      setDatosPerfil({
        nombre: resultado.data.nombre || '',
        apellido: resultado.data.apellido || '',
        email: resultado.data.email || '',
        telefono: resultado.data.telefono || ''
      });
    } else {
      console.error('❌ Error al cargar datos del usuario');
      // Si falla, usar los datos que ya tenemos
      setDatosPerfil({
        nombre: usuario.nombre || '',
        apellido: usuario.apellido || '',
        email: usuario.email || '',
        telefono: usuario.telefono || ''
      });
    }
    
    setCargando(false);
  };

  const guardarPerfil = async () => {
    setGuardando(true);
    setMensaje(null);

    const resultado = await api.updatePerfilUsuario(usuario.id, datosPerfil);

    if (resultado.success) {
      setMensaje({ tipo: 'exito', texto: '✅ Perfil actualizado correctamente' });
      
      // Actualizar localStorage
      const usuarioActualizado = { ...usuario, ...datosPerfil };
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
      setTimeout(() => {
        setMensaje(null);
        window.location.reload();
      }, 2000);
    } else {
      setMensaje({ tipo: 'error', texto: '❌ Error al actualizar perfil' });
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
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div style={{
        backgroundColor: '#2d2d2d',
        borderRadius: '15px',
        maxWidth: '700px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'hidden',
        border: '2px solid #2196f3',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          padding: '25px 30px',
          borderBottom: '2px solid #2196f3',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, color: '#2196f3', fontSize: '24px' }}>
              ⚙️ Mi Perfil
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '13px' }}>
              Gestiona tu información personal
            </p>
          </div>
          <button
            onClick={cerrar}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f44336',
              color: '#fff',
              fontSize: '24px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Mensaje */}
        {mensaje && (
          <div style={{
            margin: '20px 30px 0',
            padding: '12px 15px',
            borderRadius: '8px',
            backgroundColor: mensaje.tipo === 'exito' ? '#1b4d1b' : '#4d1f1f',
            color: mensaje.tipo === 'exito' ? '#4caf50' : '#ff6b6b',
            border: `1px solid ${mensaje.tipo === 'exito' ? '#4caf50' : '#ff6b6b'}`,
            fontSize: '14px'
          }}>
            {mensaje.texto}
          </div>
        )}

        {/* Contenido */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          {cargando ? (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
              <p style={{ color: '#2196f3', fontSize: '18px', margin: 0 }}>
                Cargando información...
              </p>
            </div>
          ) : (
            <>
              <h3 style={{ color: '#2196f3', marginBottom: '20px', fontSize: '18px' }}>
                👤 Información Personal
              </h3>

              <div style={{ display: 'grid', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={datosPerfil.nombre}
                      onChange={(e) => setDatosPerfil({ ...datosPerfil, nombre: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid #444',
                        backgroundColor: '#1a1a1a',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                      Apellido *
                    </label>
                    <input
                      type="text"
                      value={datosPerfil.apellido}
                      onChange={(e) => setDatosPerfil({ ...datosPerfil, apellido: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid #444',
                        backgroundColor: '#1a1a1a',
                        color: '#fff',
                        fontSize: '14px'
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    value={datosPerfil.email}
                    onChange={(e) => setDatosPerfil({ ...datosPerfil, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #444',
                      backgroundColor: '#1a1a1a',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={datosPerfil.telefono}
                    onChange={(e) => setDatosPerfil({ ...datosPerfil, telefono: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #444',
                      backgroundColor: '#1a1a1a',
                      color: '#fff',
                      fontSize: '14px'
                    }}
                    placeholder="Ejemplo: 70123456"
                  />
                </div>
              </div>

              <button
                onClick={guardarPerfil}
                disabled={guardando}
                style={{
                  marginTop: '25px',
                  width: '100%',
                  padding: '14px',
                  background: guardando ? '#666' : 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
                  color: guardando ? '#aaa' : '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: guardando ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  boxShadow: guardando ? 'none' : '0 4px 15px rgba(33,150,243,0.4)'
                }}
              >
                {guardando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardUsuario;