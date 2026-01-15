import React, { useState, useEffect } from 'react';
import ConfiguracionEmpresa from './ConfiguracionEmpresa';
import { api } from '../../services/api';

function DashboardMicroempresa({ usuario, cerrarSesion }) {
  const [cargando, setCargando] = useState(true);
  const [productos, setProductos] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [datosEmpresa, setDatosEmpresa] = useState(usuario); 
  const [estadisticas, setEstadisticas] = useState({
    totalVentas: 0,
    totalProductos: 0,
    totalClientes: 0,
    productosStockBajo: 0
  });

  useEffect(() => {
    cargarDatos();
    cargarDatosCompletos(); 
  }, []);

  const cargarDatos = async () => {
    setCargando(true);
    console.log('📊 Cargando datos de la microempresa:', usuario.id);

    try {
      // Cargar datos en paralelo
      const [resProductos, resVentas, resClientes] = await Promise.all([
        api.getProductosMicroempresa(usuario.id),
        api.getVentasMicroempresa(usuario.id),
        api.getClientesMicroempresa(usuario.id)
      ]);

      console.log('📦 Productos:', resProductos);
      console.log('💰 Ventas:', resVentas);
      console.log('👥 Clientes:', resClientes);

      if (resProductos.success) setProductos(resProductos.data);
      if (resVentas.success) setVentas(resVentas.data);
      if (resClientes.success) setClientes(resClientes.data);

      // Calcular estadísticas
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
      
      // Actualizar también el localStorage con los datos completos
      const usuarioActualizado = { ...usuario, ...resultado.data };
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
    }
  };
  // Obtener las últimas 5 ventas
  const ventasRecientes = ventas.slice(0, 5);

  // Obtener productos ordenados por stock (los de menor stock primero)
  const productosOrdenados = [...productos].sort((a, b) => a.stock - b.stock);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#1a1a1a' }}>
      {/* Header */}
      <div style={{
        backgroundColor: '#2d2d2d',
        padding: '20px 30px',
        borderBottom: '2px solid #2196f3',
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '40px' }}>{usuario.logo || '🏪'}</div>
            <div>
              <h1 style={{ margin: 0, color: '#2196f3', fontSize: '24px' }}>
                {usuario.nombre}
              </h1>
              <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>
                Plan: <span style={{ color: usuario.plan === 'premium' ? '#ff9800' : '#666', fontWeight: 'bold' }}>
                  {usuario.plan?.toUpperCase() || 'BÁSICO'}
                </span> • {usuario.rubro || 'Sin rubro'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setMostrarConfiguracion(true)}
            style={{
              padding: '10px 25px',
              backgroundColor: '#2196f3',
              color: '#fff',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 2px 10px rgba(33,150,243,0.3)',
              marginRight: '10px'
            }}
          >
            ⚙️ Configuración
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
              fontWeight: 'bold',
              boxShadow: '0 2px 10px rgba(255,152,0,0.3)'
            }}
          >
            🚪 Cerrar Sesión
          </button>
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
            {/* Estadísticas principales */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
              
              <StatCard
                titulo="Ventas Totales"
                valor={estadisticas.totalVentas}
                icono="💰"
                color="#4caf50"
              />

              <StatCard
                titulo="Productos"
                valor={estadisticas.totalProductos}
                icono="📦"
                color="#2196f3"
              />

              <StatCard
                titulo="Clientes"
                valor={estadisticas.totalClientes}
                icono="👥"
                color="#ff9800"
              />

              <StatCard
                titulo="Stock Bajo"
                valor={estadisticas.productosStockBajo}
                icono="⚠️"
                color="#f44336"
              />
            </div>

            {/* Grid de 2 columnas */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              
              {/* Productos en stock */}
              <div style={{
                backgroundColor: '#2d2d2d',
                borderRadius: '10px',
                padding: '20px',
                border: '1px solid #3d3d3d'
              }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#2196f3', borderBottom: '2px solid #2196f3', paddingBottom: '10px' }}>
                  📦 Productos en Stock
                </h3>
                
                {productos.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                    <div style={{ fontSize: '50px', marginBottom: '15px', opacity: 0.5 }}>📭</div>
                    <p style={{ margin: 0 }}>No tienes productos registrados</p>
                    <button style={{ marginTop: '15px', padding: '8px 20px', backgroundColor: '#2196f3', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Agregar Productos
                    </button>
                  </div>
                ) : (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {productosOrdenados.slice(0, 8).map(p => (
                      <div key={p.id} style={{
                        padding: '12px',
                        marginBottom: '10px',
                        backgroundColor: '#1a1a1a',
                        borderRadius: '5px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderLeft: `4px solid ${p.stock === 0 ? '#f44336' : p.stock < 15 ? '#ff9800' : '#4caf50'}`
                      }}>
                        <div>
                          <p style={{ margin: 0, color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>{p.nombre}</p>
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
              <div style={{
                backgroundColor: '#2d2d2d',
                borderRadius: '10px',
                padding: '20px',
                border: '1px solid #3d3d3d'
              }}>
                <h3 style={{ margin: '0 0 20px 0', color: '#2196f3', borderBottom: '2px solid #2196f3', paddingBottom: '10px' }}>
                  💰 Ventas Recientes
                </h3>
                
                {ventas.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#aaa' }}>
                    <div style={{ fontSize: '50px', marginBottom: '15px', opacity: 0.5 }}>📊</div>
                    <p style={{ margin: 0 }}>No hay ventas registradas</p>
                    <button style={{ marginTop: '15px', padding: '8px 20px', backgroundColor: '#4caf50', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
                      Registrar Venta
                    </button>
                  </div>
                ) : (
                  <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {ventasRecientes.map(v => (
                      <div key={v.id} style={{
                        padding: '12px',
                        marginBottom: '10px',
                        backgroundColor: '#1a1a1a',
                        borderRadius: '5px',
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
            <div style={{
              backgroundColor: '#2d2d2d',
              borderRadius: '10px',
              padding: '20px',
              border: '1px solid #3d3d3d'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#2196f3', borderBottom: '2px solid #2196f3', paddingBottom: '10px' }}>
                ⚡ Acciones Rápidas
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
                <ActionButton icono="📦" texto="Gestionar Productos" color="#2196f3" />
                <ActionButton icono="💰" texto="Nueva Venta" color="#4caf50" />
                <ActionButton icono="👥" texto="Ver Clientes" color="#ff9800" />
                <ActionButton icono="📊" texto="Ver Reportes" color="#9c27b0" />
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
                <button style={{
                  padding: '12px 30px',
                  backgroundColor: '#ff9800',
                  color: '#000',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  boxShadow: '0 2px 10px rgba(255,152,0,0.3)'
                }}>
                  Mejorar Ahora
                </button>
              </div>
            )}
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
          </>
        )}
      </div>
    </div>
  );
}

// Componente de tarjeta de estadística
function StatCard({ titulo, valor, icono, color }) {
  return (
    <div style={{
      backgroundColor: '#2d2d2d',
      padding: '25px',
      borderRadius: '10px',
      border: '1px solid #3d3d3d',
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>{titulo}</p>
          <h2 style={{ margin: '5px 0', color, fontSize: '36px', fontWeight: 'bold' }}>
            {valor}
          </h2>
        </div>
        <div style={{ fontSize: '50px' }}>{icono}</div>
      </div>
    </div>
  );
}

// Componente de botón de acción
function ActionButton({ icono, texto, color }) {
  return (
    <button style={{
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
      e.target.style.backgroundColor = color;
      e.target.style.transform = 'translateY(-2px)';
    }}
    onMouseLeave={(e) => {
      e.target.style.backgroundColor = '#1a1a1a';
      e.target.style.transform = 'translateY(0)';
    }}
    >
      <span style={{ fontSize: '24px' }}>{icono}</span>
      {texto}
    </button>
  );
}

export default DashboardMicroempresa;