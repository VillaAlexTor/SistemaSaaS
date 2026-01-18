import React, { useState, useEffect } from 'react';
import ConfiguracionEmpresa from './ConfiguracionEmpresa';
import VistaEmpleados from './VistaEmpleados';
import { api } from '../../services/api';

function DashboardMicroempresa({ usuario, cerrarSesion }) {
  const [vistaActual, setVistaActual] = useState('inicio'); 
  const [cargando, setCargando] = useState(true);
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [datosEmpresa, setDatosEmpresa] = useState(usuario);
  
  // ✅ ESTADOS PARA CONTADORES EN TIEMPO REAL (como el admin)
  const [contadoresEmpleados, setContadoresEmpleados] = useState({
    activos: 0,
    eliminados: 0
  });
  
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    totalProductos: 0,
    totalClientes: 0,
    productosStockBajo: 0
  });

  useEffect(() => {
    cargarDatos();
    cargarDatosCompletos();
    cargarContadoresEmpleados(); // ✅ CARGAR CONTADORES AL INICIO
  }, []);

  // ✅ FUNCIÓN PARA CARGAR CONTADORES DE EMPLEADOS EN TIEMPO REAL
  const cargarContadoresEmpleados = async () => {
    const [activos, eliminados] = await Promise.all([
      api.getEmpleados(usuario.id, false),
      api.getEmpleados(usuario.id, true)
    ]);
    
    setContadoresEmpleados({
      activos: activos.success ? activos.data.length : 0,
      eliminados: eliminados.success ? eliminados.data.length : 0
    });
  };

  const cargarDatos = async () => {
    setCargando(true);
    console.log('📊 Cargando datos de la microempresa:', usuario.id);

    try {
      const [resProductos, resVentas, resClientes] = await Promise.all([
        api.getProductosMicroempresa(usuario.id),
        api.getVentasMicroempresa(usuario.id),
        api.getClientesMicroempresa(usuario.id)
      ]);

      if (resProductos.success) setProductos(resProductos.data);
      if (resVentas.success) setVentas(resVentas.data);
      if (resClientes.success) setClientes(resClientes.data);

      const productosStockBajo = resProductos.success 
        ? resProductos.data.filter(p => p.stock < 15).length 
        : 0;

      setEstadisticas({
        totalVentas: resVentas.success ? resVentas.data.length : 0,
        totalProductos: resProductos.success ? resProductos.data.length : 0,
        totalClientes: resClientes.success ? resClientes.data.length : 0,
        productosStockBajo
      });

    } catch (error) {
      console.error('❌ Error al cargar datos:', error);
    }

    setCargando(false);
  };

  const cargarDatosCompletos = async () => {
    const resultado = await api.getMicroempresaInfo(usuario.id);
    
    if (resultado.success) {
      console.log('📋 Datos completos de la empresa:', resultado.data);
      setDatosEmpresa(resultado.data);
      
      const usuarioActualizado = { ...usuario, ...resultado.data };
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    }
  };

  const ventasRecientes = ventas.slice(0, 5);
  const productosOrdenados = [...productos].sort((a, b) => a.stock - b.stock);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      {/* Header - DISEÑO IDÉNTICO AL ADMIN */}
      <div style={{ backgroundColor: '#2d2d2d', padding: '15px 30px', boxShadow: '0 2px 10px rgba(0,0,0,0.5)', borderBottom: '2px solid #2196f3' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '30px' }}>{usuario.logo || '🏪'}</div>
            <div>
              <h2 style={{ margin: 0, fontSize: '20px', color: '#2196f3' }}>
                {usuario.nombre}
              </h2>
              <p style={{ margin: 0, fontSize: '12px', color: '#aaa' }}>
                Plan: <span style={{ color: usuario.plan === 'premium' ? '#ff9800' : '#666', fontWeight: 'bold' }}>
                  {usuario.plan?.toUpperCase() || 'BÁSICO'}
                </span> • {usuario.rubro || 'Sin rubro'}
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 15px', backgroundColor: '#3d3d3d', borderRadius: '8px', border: '1px solid #444' }}>
              <div style={{ width: '35px', height: '35px', backgroundColor: '#2196f3', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>
                👤
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>{usuario.nombre}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#2196f3' }}>Microempresa</p>
              </div>
            </div>
            <button onClick={cerrarSesion} style={{ padding: '8px 15px', backgroundColor: '#ff9800', color: '#000', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', boxShadow: '0 2px 10px rgba(255,152,0,0.3)' }}>
              🚪 Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* ✅ NAVEGACIÓN CON BADGE EN TIEMPO REAL (IDÉNTICO AL ADMIN) */}
      <div style={{ backgroundColor: '#2d2d2d', padding: '15px 30px', borderBottom: '1px solid #3d3d3d' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[
            { id: 'inicio', icono: '🏠', texto: 'Inicio' },
            { id: 'productos', icono: '📦', texto: 'Productos' },
            { id: 'ventas', icono: '💰', texto: 'Ventas' },
            { id: 'empleados', icono: '👔', texto: 'Clientes', badge: contadoresEmpleados.eliminados },
            { id: 'clientes', icono: '🛒', texto: 'Usuarios' },
            { id: 'reportes', icono: '📊', texto: 'Reportes' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setVistaActual(item.id)}
              style={{
                padding: '10px 20px',
                backgroundColor: vistaActual === item.id ? '#2196f3' : 'transparent',
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
            <p style={{ color: '#2196f3', fontSize: '18px', margin: 0 }}>Cargando datos de tu negocio...</p>
          </div>
        ) : (
          <>
            {/* ✅ VISTA INICIO (Dashboard Principal) */}
            {vistaActual === 'inicio' && (
              <>
                <h2 style={{ color: '#2196f3', marginBottom: '20px', fontSize: '28px' }}>📊 Estadísticas Generales</h2>
                
                {/* Estadísticas principales */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                  <StatCard titulo="Ventas Totales" valor={estadisticas.totalVentas} icono="💰" color="#4caf50" />
                  <StatCard titulo="Productos" valor={estadisticas.totalProductos} icono="📦" color="#2196f3" />
                  <StatCard titulo="Clientes" valor={estadisticas.totalClientes} icono="👥" color="#ff9800" />
                  <StatCard titulo="Stock Bajo" valor={estadisticas.productosStockBajo} icono="⚠️" color="#f44336" />
                </div>

                {/* Grid de 2 columnas */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                  
                  {/* Productos en stock */}
                  <div style={{ backgroundColor: '#2d2d2d', borderRadius: '10px', padding: '20px', border: '1px solid #3d3d3d', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#2196f3', borderBottom: '2px solid #2196f3', paddingBottom: '10px', fontSize: '18px' }}>
                      📦 Productos en Stock
                    </h3>
                    
                    {productos.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                        <div style={{ fontSize: '50px', marginBottom: '15px', opacity: 0.5 }}>📭</div>
                        <p style={{ margin: 0, fontSize: '14px' }}>No tienes productos registrados</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                        {productosOrdenados.slice(0, 8).map(p => (
                          <div key={p.id} style={{
                            padding: '12px',
                            backgroundColor: '#1a1a1a',
                            borderRadius: '8px',
                            borderLeft: `4px solid ${p.stock === 0 ? '#f44336' : p.stock < 15 ? '#ff9800' : '#4caf50'}`,
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div>
                              <p style={{ margin: '0 0 5px 0', color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>{p.nombre}</p>
                              <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>
                                Bs. {p.precio_venta ? parseFloat(p.precio_venta).toFixed(2) : '0.00'}
                              </p>
                            </div>
                            <div style={{
                              padding: '5px 15px',
                              backgroundColor: p.stock === 0 ? '#f44336' : p.stock < 15 ? '#ff9800' : '#4caf50',
                              borderRadius: '15px',
                              color: '#fff',
                              fontWeight: 'bold',
                              fontSize: '12px'
                            }}>
                              {p.stock === 0 ? 'Sin Stock' : `Stock: ${p.stock}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Ventas recientes */}
                  <div style={{ backgroundColor: '#2d2d2d', borderRadius: '10px', padding: '20px', border: '1px solid #3d3d3d', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                    <h3 style={{ margin: '0 0 20px 0', color: '#2196f3', borderBottom: '2px solid #2196f3', paddingBottom: '10px', fontSize: '18px' }}>
                      💰 Ventas Recientes
                    </h3>
                    
                    {ventas.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                        <div style={{ fontSize: '50px', marginBottom: '15px', opacity: 0.5 }}>📊</div>
                        <p style={{ margin: 0, fontSize: '14px' }}>No hay ventas registradas</p>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '300px', overflowY: 'auto' }}>
                        {ventasRecientes.map(v => (
                          <div key={v.id} style={{
                            padding: '12px',
                            backgroundColor: '#1a1a1a',
                            borderRadius: '8px',
                            borderLeft: '4px solid #4caf50'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                              <p style={{ margin: 0, color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>
                                {v.numero_venta || `Venta #${v.id}`}
                              </p>
                              <p style={{ margin: 0, color: '#4caf50', fontWeight: 'bold', fontSize: '14px' }}>
                                Bs. {parseFloat(v.total || 0).toFixed(2)}
                              </p>
                            </div>
                            <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>
                              {v.cliente_nombre || 'Cliente genérico'}
                            </p>
                            <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '11px' }}>
                              📅 {new Date(v.fecha_venta).toLocaleDateString('es-BO')}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Acciones rápidas */}
                <div style={{ backgroundColor: '#2d2d2d', borderRadius: '10px', padding: '20px', border: '1px solid #3d3d3d', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                  <h3 style={{ margin: '0 0 20px 0', color: '#2196f3', borderBottom: '2px solid #2196f3', paddingBottom: '10px', fontSize: '18px' }}>
                    ⚡ Acciones Rápidas
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                    <ActionButton icono="📦" texto="Gestionar Productos" color="#2196f3" onClick={() => setVistaActual('productos')} />
                    <ActionButton icono="💰" texto="Nueva Venta" color="#4caf50" onClick={() => setVistaActual('ventas')} />
                    <ActionButton icono="👥" texto="Ver Clientes" color="#ff9800" onClick={() => setVistaActual('empleados')} />
                    <ActionButton icono="📊" texto="Ver Reportes" color="#9c27b0" onClick={() => setVistaActual('reportes')} />
                  </div>
                </div>

                {/* Información del plan */}
                {usuario.plan === 'basico' && (
                  <div style={{
                    marginTop: '20px',
                    backgroundColor: '#2d2d10',
                    border: '2px solid #ff9800',
                    borderRadius: '10px',
                    padding: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h3 style={{ margin: 0, color: '#ff9800', fontSize: '18px' }}>
                        ⭐ Mejora a Plan Premium
                      </h3>
                      <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '13px' }}>
                        Desbloquea funciones avanzadas: reportes detallados, múltiples usuarios, soporte prioritario
                      </p>
                    </div>
                    <button 
                      onClick={() => setMostrarConfiguracion(true)}
                      style={{
                        padding: '12px 30px',
                        backgroundColor: '#ff9800',
                        color: '#000',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        fontSize: '14px',
                        boxShadow: '0 2px 10px rgba(255,152,0,0.3)'
                      }}
                    >
                      Mejorar Ahora
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ✅ VISTA EMPLEADOS - CON CALLBACK PARA ACTUALIZAR CONTADORES */}
            {vistaActual === 'empleados' && (
              <VistaEmpleados 
                microempresaId={usuario.id}
                onActualizarContadores={setContadoresEmpleados}
              />
            )}

            {/* OTRAS VISTAS (placeholder) */}
            {vistaActual === 'productos' && (
              <div style={{ backgroundColor: '#2d2d2d', padding: '40px', borderRadius: '10px', textAlign: 'center', border: '1px solid #3d3d3d' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>📦</div>
                <h2 style={{ color: '#2196f3', margin: 0 }}>Gestión de Productos</h2>
                <p style={{ color: '#aaa', marginTop: '10px' }}>En desarrollo...</p>
              </div>
            )}

            {vistaActual === 'ventas' && (
              <div style={{ backgroundColor: '#2d2d2d', padding: '40px', borderRadius: '10px', textAlign: 'center', border: '1px solid #3d3d3d' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>💰</div>
                <h2 style={{ color: '#4caf50', margin: 0 }}>Gestión de Ventas</h2>
                <p style={{ color: '#aaa', marginTop: '10px' }}>En desarrollo...</p>
              </div>
            )}

            {vistaActual === 'clientes' && (
              <div style={{ backgroundColor: '#2d2d2d', padding: '40px', borderRadius: '10px', textAlign: 'center', border: '1px solid #3d3d3d' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>🛒</div>
                <h2 style={{ color: '#ff9800', margin: 0 }}>Gestión de Usuarios</h2>
                <p style={{ color: '#aaa', marginTop: '10px' }}>En desarrollo...</p>
              </div>
            )}

            {vistaActual === 'reportes' && (
              <div style={{ backgroundColor: '#2d2d2d', padding: '40px', borderRadius: '10px', textAlign: 'center', border: '1px solid #3d3d3d' }}>
                <div style={{ fontSize: '60px', marginBottom: '20px' }}>📊</div>
                <h2 style={{ color: '#9c27b0', margin: 0 }}>Reportes</h2>
                <p style={{ color: '#aaa', marginTop: '10px' }}>En desarrollo...</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal de configuración */}
      {mostrarConfiguracion && (
        <ConfiguracionEmpresa 
          usuario={datosEmpresa} 
          cerrar={() => setMostrarConfiguracion(false)}
          onActualizar={(nuevosDatos) => {
            console.log('✅ Datos actualizados:', nuevosDatos);
            const usuarioActualizado = { ...usuario, ...nuevosDatos };
            localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
            window.location.reload();
          }}
        />
      )}
    </div>
  );
}

// Componente de tarjeta de estadística
function StatCard({ titulo, valor, icono, color }) {
  return (
    <div style={{
      backgroundColor: '#2d2d2d',
      padding: '20px',
      borderRadius: '10px',
      border: '1px solid #3d3d3d',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, color: '#aaa', fontSize: '13px', marginBottom: '5px' }}>{titulo}</p>
          <h2 style={{ margin: 0, color, fontSize: '32px', fontWeight: 'bold' }}>
            {valor}
          </h2>
        </div>
        <div style={{ fontSize: '45px', opacity: 0.8 }}>{icono}</div>
      </div>
    </div>
  );
}

// Componente de botón de acción
function ActionButton({ icono, texto, color, onClick }) {
  return (
    <button 
      onClick={onClick}
      style={{
        padding: '15px',
        backgroundColor: '#1a1a1a',
        border: `2px solid ${color}`,
        borderRadius: '8px',
        color: '#fff',
        cursor: 'pointer',
        fontWeight: 'bold',
        fontSize: '14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = color;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = '#1a1a1a';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <span style={{ fontSize: '24px' }}>{icono}</span>
      {texto}
    </button>
  );
}

export default DashboardMicroempresa;