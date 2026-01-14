import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

function DetalleMicroempresaModal({ microId, cerrar }) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [pestanaActiva, setPestanaActiva] = useState('resumen');

  useEffect(() => {
    cargarDatos();
  }, [microId]);

  const cargarDatos = async () => {
    setCargando(true);
    const resultado = await api.getMicroempresaDetalleCompleto(microId);
    
    if (resultado.success) {
      setDatos(resultado.data);
    } else {
      alert('Error al cargar detalles de la microempresa');
      cerrar();
    }
    
    setCargando(false);
  };

  if (cargando) {
    return (
      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
          <p style={{ color: '#ff9800', fontSize: '18px' }}>Cargando detalles...</p>
        </div>
      </div>
    );
  }

  if (!datos) return null;

  // Calcular estadísticas
  const stats = {
    totalProductos: datos.productos?.length || 0,
    totalVentas: datos.ventas?.length || 0,
    totalClientes: datos.clientes?.length || 0,
    totalProveedores: datos.proveedores?.length || 0,
    productosActivos: datos.productos?.filter(p => p.activo).length || 0,
    stockTotal: datos.productos?.reduce((sum, p) => sum + (p.stock || 0), 0) || 0,
    ventasTotales: datos.ventas?.reduce((sum, v) => sum + parseFloat(v.total || 0), 0) || 0
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px', overflow: 'auto' }}>
      <div style={{ backgroundColor: '#2d2d2d', borderRadius: '15px', maxWidth: '1200px', width: '100%', maxHeight: '90vh', overflow: 'hidden', border: '2px solid #ff9800', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{ padding: '25px 30px', borderBottom: '2px solid #ff9800', backgroundColor: '#1a1a1a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
              <div style={{ fontSize: '50px' }}>{datos.logo || '🏪'}</div>
              <div>
                <h2 style={{ margin: 0, color: '#ff9800', fontSize: '24px' }}>{datos.nombre}</h2>
                <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '14px' }}>
                  {datos.rubro || 'Sin rubro'} • 
                  <span style={{ 
                    marginLeft: '10px',
                    padding: '3px 10px', 
                    borderRadius: '12px', 
                    backgroundColor: datos.plan === 'premium' ? '#ffb74d' : '#666',
                    color: datos.plan === 'premium' ? '#000' : '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {datos.plan === 'premium' ? '⭐ PREMIUM' : '📦 BÁSICO'}
                  </span>
                </p>
              </div>
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
        </div>

        {/* Pestañas */}
        <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #3d3d3d', backgroundColor: '#1a1a1a', padding: '0 30px' }}>
          {[
            { id: 'resumen', icono: '📊', texto: 'Resumen' },
            { id: 'productos', icono: '📦', texto: 'Productos', badge: stats.totalProductos },
            { id: 'ventas', icono: '💰', texto: 'Ventas', badge: stats.totalVentas },
            { id: 'clientes', icono: '👥', texto: 'Clientes', badge: stats.totalClientes },
            { id: 'proveedores', icono: '🏢', texto: 'Proveedores', badge: stats.totalProveedores }
          ].map(pestana => (
            <button
              key={pestana.id}
              onClick={() => setPestanaActiva(pestana.id)}
              style={{
                padding: '15px 20px',
                backgroundColor: pestanaActiva === pestana.id ? '#ff9800' : 'transparent',
                color: pestanaActiva === pestana.id ? '#000' : '#fff',
                border: 'none',
                borderBottom: pestanaActiva === pestana.id ? '3px solid #ff9800' : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                position: 'relative',
                transition: 'all 0.3s ease'
              }}
            >
              {pestana.icono} {pestana.texto}
              {pestana.badge !== undefined && pestana.badge > 0 && (
                <span style={{
                  marginLeft: '8px',
                  padding: '2px 8px',
                  borderRadius: '10px',
                  backgroundColor: pestanaActiva === pestana.id ? '#000' : '#ff9800',
                  color: pestanaActiva === pestana.id ? '#ff9800' : '#000',
                  fontSize: '11px',
                  fontWeight: 'bold'
                }}>
                  {pestana.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '30px' }}>
          {pestanaActiva === 'resumen' && <TabResumen datos={datos} stats={stats} />}
          {pestanaActiva === 'productos' && <TabProductos productos={datos.productos} />}
          {pestanaActiva === 'ventas' && <TabVentas ventas={datos.ventas} />}
          {pestanaActiva === 'clientes' && <TabClientes clientes={datos.clientes} />}
          {pestanaActiva === 'proveedores' && <TabProveedores proveedores={datos.proveedores} />}
        </div>
      </div>
    </div>
  );
}

// ============================================
// COMPONENTES DE PESTAÑAS
// ============================================

function TabResumen({ datos, stats }) {
  return (
    <div>
      <h3 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '20px' }}>📊 Resumen General</h3>
      
      {/* Tarjetas de estadísticas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
        <MiniStatCard titulo="Productos" valor={stats.totalProductos} icono="📦" color="#2196f3" />
        <MiniStatCard titulo="Ventas" valor={stats.totalVentas} icono="💰" color="#4caf50" />
        <MiniStatCard titulo="Clientes" valor={stats.totalClientes} icono="👥" color="#ff9800" />
        <MiniStatCard titulo="Proveedores" valor={stats.totalProveedores} icono="🏢" color="#9c27b0" />
        <MiniStatCard titulo="Stock Total" valor={stats.stockTotal} icono="📊" color="#00bcd4" />
        <MiniStatCard titulo="Ventas Totales" valor={`Bs ${stats.ventasTotales.toFixed(2)}`} icono="💵" color="#4caf50" />
      </div>

      {/* Información de la empresa */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <InfoSection titulo="📋 Datos de la Empresa">
          <InfoRow label="Email" value={datos.email} />
          <InfoRow label="Teléfono" value={datos.telefono || 'No registrado'} />
          <InfoRow label="Dirección" value={datos.direccion || 'No registrada'} />
          <InfoRow label="NIT" value={datos.nit} />
          <InfoRow label="Fecha de Registro" value={new Date(datos.fecha_registro).toLocaleDateString()} />
          <InfoRow label="Estado" value={datos.activo ? '✅ Activa' : '❌ Inactiva'} />
        </InfoSection>

        <InfoSection titulo="⚡ Actividad Reciente">
          <div style={{ padding: '15px', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '10px' }}>
            <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Última venta</p>
            <p style={{ margin: '5px 0 0 0', color: '#fff', fontSize: '16px', fontWeight: 'bold' }}>
              {stats.totalVentas > 0 ? 'Hoy' : 'Sin ventas'}
            </p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#1a1a1a', borderRadius: '8px', marginBottom: '10px' }}>
            <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Productos activos</p>
            <p style={{ margin: '5px 0 0 0', color: '#4caf50', fontSize: '16px', fontWeight: 'bold' }}>
              {stats.productosActivos} de {stats.totalProductos}
            </p>
          </div>
          <div style={{ padding: '15px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
            <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Plan actual</p>
            <p style={{ margin: '5px 0 0 0', color: datos.plan === 'premium' ? '#ffb74d' : '#666', fontSize: '16px', fontWeight: 'bold' }}>
              {datos.plan === 'premium' ? '⭐ Premium' : '📦 Básico'}
            </p>
          </div>
        </InfoSection>
      </div>
    </div>
  );
}

function TabProductos({ productos }) {
  if (!productos || productos.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.5 }}>📦</div>
        <p style={{ color: '#aaa', fontSize: '18px' }}>Esta microempresa no tiene productos registrados</p>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '20px' }}>📦 Productos ({productos.length})</h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ff9800' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Nombre</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Categoría</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#ff9800', fontSize: '13px' }}>Stock</th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#ff9800', fontSize: '13px' }}>Precio</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#ff9800', fontSize: '13px' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #3d3d3d' }}>
                <td style={{ padding: '12px', color: '#fff', fontSize: '14px' }}>{p.nombre}</td>
                <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>{p.categoria || 'Sin categoría'}</td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    backgroundColor: p.stock < p.stock_minimo ? '#f44336' : '#4caf50',
                    color: '#fff',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {p.stock}
                  </span>
                </td>
                <td style={{ padding: '12px', textAlign: 'right', color: '#4caf50', fontSize: '14px', fontWeight: 'bold' }}>
                  Bs {parseFloat(p.precio_venta).toFixed(2)}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    backgroundColor: p.activo ? '#4caf50' : '#666',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {p.activo ? '✓ Activo' : '✗ Inactivo'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabVentas({ ventas }) {
  if (!ventas || ventas.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.5 }}>💰</div>
        <p style={{ color: '#aaa', fontSize: '18px' }}>Esta microempresa no tiene ventas registradas</p>
      </div>
    );
  }

  const ventasRecientes = ventas.slice(0, 10);

  return (
    <div>
      <h3 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '20px' }}>💰 Últimas Ventas ({ventas.length} totales)</h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #ff9800' }}>
              <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>N° Venta</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Cliente</th>
              <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Fecha</th>
              <th style={{ padding: '12px', textAlign: 'right', color: '#ff9800', fontSize: '13px' }}>Total</th>
              <th style={{ padding: '12px', textAlign: 'center', color: '#ff9800', fontSize: '13px' }}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {ventasRecientes.map(v => (
              <tr key={v.id} style={{ borderBottom: '1px solid #3d3d3d' }}>
                <td style={{ padding: '12px', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>{v.numero_venta}</td>
                <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>{v.cliente_nombre || 'Cliente genérico'}</td>
                <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>
                  {new Date(v.fecha_venta).toLocaleDateString()}
                </td>
                <td style={{ padding: '12px', textAlign: 'right', color: '#4caf50', fontSize: '14px', fontWeight: 'bold' }}>
                  Bs {parseFloat(v.total).toFixed(2)}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <span style={{ 
                    padding: '4px 10px', 
                    borderRadius: '12px', 
                    backgroundColor: v.estado === 'pagado' ? '#4caf50' : v.estado === 'pendiente' ? '#ff9800' : '#666',
                    color: '#fff',
                    fontSize: '11px',
                    fontWeight: 'bold'
                  }}>
                    {v.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabClientes({ clientes }) {
  if (!clientes || clientes.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.5 }}>👥</div>
        <p style={{ color: '#aaa', fontSize: '18px' }}>Esta microempresa no tiene clientes registrados</p>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '20px' }}>👥 Clientes ({clientes.length})</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
        {clientes.map(c => (
          <div key={c.id} style={{ padding: '15px', backgroundColor: '#1a1a1a', borderRadius: '10px', border: '1px solid #3d3d3d' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: '#ff9800', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                👤
              </div>
              <div>
                <p style={{ margin: 0, color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>
                  {c.nombre} {c.apellido || ''}
                </p>
                <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>{c.email || 'Sin email'}</p>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>
              <p style={{ margin: '5px 0' }}>📞 {c.telefono}</p>
              {c.ci_nit && <p style={{ margin: '5px 0' }}>🆔 {c.ci_nit}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabProveedores({ proveedores }) {
  if (!proveedores || proveedores.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.5 }}>🏢</div>
        <p style={{ color: '#aaa', fontSize: '18px' }}>Esta microempresa no tiene proveedores registrados</p>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '20px' }}>🏢 Proveedores ({proveedores.length})</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '15px' }}>
        {proveedores.map(p => (
          <div key={p.id} style={{ padding: '15px', backgroundColor: '#1a1a1a', borderRadius: '10px', border: '1px solid #3d3d3d' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '50%', 
                backgroundColor: '#2196f3', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🏢
              </div>
              <div>
                <p style={{ margin: 0, color: '#fff', fontWeight: 'bold', fontSize: '15px' }}>{p.nombre}</p>
                <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>{p.email || 'Sin email'}</p>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#aaa' }}>
              <p style={{ margin: '5px 0' }}>📞 {p.telefono}</p>
              {p.nit && <p style={{ margin: '5px 0' }}>🆔 NIT: {p.nit}</p>}
              {p.direccion && <p style={{ margin: '5px 0' }}>📍 {p.direccion}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

function MiniStatCard({ titulo, valor, icono, color }) {
  return (
    <div style={{ padding: '15px', backgroundColor: '#1a1a1a', borderRadius: '10px', border: '1px solid #3d3d3d' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>{titulo}</p>
          <h3 style={{ margin: '5px 0 0 0', color, fontSize: '24px', fontWeight: 'bold' }}>{valor}</h3>
        </div>
        <div style={{ fontSize: '35px', opacity: 0.7 }}>{icono}</div>
      </div>
    </div>
  );
}

function InfoSection({ titulo, children }) {
  return (
    <div style={{ backgroundColor: '#1a1a1a', padding: '20px', borderRadius: '10px', border: '1px solid #3d3d3d' }}>
      <h4 style={{ margin: '0 0 15px 0', color: '#ff9800', fontSize: '16px', borderBottom: '2px solid #ff9800', paddingBottom: '8px' }}>
        {titulo}
      </h4>
      {children}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2d2d2d' }}>
      <span style={{ color: '#aaa', fontSize: '13px' }}>{label}:</span>
      <span style={{ color: '#fff', fontSize: '13px', fontWeight: 'bold' }}>{value}</span>
    </div>
  );
}

export default DetalleMicroempresaModal;