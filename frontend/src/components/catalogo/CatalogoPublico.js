import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

function CatalogoPublico({ cambiarVista }) {
  const [empresas, setEmpresas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroRubro, setFiltroRubro] = useState('todos');

  useEffect(() => {
    cargarEmpresas();
  }, []);

  const cargarEmpresas = async () => {
    setCargando(true);
    const resultado = await api.getMicroempresas();
    
    if (resultado.success) {
      setEmpresas(resultado.data);
    } else {
      console.error('Error al cargar empresas');
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
      <div style={{ backgroundColor: '#2d2d2d', padding: '20px 30px', borderBottom: '2px solid #ff9800', boxShadow: '0 2px 10px rgba(0,0,0,0.5)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div onClick={() => cambiarVista('home')} style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer' }}>
            <div style={{ fontSize: '40px' }}>🏪</div>
            <div>
              <h1 style={{ margin: 0, color: '#ff9800', fontSize: '24px' }}>Catálogo de Empresas</h1>
              <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Explora nuestras microempresas asociadas</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <button
              onClick={() => cambiarVista('registerUsuario')}
              style={{ padding: '10px 25px', backgroundColor: 'transparent', color: '#ff9800', border: '2px solid #ff9800', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,152,0,0.1)'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
            >
              📝 Crear Cuenta
            </button>

            <button
              onClick={() => cambiarVista('login')}
              style={{ padding: '10px 25px', backgroundColor: '#ff9800', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', boxShadow: '0 4px 15px rgba(255,152,0,0.3)', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#ffb74d';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(255,152,0,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#ff9800';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(255,152,0,0.3)';
              }}
            >
              🚀 Iniciar Sesión
            </button>
          </div>
        </div>
      </div>

      {cargando ? (
        <div style={{ textAlign: 'center', padding: '60px', color: '#ff9800', fontSize: '18px' }}>
          ⏳ Cargando empresas...
        </div>
      ) : (
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px' }}>
          <div style={{ backgroundColor: '#2d2d2d', padding: '25px', borderRadius: '15px', marginBottom: '30px', border: '2px solid rgba(255,152,0,0.3)', background: 'linear-gradient(135deg, rgba(255,152,0,0.1) 0%, rgba(45,45,45,1) 100%)', textAlign: 'center' }}>
            <h2 style={{ margin: '0 0 10px 0', color: '#ff9800', fontSize: '28px' }}>✨ Descubre Microempresas Locales</h2>
            <p style={{ margin: 0, color: '#aaa', fontSize: '16px' }}>
              Explora productos y servicios de emprendedores de tu comunidad. <strong style={{ color: '#ff9800' }}> Crea una cuenta</strong> para guardar tus favoritos y realizar compras.
            </p>
          </div>

          <div style={{ backgroundColor: '#2d2d2d', padding: '25px', borderRadius: '10px', marginBottom: '30px', border: '1px solid #3d3d3d', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', color: '#ff9800', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>🔍 Buscar Empresa</label>
                <input
                  type="text"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Busca por nombre o descripción..."
                  style={{ width: '100%', padding: '14px', border: '2px solid #444', borderRadius: '8px', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '15px', transition: 'border-color 0.3s ease' }}
                  onFocus={(e) => e.target.style.borderColor = '#ff9800'}
                  onBlur={(e) => e.target.style.borderColor = '#444'}
                />
              </div>

              <div>
                <label style={{ display: 'block', color: '#ff9800', marginBottom: '8px', fontWeight: 'bold', fontSize: '14px' }}>📂 Filtrar por Rubro</label>
                <select
                  value={filtroRubro}
                  onChange={(e) => setFiltroRubro(e.target.value)}
                  style={{ width: '100%', padding: '14px', border: '2px solid #444', borderRadius: '8px', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '15px', cursor: 'pointer' }}
                >
                  <option value="todos">Todos los rubros</option>
                  {rubros.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div style={{ marginTop: '20px', padding: '12px', backgroundColor: 'rgba(255,152,0,0.1)', borderRadius: '8px', textAlign: 'center' }}>
              <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>
                Mostrando <strong style={{ color: '#ff9800', fontSize: '18px' }}>{empresasFiltradas.length}</strong> de <strong>{empresas.length}</strong> empresas
              </p>
            </div>
          </div>

          {empresasFiltradas.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
              {empresasFiltradas.map(empresa => (
                <div key={empresa.id} style={{ backgroundColor: '#2d2d2d', borderRadius: '15px', overflow: 'hidden', border: '1px solid #3d3d3d', transition: 'all 0.3s ease', cursor: 'pointer' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 12px 30px rgba(255,152,0,0.4)';
                    e.currentTarget.style.borderColor = '#ff9800';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                    e.currentTarget.style.borderColor = '#3d3d3d';
                  }}
                >
                  <div style={{ background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', padding: '25px', textAlign: 'center', position: 'relative' }}>
                    <div style={{ fontSize: '70px', marginBottom: '10px' }}>{empresa.logo}</div>
                    <div style={{ display: 'inline-block', padding: '6px 18px', backgroundColor: empresa.plan === 'premium' ? '#000' : 'rgba(255,255,255,0.3)', borderRadius: '20px', color: '#fff', fontSize: '11px', fontWeight: 'bold', backdropFilter: 'blur(10px)', border: empresa.plan === 'premium' ? '2px solid #fff' : 'none' }}>
                      {empresa.plan === 'premium' ? '⭐ PREMIUM' : '📦 BÁSICO'}
                    </div>
                  </div>

                  <div style={{ padding: '25px' }}>
                    <h3 style={{ margin: '0 0 12px 0', color: '#fff', fontSize: '22px', fontWeight: '700' }}>{empresa.nombre}</h3>
                    
                    <div style={{ marginBottom: '15px' }}>
                      <span style={{ display: 'inline-block', padding: '6px 14px', backgroundColor: '#1a1a1a', borderRadius: '20px', color: '#ff9800', fontSize: '12px', fontWeight: 'bold', border: '1px solid rgba(255,152,0,0.3)' }}>
                        📂 {empresa.rubro}
                      </span>
                    </div>

                    <p style={{ margin: '0 0 20px 0', color: '#aaa', fontSize: '14px', lineHeight: '1.6', minHeight: '42px' }}>{empresa.descripcion}</p>

                    <div style={{ padding: '18px', backgroundColor: '#1a1a1a', borderRadius: '10px', marginBottom: '20px', border: '1px solid #333' }}>
                      <p style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📍</span> {empresa.direccion}
                      </p>
                      <p style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📞</span> {empresa.telefono}
                      </p>
                      <p style={{ margin: 0, color: '#aaa', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span>📧</span> {empresa.email}
                      </p>
                    </div>

                    <button style={{ width: '100%', padding: '14px', background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', color: '#000', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 4px 15px rgba(255,152,0,0.3)', transition: 'all 0.3s ease' }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = 'scale(1.02)';
                        e.target.style.boxShadow = '0 6px 20px rgba(255,152,0,0.5)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 4px 15px rgba(255,152,0,0.3)';
                      }}
                    >
                      <span style={{ fontSize: '18px' }}>🛒</span> Ver Productos
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 40px', backgroundColor: '#2d2d2d', borderRadius: '15px', border: '2px dashed #444' }}>
              <div style={{ fontSize: '100px', marginBottom: '25px', opacity: 0.5 }}>😕</div>
              <h3 style={{ margin: 0, color: '#fff', fontSize: '28px', marginBottom: '15px' }}>No se encontraron empresas</h3>
              <p style={{ margin: 0, color: '#aaa', fontSize: '16px' }}>Intenta cambiar los filtros de búsqueda o explora otras categorías</p>
              <button
                onClick={() => { setBusqueda(''); setFiltroRubro('todos'); }}
                style={{ marginTop: '25px', padding: '12px 30px', backgroundColor: '#ff9800', color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '14px' }}
              >
                🔄 Limpiar Filtros
              </button>
            </div>
          )}
        </div>
      )}

      <div style={{ backgroundColor: '#2d2d2d', borderTop: '2px solid #ff9800', padding: '40px 30px', marginTop: '60px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#ff9800', fontSize: '24px' }}>¿Tienes una microempresa?</h3>
          <p style={{ margin: '0 0 25px 0', color: '#aaa', fontSize: '16px' }}>Únete a nuestra plataforma y llega a más clientes</p>
          <button
            onClick={() => cambiarVista('register')}
            style={{ padding: '14px 40px', backgroundColor: '#ff9800', color: '#000', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '700', fontSize: '16px', boxShadow: '0 4px 15px rgba(255,152,0,0.3)' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ffb74d';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ff9800';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            🚀 Registrar mi Empresa
          </button>
        </div>
      </div>
    </div>
  );
}

export default CatalogoPublico;