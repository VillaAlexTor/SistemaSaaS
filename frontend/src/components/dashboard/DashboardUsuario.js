import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';  // ✅ Importar API REAL

// Dashboard para Usuarios Finales (Compradores) - Conectado a API
function DashboardUsuario({ usuario, cerrarSesion }) {
  const [empresas, setEmpresas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRubro, setFiltroRubro] = useState('todos');

  // ✅ Cargar empresas desde la API al montar el componente
  useEffect(() => {
    cargarEmpresas();
  }, []);

  const cargarEmpresas = async () => {
    setCargando(true);
    const resultado = await api.getMicroempresas();
    
    console.log('📥 Empresas cargadas en DashboardUsuario:', resultado);
    
    if (resultado.success) {
      // Filtrar solo empresas activas
      setEmpresas(resultado.data.filter(e => e.activo));
    } else {
      console.error('Error al cargar empresas');
      setEmpresas([]);
    }
    
    setCargando(false);
  };

  // Obtener rubros únicos de las empresas cargadas
  const rubros = [...new Set(empresas.map(e => e.rubro).filter(Boolean))];

  // Filtrar empresas según búsqueda y rubro
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
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ fontSize: '40px' }}>🛒</div>
            <div>
              <h1 style={{ margin: 0, color: '#ff9800', fontSize: '24px' }}>
                Catálogo de Empresas
              </h1>
              <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>
                Bienvenido, {usuario.nombre}
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
                {/* Buscador */}
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

                {/* Filtro por rubro */}
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

              {/* Contador de resultados */}
              <p style={{ marginTop: '15px', color: '#aaa', fontSize: '13px', textAlign: 'center' }}>
                Mostrando <strong style={{ color: '#ff9800' }}>{empresasFiltradas.length}</strong> de <strong>{empresas.length}</strong> empresas
              </p>
            </div>

            {/* Grid de empresas */}
            {empresasFiltradas.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
                {empresasFiltradas.map(empresa => (
                  <div key={empresa.id} style={{
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
                ))}
              </div>
            ) : (
              /* Mensaje si no hay resultados */
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
    </div>
  );
}

export default DashboardUsuario;