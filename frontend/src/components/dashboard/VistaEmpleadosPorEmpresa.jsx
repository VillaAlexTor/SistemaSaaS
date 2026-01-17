import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

function VistaEmpleadosPorEmpresa() {
  const [modoBusqueda, setModoBusqueda] = useState('empresa'); // 'empresa' o 'global'
  const [microempresas, setMicroempresas] = useState([]);
  const [empresaSeleccionada, setEmpresaSeleccionada] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [todosLosClientes, setTodosLosClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [cargandoEmpleados, setCargandoEmpleados] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [busquedaEmpleado, setBusquedaEmpleado] = useState('');

  useEffect(() => {
    cargarMicroempresas();
  }, []);

  useEffect(() => {
    if (modoBusqueda === 'global') {
      cargarTodosLosClientes();
    }
  }, [modoBusqueda]);

  const cargarMicroempresas = async () => {
    setCargando(true);
    const resultado = await api.getAllMicroempresas();
    
    if (resultado.success) {
      const activas = resultado.data.filter(m => m.activo);
      setMicroempresas(activas);
    }
    
    setCargando(false);
  };

  const cargarEmpleados = async (microempresaId) => {
    setCargandoEmpleados(true);
    // Cargar TODOS los clientes (vendedores y compradores) de la microempresa
    const resultado = await api.getClientesMicroempresa(microempresaId);
    
    if (resultado.success) {
      // Filtrar solo los que NO están eliminados
      const clientesActivos = resultado.data.filter(c => !c.eliminado);
      setEmpleados(clientesActivos);
    }
    
    setCargandoEmpleados(false);
  };

  const cargarTodosLosClientes = async () => {
    setCargandoEmpleados(true);
    const resultado = await api.getAllClientesGlobal();
    
    if (resultado.success) {
      setTodosLosClientes(resultado.data);
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

  const empleadosFiltrados = empleados.filter(emp =>
    (emp.nombre?.toLowerCase().includes(busquedaEmpleado.toLowerCase())) ||
    (emp.apellido?.toLowerCase().includes(busquedaEmpleado.toLowerCase())) ||
    (emp.email?.toLowerCase().includes(busquedaEmpleado.toLowerCase())) ||
    (emp.ci_nit?.toLowerCase().includes(busquedaEmpleado.toLowerCase()))
  );

  const clientesGlobalesFiltrados = todosLosClientes.filter(emp =>
    (emp.nombre?.toLowerCase().includes(busquedaEmpleado.toLowerCase())) ||
    (emp.apellido?.toLowerCase().includes(busquedaEmpleado.toLowerCase())) ||
    (emp.email?.toLowerCase().includes(busquedaEmpleado.toLowerCase())) ||
    (emp.ci_nit?.toLowerCase().includes(busquedaEmpleado.toLowerCase())) ||
    (emp.microempresa_nombre?.toLowerCase().includes(busquedaEmpleado.toLowerCase()))
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
        👥 Clientes por Empresa
      </h2>

      {/* TOGGLE: Búsqueda por Empresa vs Búsqueda Global */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={() => {
            setModoBusqueda('empresa');
            setEmpresaSeleccionada(null);
            setBusquedaEmpleado('');
          }}
          style={{
            padding: '12px 25px',
            backgroundColor: modoBusqueda === 'empresa' ? '#2196f3' : '#2d2d2d',
            color: '#fff',
            border: modoBusqueda === 'empresa' ? '2px solid #2196f3' : '1px solid #3d3d3d',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🏪 Búsqueda por Empresa
        </button>
        <button
          onClick={() => {
            setModoBusqueda('global');
            setEmpresaSeleccionada(null);
            setBusquedaEmpleado('');
          }}
          style={{
            padding: '12px 25px',
            backgroundColor: modoBusqueda === 'global' ? '#ff9800' : '#2d2d2d',
            color: '#fff',
            border: modoBusqueda === 'global' ? '2px solid #ff9800' : '1px solid #3d3d3d',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🌐 Búsqueda Global
        </button>
      </div>

      {/* MODO: BÚSQUEDA POR EMPRESA */}
      {modoBusqueda === 'empresa' && !empresaSeleccionada && (
        <>
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
              Selecciona una empresa para ver sus clientes
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
      )}

      {/* MODO: BÚSQUEDA POR EMPRESA - EMPLEADOS DE EMPRESA SELECCIONADA */}
      {modoBusqueda === 'empresa' && empresaSeleccionada && (
        <>
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
                setBusquedaEmpleado('');
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

          {cargandoEmpleados ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
              <p style={{ color: '#ff9800', fontSize: '18px' }}>Cargando clientes...</p>
            </div>
          ) : (
            <>
              <div style={{
                backgroundColor: '#2d2d2d',
                borderRadius: '10px',
                padding: '20px',
                border: '1px solid #3d3d3d'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, color: '#ff9800' }}>
                    👥 Clientes ({empleadosFiltrados.length} de {empleados.length})
                  </h3>
                </div>

                {empleados.length > 0 && (
                  <div style={{ marginBottom: '20px' }}>
                    <input
                      type="text"
                      placeholder="🔍 Buscar cliente por nombre, email o CI/NIT..."
                      value={busquedaEmpleado}
                      onChange={(e) => setBusquedaEmpleado(e.target.value)}
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
                )}

                <TablaEmpleadosPorEmpresa empleados={empleadosFiltrados} busqueda={busquedaEmpleado} totalEmpleados={empleados.length} />
              </div>

              {empleados.length > 0 && (
                <EstadisticasEmpleados empleados={empleados} />
              )}
            </>
          )}
        </>
      )}

      {/* MODO: BÚSQUEDA GLOBAL */}
      {modoBusqueda === 'global' && (
        <>
          {cargandoEmpleados ? (
            <div style={{ textAlign: 'center', padding: '60px' }}>
              <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
              <p style={{ color: '#ff9800', fontSize: '18px' }}>Cargando todos los clientes...</p>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#2d2d2d',
              borderRadius: '10px',
              padding: '20px',
              border: '2px solid #ff9800'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, color: '#ff9800' }}>
                  🌐 Todos los Clientes del Sistema ({clientesGlobalesFiltrados.length} de {todosLosClientes.length})
                </h3>
              </div>

              {todosLosClientes.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <input
                    type="text"
                    placeholder="🔍 Buscar por nombre, email, CI/NIT o empresa..."
                    value={busquedaEmpleado}
                    onChange={(e) => setBusquedaEmpleado(e.target.value)}
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
              )}

              <TablaClientesGlobal clientes={clientesGlobalesFiltrados} busqueda={busquedaEmpleado} totalClientes={todosLosClientes.length} />
            </div>
          )}
        </>
      )}
    </div>
  );
}

// TABLA EMPLEADOS POR EMPRESA
function TablaEmpleadosPorEmpresa({ empleados, busqueda, totalEmpleados }) {
  if (totalEmpleados === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '60px', marginBottom: '15px', opacity: 0.5 }}>👥</div>
        <p style={{ color: '#aaa', margin: 0 }}>Esta empresa no tiene clientes registrados</p>
      </div>
    );
  }

  if (empleados.length === 0 && busqueda) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '60px', marginBottom: '15px', opacity: 0.5 }}>🔍</div>
        <p style={{ color: '#aaa', margin: 0 }}>No se encontraron clientes con "{busqueda}"</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
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
    </div>
  );
}

// TABLA CLIENTES GLOBALES
function TablaClientesGlobal({ clientes, busqueda, totalClientes }) {
  if (totalClientes === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '60px', marginBottom: '15px', opacity: 0.5 }}>👥</div>
        <p style={{ color: '#aaa', margin: 0 }}>No hay clientes registrados en el sistema</p>
      </div>
    );
  }

  if (clientes.length === 0 && busqueda) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <div style={{ fontSize: '60px', marginBottom: '15px', opacity: 0.5 }}>🔍</div>
        <p style={{ color: '#aaa', margin: 0 }}>No se encontraron clientes con "{busqueda}"</p>
      </div>
    );
  }

  return (
    <div style={{ overflowX: 'auto' }}>
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
            <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Empresa</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(emp => (
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
                  {emp.activo ? '✅' : '❌'}
                </span>
              </td>
              <td style={{ padding: '12px', textAlign: 'center', color: '#aaa', fontSize: '12px' }}>
                {new Date(emp.fecha_registro).toLocaleDateString('es-BO')}
              </td>
              <td style={{ padding: '12px', color: '#2196f3', fontSize: '13px', fontWeight: 'bold' }}>
                🏪 {emp.microempresa_nombre}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ESTADÍSTICAS
function EstadisticasEmpleados({ empleados }) {
  return (
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
        <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Total Clientes</p>
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
        <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Clientes Activos</p>
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
        <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Clientes Inactivos</p>
        <p style={{ margin: '10px 0 0 0', color: '#f44336', fontSize: '32px', fontWeight: 'bold' }}>
          {empleados.filter(e => !e.activo).length}
        </p>
      </div>
    </div>
  );
}

export default VistaEmpleadosPorEmpresa;