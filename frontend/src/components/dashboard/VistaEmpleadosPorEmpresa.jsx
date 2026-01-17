import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

function VistaEmpleadosPorEmpresa() {
  const [microempresas, setMicroempresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoEmpleados, setCargandoEmpleados] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  useEffect(() => {
    cargarMicroempresas();
  }, []);

  const cargarMicroempresas = async () => {
    setCargando(true);
    const resultado = await api.getAllMicroempresas();
    
    if (resultado.success) {
      // Filtrar solo microempresas activas
      const activas = resultado.data.filter(m => m.activo);
      setMicroempresas(activas);
    }
    
    setCargando(false);
  };

  const cargarEmpleados = async (microempresaId) => {
    setCargandoEmpleados(true);
    const resultado = await api.getEmpleados(microempresaId, false);
    
    if (resultado.success) {
      setEmpleados(resultado.data);
    }
    
    setCargandoEmpleados(false);
  };

  const seleccionarEmpresa = (empresa) => {
    setEmpresaSeleccionada(empresa);
    cargarEmpleados(empresa.id);
  };

  const microempresasFiltradas = microempresas.filter(m =>
    (m.nombre?.toLowerCase().includes(busqueda.toLowerCase())) ||
    (m.email?.toLowerCase().includes(busqueda.toLowerCase())) ||
    (m.rubro?.toLowerCase().includes(busqueda.toLowerCase()))
  );

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
        <p style={{ color: '#ff9800', fontSize: '18px' }}>Cargando microempresas...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: '#ff9800', marginBottom: '30px', fontSize: '28px' }}>
        👥 Empleados por Empresa
      </h2>

      {!empresaSeleccionada ? (
        <>
          {/* Búsqueda */}
          <div style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="🔍 Buscar empresa por nombre, email o rubro..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 20px',
                borderRadius: '8px',
                border: '2px solid #444',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Lista de microempresas */}
          <div style={{
            backgroundColor: '#2d2d2d',
            borderRadius: '10px',
            padding: '20px',
            border: '1px solid #3d3d3d'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0', 
              color: '#ff9800', 
              borderBottom: '2px solid #ff9800', 
              paddingBottom: '10px' 
            }}>
              Selecciona una empresa para ver sus empleados
            </h3>

            {microempresasFiltradas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <div style={{ fontSize: '60px', marginBottom: '15px', opacity: 0.5 }}>😕</div>
                <p style={{ color: '#aaa', margin: 0 }}>No se encontraron empresas</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {microempresasFiltradas.map(empresa => (
                  <div
                    key={empresa.id}
                    onClick={() => seleccionarEmpresa(empresa)}
                    style={{
                      padding: '20px',
                      backgroundColor: '#1a1a1a',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      border: '2px solid transparent',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#ff9800';
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'transparent';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, color: '#fff', fontSize: '16px', marginBottom: '5px' }}>
                        {empresa.nombre}
                      </h4>
                      <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>
                        {empresa.email} • {empresa.rubro || 'Sin rubro'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '5px 15px',
                        borderRadius: '15px',
                        backgroundColor: empresa.plan === 'premium' ? '#ffb74d' : '#666',
                        color: empresa.plan === 'premium' ? '#000' : '#fff',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {empresa.plan === 'premium' ? '⭐ PREMIUM' : '📦 BÁSICO'}
                      </span>
                      <span style={{ fontSize: '24px' }}>→</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Header con empresa seleccionada */}
          <div style={{
            backgroundColor: '#2d2d2d',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px',
            border: '2px solid #ff9800',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <h3 style={{ margin: 0, color: '#ff9800', fontSize: '20px' }}>
                {empresaSeleccionada.nombre}
              </h3>
              <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '13px' }}>
                {empresaSeleccionada.email} • ID: {empresaSeleccionada.id}
              </p>
            </div>
            <button
              onClick={() => {
                setEmpresaSeleccionada(null);
                setEmpleados([]);
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: '#666',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              ← Volver
            </button>
          </div>

          {/* Lista de empleados */}
          {cargandoEmpleados ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
              <p style={{ color: '#ff9800', fontSize: '18px' }}>Cargando empleados...</p>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#2d2d2d',
              borderRadius: '10px',
              padding: '20px',
              border: '1px solid #3d3d3d'
            }}>
              <h3 style={{ 
                margin: '0 0 20px 0', 
                color: '#ff9800', 
                borderBottom: '2px solid #ff9800', 
                paddingBottom: '10px' 
              }}>
                👥 Empleados ({empleados.length})
              </h3>

              {empleados.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                  <div style={{ fontSize: '60px', marginBottom: '15px', opacity: 0.5 }}>👥</div>
                  <p style={{ color: '#aaa', margin: 0 }}>Esta empresa no tiene empleados registrados</p>
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #ff9800' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Nombre</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Email</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Teléfono</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>CI/NIT</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: '#ff9800', fontSize: '13px' }}>Estado</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: '#ff9800', fontSize: '13px' }}>Fecha Registro</th>
                    </tr>
                  </thead>
                  <tbody>
                    {empleados.map(emp => (
                      <tr key={emp.id} style={{ borderBottom: '1px solid #3d3d3d' }}>
                        <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>#{emp.id}</td>
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
                        <td style={{ padding: '12px', textAlign: 'center', color: '#aaa', fontSize: '12px' }}>
                          {new Date(emp.fecha_registro).toLocaleDateString('es-BO')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Estadísticas */}
          {empleados.length > 0 && (
            <div style={{
              marginTop: '20px',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '15px'
            }}>
              <div style={{
                backgroundColor: '#2d2d2d',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #3d3d3d',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Total Empleados</p>
                <p style={{ margin: '10px 0 0 0', color: '#ff9800', fontSize: '32px', fontWeight: 'bold' }}>
                  {empleados.length}
                </p>
              </div>

              <div style={{
                backgroundColor: '#2d2d2d',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #3d3d3d',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Empleados Activos</p>
                <p style={{ margin: '10px 0 0 0', color: '#4caf50', fontSize: '32px', fontWeight: 'bold' }}>
                  {empleados.filter(e => e.activo).length}
                </p>
              </div>

              <div style={{
                backgroundColor: '#2d2d2d',
                padding: '20px',
                borderRadius: '10px',
                border: '1px solid #3d3d3d',
                textAlign: 'center'
              }}>
                <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Empleados Inactivos</p>
                <p style={{ margin: '10px 0 0 0', color: '#f44336', fontSize: '32px', fontWeight: 'bold' }}>
                  {empleados.filter(e => !e.activo).length}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default VistaEmpleadosPorEmpresa;