import React, { useState } from 'react';

// Dashboard para Microempresas (Dueños de Tiendas)
function DashboardMicroempresa({ usuario, cerrarSesion }) {
  // Datos simulados de la empresa
  const [miEmpresa] = useState({
    nombre: usuario.nombre,
    email: usuario.email,
    plan: usuario.plan,
    rubro: usuario.rubro,
    ventas: 145,
    productos: 32,
    clientes: 87
  });

  // Productos simulados
  const [productos] = useState([
    { id: 1, nombre: 'Producto A', stock: 45, precio: 25.50 },
    { id: 2, nombre: 'Producto B', stock: 12, precio: 15.00 },
    { id: 3, nombre: 'Producto C', stock: 0, precio: 30.00 },
    { id: 4, nombre: 'Producto D', stock: 78, precio: 10.50 },
  ]);

  // Ventas recientes simuladas
  const [ventasRecientes] = useState([
    { id: 1, cliente: 'Juan Pérez', producto: 'Producto A', monto: 51.00, fecha: '12/01/2026' },
    { id: 2, cliente: 'María López', producto: 'Producto B', monto: 30.00, fecha: '12/01/2026' },
    { id: 3, cliente: 'Carlos Gómez', producto: 'Producto D', monto: 21.00, fecha: '11/01/2026' },
  ]);

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
            <div style={{ fontSize: '40px' }}>🏪</div>
            <div>
              <h1 style={{ margin: 0, color: '#2196f3', fontSize: '24px' }}>
                {miEmpresa.nombre}
              </h1>
              <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>
                Plan: <span style={{ color: miEmpresa.plan === 'premium' ? '#ff9800' : '#666', fontWeight: 'bold' }}>
                  {miEmpresa.plan.toUpperCase()}
                </span> • {miEmpresa.rubro}
              </p>
            </div>
          </div>
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

      {/* Contenido */}
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px' }}>
        
        {/* Estadísticas principales */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
          
          <div style={{
            backgroundColor: '#2d2d2d',
            padding: '25px',
            borderRadius: '10px',
            border: '1px solid #3d3d3d',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Ventas del Mes</p>
                <h2 style={{ margin: '5px 0', color: '#4caf50', fontSize: '36px' }}>
                  {miEmpresa.ventas}
                </h2>
              </div>
              <div style={{ fontSize: '50px' }}>💰</div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#2d2d2d',
            padding: '25px',
            borderRadius: '10px',
            border: '1px solid #3d3d3d',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Productos</p>
                <h2 style={{ margin: '5px 0', color: '#2196f3', fontSize: '36px' }}>
                  {miEmpresa.productos}
                </h2>
              </div>
              <div style={{ fontSize: '50px' }}>📦</div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#2d2d2d',
            padding: '25px',
            borderRadius: '10px',
            border: '1px solid #3d3d3d',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Clientes</p>
                <h2 style={{ margin: '5px 0', color: '#ff9800', fontSize: '36px' }}>
                  {miEmpresa.clientes}
                </h2>
              </div>
              <div style={{ fontSize: '50px' }}>👥</div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#2d2d2d',
            padding: '25px',
            borderRadius: '10px',
            border: '1px solid #3d3d3d',
            boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Stock Bajo</p>
                <h2 style={{ margin: '5px 0', color: '#f44336', fontSize: '36px' }}>
                  {productos.filter(p => p.stock < 15).length}
                </h2>
              </div>
              <div style={{ fontSize: '50px' }}>⚠️</div>
            </div>
          </div>
        </div>

        {/* Grid de 2 columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
          
          {/* Productos con stock bajo */}
          <div style={{
            backgroundColor: '#2d2d2d',
            borderRadius: '10px',
            padding: '20px',
            border: '1px solid #3d3d3d'
          }}>
            <h3 style={{ margin: '0 0 20px 0', color: '#2196f3', borderBottom: '2px solid #2196f3', paddingBottom: '10px' }}>
              📦 Productos en Stock
            </h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {productos.map(p => (
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
                    <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>Bs. {p.precio.toFixed(2)}</p>
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
                    <p style={{ margin: 0, color: '#fff', fontWeight: 'bold', fontSize: '14px' }}>{v.cliente}</p>
                    <p style={{ margin: 0, color: '#4caf50', fontWeight: 'bold', fontSize: '14px' }}>
                      Bs. {v.monto.toFixed(2)}
                    </p>
                  </div>
                  <p style={{ margin: 0, color: '#aaa', fontSize: '12px' }}>{v.producto}</p>
                  <p style={{ margin: '5px 0 0 0', color: '#666', fontSize: '11px' }}>📅 {v.fecha}</p>
                </div>
              ))}
            </div>
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
            <button style={{
              padding: '15px',
              backgroundColor: '#1a1a1a',
              border: '2px solid #2196f3',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '24px' }}>📦</span>
              Gestionar Productos
            </button>

            <button style={{
              padding: '15px',
              backgroundColor: '#1a1a1a',
              border: '2px solid #4caf50',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '24px' }}>💰</span>
              Nueva Venta
            </button>

            <button style={{
              padding: '15px',
              backgroundColor: '#1a1a1a',
              border: '2px solid #ff9800',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '24px' }}>👥</span>
              Ver Clientes
            </button>

            <button style={{
              padding: '15px',
              backgroundColor: '#1a1a1a',
              border: '2px solid #9c27b0',
              borderRadius: '8px',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <span style={{ fontSize: '24px' }}>📊</span>
              Ver Reportes
            </button>
          </div>
        </div>

        {/* Información del plan */}
        {miEmpresa.plan === 'basico' && (
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
                Desbloquea funciones avanzadas: reportes, múltiples usuarios, soporte prioritario
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
              fontSize: '14px'
            }}>
              Mejorar Ahora
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardMicroempresa;