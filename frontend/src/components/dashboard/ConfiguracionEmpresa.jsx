import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

function ConfiguracionEmpresa({ usuario, cerrar, onActualizar }) {
  const [pestanaActiva, setPestanaActiva] = useState('general');
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  // Estados para datos de la empresa
  const [datosGenerales, setDatosGenerales] = useState({
    nombre: usuario.nombre || '',
    email: usuario.email || '',
    telefono: usuario.telefono || '',
    direccion: usuario.direccion || '',
    nit: usuario.nit || '',
    rubro: usuario.rubro || '',
    logo: usuario.logo || '🏪',
    descripcion: usuario.descripcion || ''
  });

  const guardarCambiosGenerales = async () => {
    setCargando(true);
    setMensaje(null);
    console.log('📤 Enviando datos:', datosGenerales);
    console.log('🆔 ID de empresa:', usuario.id);
    const resultado = await api.updateConfiguracionMicroempresa(usuario.id, datosGenerales);
    console.log('📥 Respuesta del servidor:', resultado);
    if (resultado.success) {
      setMensaje({ tipo: 'exito', texto: '✅ Cambios guardados correctamente' });
      if (onActualizar) {
        onActualizar({ ...usuario, ...datosGenerales });
      }
      setTimeout(() => {
        setMensaje(null);
      }, 2000);
    } else {
      const mensajeError = resultado.errors 
        ? JSON.stringify(resultado.errors) 
        : resultado.message || 'Error desconocido';
      setMensaje({ 
        tipo: 'error', 
        texto: `❌ Error: ${mensajeError}` 
      });
      console.error('❌ Error completo:', resultado);
    }
    setCargando(false);
  };

  const solicitarUpgrade = async () => {
    if (!window.confirm('¿Deseas mejorar a Plan Premium? Esto activará todas las funciones avanzadas.')) {
      return;
    }

    setCargando(true);
    setMensaje(null);

    const resultado = await api.solicitarCambioPlan(usuario.id, 'premium');

    if (resultado.success) {
      setMensaje({ tipo: 'exito', texto: '✅ ¡Bienvenido a Premium! Recargando página...' });
      
      // Actualizar localStorage
      const usuarioActualizado = { ...usuario, plan: 'premium' };
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
      // Esperar 1 segundo y recargar
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      setMensaje({ tipo: 'error', texto: '❌ Error al cambiar de plan' });
      setCargando(false);
    }
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
        maxWidth: '900px', 
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
              ⚙️ Configuración de la Empresa
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '13px' }}>
              Gestiona la información de tu negocio
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

        {/* Pestañas */}
        <div style={{ 
          display: 'flex', 
          gap: '0', 
          borderBottom: '1px solid #3d3d3d', 
          backgroundColor: '#1a1a1a', 
          padding: '0 30px' 
        }}>
          {[
            { id: 'general', icono: '🏢', texto: 'Información General' },
            { id: 'plan', icono: '💎', texto: 'Plan y Suscripción' }
          ].map(pestana => (
            <button
              key={pestana.id}
              onClick={() => setPestanaActiva(pestana.id)}
              style={{
                padding: '15px 20px',
                backgroundColor: pestanaActiva === pestana.id ? '#2196f3' : 'transparent',
                color: pestanaActiva === pestana.id ? '#000' : '#fff',
                border: 'none',
                borderBottom: pestanaActiva === pestana.id ? '3px solid #2196f3' : '3px solid transparent',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px',
                transition: 'all 0.3s ease'
              }}
            >
              {pestana.icono} {pestana.texto}
            </button>
          ))}
        </div>

        {/* Mensaje de estado */}
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
          {pestanaActiva === 'general' && (
            <TabGeneral 
              datos={datosGenerales}
              setDatos={setDatosGenerales}
              guardar={guardarCambiosGenerales}
              cargando={cargando}
            />
          )}

          {pestanaActiva === 'plan' && (
            <TabPlan 
              usuario={usuario}
              solicitarUpgrade={solicitarUpgrade}
              cargando={cargando}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================
// TAB INFORMACIÓN GENERAL
// ============================================

function TabGeneral({ datos, setDatos, guardar, cargando }) {
  const emojis = ['🏪', '🛒', '🍽️', '💊', '🔨', '👔', '💻', '🎨', '📚', '🎵', '🏋️', '🍕'];

  return (
    <div>
      <h3 style={{ color: '#2196f3', marginBottom: '20px', fontSize: '18px' }}>
        🏢 Información de la Empresa
      </h3>

      <div style={{ display: 'grid', gap: '20px' }}>
        {/* Logo */}
        <div>
          <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
            Logo (Emoji)
          </label>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {emojis.map(emoji => (
              <button
                key={emoji}
                onClick={() => setDatos({ ...datos, logo: emoji })}
                style={{
                  width: '50px',
                  height: '50px',
                  fontSize: '30px',
                  border: datos.logo === emoji ? '3px solid #2196f3' : '2px solid #444',
                  borderRadius: '8px',
                  backgroundColor: datos.logo === emoji ? '#1a4d7a' : '#1a1a1a',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>

        {/* Nombre */}
        <div>
          <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
            Nombre de la Empresa *
          </label>
          <input
            type="text"
            value={datos.nombre}
            onChange={(e) => setDatos({ ...datos, nombre: e.target.value })}
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

        {/* Grid de 2 columnas */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
              Email *
            </label>
            <input
              type="email"
              value={datos.email}
              onChange={(e) => setDatos({ ...datos, email: e.target.value })}
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
              value={datos.telefono}
              onChange={(e) => setDatos({ ...datos, telefono: e.target.value })}
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

        {/* NIT y Rubro */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
              NIT
            </label>
            <input
              type="text"
              value={datos.nit}
              onChange={(e) => setDatos({ ...datos, nit: e.target.value })}
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
              Rubro
            </label>
            <select
              value={datos.rubro}
              onChange={(e) => setDatos({ ...datos, rubro: e.target.value })}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '2px solid #444',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                fontSize: '14px'
              }}
            >
              <option value="">Selecciona un rubro</option>
              <option value="Abarrotes">🛒 Abarrotes</option>
              <option value="Restaurante">🍽️ Restaurante</option>
              <option value="Farmacia">💊 Farmacia</option>
              <option value="Ferretería">🔨 Ferretería</option>
              <option value="Ropa">👔 Ropa</option>
              <option value="Tecnología">💻 Tecnología</option>
              <option value="Servicios">🔧 Servicios</option>
              <option value="Otro">📦 Otro</option>
            </select>
          </div>
        </div>

        {/* Dirección */}
        <div>
          <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
            Dirección
          </label>
          <input
            type="text"
            value={datos.direccion}
            onChange={(e) => setDatos({ ...datos, direccion: e.target.value })}
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

        {/* Descripción */}
        <div>
          <label style={{ display: 'block', color: '#fff', marginBottom: '5px', fontSize: '14px', fontWeight: 'bold' }}>
            Descripción
          </label>
          <textarea
            value={datos.descripcion}
            onChange={(e) => setDatos({ ...datos, descripcion: e.target.value })}
            rows="3"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '8px',
              border: '2px solid #444',
              backgroundColor: '#1a1a1a',
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'inherit',
              resize: 'vertical'
            }}
            placeholder="Describe brevemente tu negocio..."
          />
        </div>
      </div>

      {/* Botón guardar */}
      <button
        onClick={guardar}
        disabled={cargando}
        style={{
          marginTop: '25px',
          width: '100%',
          padding: '14px',
          background: cargando ? '#666' : 'linear-gradient(135deg, #2196f3 0%, #64b5f6 100%)',
          color: cargando ? '#aaa' : '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: cargando ? 'not-allowed' : 'pointer',
          fontWeight: 'bold',
          fontSize: '16px',
          boxShadow: cargando ? 'none' : '0 4px 15px rgba(33,150,243,0.4)'
        }}
      >
        {cargando ? '⏳ Guardando...' : '💾 Guardar Cambios'}
      </button>
    </div>
  );
}

// ============================================
// TAB PLAN Y SUSCRIPCIÓN (VERSIÓN MEJORADA)
// ============================================

function TabPlan({ usuario, solicitarUpgrade, cargando }) {
  const [cargandoLocal, setCargandoLocal] = useState(false);
  const planActual = usuario.plan || 'basico';
  const esPremium = planActual === 'premium';

  const cancelarSuscripcion = async () => {
    if (!window.confirm('⚠️ ¿Estás seguro de cancelar tu suscripción Premium?\n\nPerderás acceso a:\n• Reportes avanzados\n• Múltiples usuarios\n• Soporte prioritario\n• Acceso a API')) {
      return;
    }

    setCargandoLocal(true);

    const resultado = await api.cancelarSuscripcion(usuario.id);

    if (resultado.success) {
      alert('✅ Suscripción cancelada. Has vuelto al Plan Básico.');
      
      // Actualizar localStorage
      const usuarioActualizado = { ...usuario, plan: 'basico' };
      localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
      
      // Recargar página
      window.location.reload();
    } else {
      alert('❌ Error al cancelar la suscripción');
    }

    setCargandoLocal(false);
  };

  return (
    <div>
      <h3 style={{ color: '#2196f3', marginBottom: '20px', fontSize: '18px' }}>
        💎 Plan y Suscripción
      </h3>

      {/* Plan actual */}
      <div style={{
        padding: '25px',
        backgroundColor: '#1a1a1a',
        borderRadius: '10px',
        border: `2px solid ${esPremium ? '#ff9800' : '#666'}`,
        marginBottom: '25px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <div>
            <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>Plan Actual</p>
            <h2 style={{ margin: '5px 0 0 0', color: esPremium ? '#ff9800' : '#666', fontSize: '32px', fontWeight: 'bold' }}>
              {esPremium ? '⭐ PREMIUM' : '📦 BÁSICO'}
            </h2>
          </div>
          <div style={{ fontSize: '60px' }}>
            {esPremium ? '⭐' : '📦'}
          </div>
        </div>

        <p style={{ margin: '15px 0', color: '#aaa', fontSize: '14px' }}>
          {esPremium 
            ? 'Tienes acceso a todas las funciones avanzadas del sistema.'
            : 'Plan gratuito con funciones básicas. Mejora a Premium para desbloquear más funciones.'}
        </p>

        {/* Características del plan */}
        <div style={{ marginTop: '20px' }}>
          <CaracteristicaPlan texto="Gestión de productos" activo={true} />
          <CaracteristicaPlan texto="Registro de ventas" activo={true} />
          <CaracteristicaPlan texto="Gestión de clientes" activo={true} />
          <CaracteristicaPlan texto="Reportes avanzados" activo={esPremium} />
          <CaracteristicaPlan texto="Múltiples usuarios" activo={esPremium} />
          <CaracteristicaPlan texto="Soporte prioritario" activo={esPremium} />
          <CaracteristicaPlan texto="Acceso a API" activo={esPremium} />
        </div>
      </div>

      {/* Botón de upgrade (solo si es BÁSICO) */}
      {!esPremium && (
        <div style={{
          padding: '20px',
          backgroundColor: '#2d2d10',
          border: '2px solid #ff9800',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#ff9800', fontSize: '20px' }}>
            🚀 Mejora a Premium
          </h3>
          <p style={{ margin: '0 0 20px 0', color: '#aaa', fontSize: '14px' }}>
            Desbloquea todas las funciones avanzadas por solo <strong style={{ color: '#ff9800' }}>$29/mes</strong>
          </p>
          <button
            onClick={solicitarUpgrade}
            disabled={cargando || cargandoLocal}
            style={{
              padding: '14px 40px',
              background: (cargando || cargandoLocal) ? '#666' : 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
              color: (cargando || cargandoLocal) ? '#aaa' : '#000',
              border: 'none',
              borderRadius: '8px',
              cursor: (cargando || cargandoLocal) ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              boxShadow: (cargando || cargandoLocal) ? 'none' : '0 4px 15px rgba(255,152,0,0.4)'
            }}
          >
            {(cargando || cargandoLocal) ? '⏳ Procesando...' : '⭐ Mejorar Ahora'}
          </button>
        </div>
      )}

      {/* Botón de cancelar suscripción (solo si es PREMIUM) */}
      {esPremium && (
        <div style={{
          padding: '20px',
          backgroundColor: '#1a1a1a',
          border: '2px solid #f44336',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#f44336', fontSize: '18px' }}>
            Gestionar Suscripción
          </h3>
          <p style={{ margin: '0 0 20px 0', color: '#aaa', fontSize: '13px' }}>
            Si cancelas tu suscripción, volverás al Plan Básico y perderás acceso a las funciones avanzadas.
          </p>
          <button
            onClick={cancelarSuscripcion}
            disabled={cargandoLocal}
            style={{
              padding: '12px 30px',
              background: cargandoLocal ? '#666' : 'transparent',
              color: cargandoLocal ? '#aaa' : '#f44336',
              border: `2px solid ${cargandoLocal ? '#666' : '#f44336'}`,
              borderRadius: '8px',
              cursor: cargandoLocal ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!cargandoLocal) {
                e.target.style.backgroundColor = '#f44336';
                e.target.style.color = '#fff';
              }
            }}
            onMouseLeave={(e) => {
              if (!cargandoLocal) {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#f44336';
              }
            }}
          >
            {cargandoLocal ? '⏳ Cancelando...' : '❌ Cancelar Suscripción'}
          </button>
        </div>
      )}

      {/* Información adicional */}
      <div style={{ marginTop: '25px', padding: '15px', backgroundColor: '#1a1a1a', borderRadius: '8px' }}>
        <p style={{ margin: 0, color: '#aaa', fontSize: '13px', lineHeight: '1.6' }}>
          <strong style={{ color: '#fff' }}>📅 Fecha de registro:</strong> {new Date(usuario.fecha_registro).toLocaleDateString('es-BO')}
        </p>
        {esPremium && (
          <p style={{ margin: '10px 0 0 0', color: '#aaa', fontSize: '13px', lineHeight: '1.6' }}>
            <strong style={{ color: '#fff' }}>💳 Costo mensual:</strong> <span style={{ color: '#ff9800', fontWeight: 'bold' }}>$29 USD</span>
          </p>
        )}
      </div>
    </div>
  );
}

// ============================================
// COMPONENTES AUXILIARES
// ============================================

function CaracteristicaPlan({ texto, activo }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px'
    }}>
      <div style={{
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: activo ? '#4caf50' : '#666',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '12px'
      }}>
        {activo ? '✓' : '✗'}
      </div>
      <span style={{
        color: activo ? '#fff' : '#666',
        fontSize: '14px'
      }}>
        {texto}
      </span>
    </div>
  );
}

export default ConfiguracionEmpresa;