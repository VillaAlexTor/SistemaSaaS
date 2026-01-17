import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';


function VistaSolicitudes({ actualizarDatos }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalImagen, setModalImagen] = useState(null);
  const [modalAccion, setModalAccion] = useState(null); // { tipo: 'aprobar'|'rechazar', solicitud: {} }

  useEffect(() => {
    cargarSolicitudes();
  }, []);

  const cargarSolicitudes = async () => {
    setCargando(true);
    const resultado = await api.getSolicitudesUpgrade();
    
    if (resultado.success) {
      setSolicitudes(resultado.data);
    }
    
    setCargando(false);
  };

  const solicitudesPendientes = solicitudes.filter(s => s.estado === 'pendiente');
  const solicitudesProcesadas = solicitudes.filter(s => s.estado !== 'pendiente');

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', padding: '60px' }}>
        <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
        <p style={{ color: '#ff9800', fontSize: '18px' }}>Cargando solicitudes...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: '#ff9800', marginBottom: '30px', fontSize: '28px' }}>
        📋 Solicitudes de Upgrade a Premium
      </h2>

      {/* Solicitudes Pendientes */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ color: '#ff9800', fontSize: '20px', margin: 0 }}>
            ⏳ Pendientes de Revisión ({solicitudesPendientes.length})
          </h3>
        </div>

        {solicitudesPendientes.length === 0 ? (
          <div style={{ 
            backgroundColor: '#2d2d2d', 
            borderRadius: '10px', 
            padding: '40px', 
            textAlign: 'center', 
            border: '1px solid #3d3d3d' 
          }}>
            <div style={{ fontSize: '60px', marginBottom: '15px', opacity: 0.5 }}>✅</div>
            <p style={{ color: '#aaa', margin: 0 }}>No hay solicitudes pendientes</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '20px' }}>
            {solicitudesPendientes.map(solicitud => (
              <TarjetaSolicitud
                key={solicitud.id}
                solicitud={solicitud}
                onVerImagen={() => setModalImagen(solicitud.comprobante_url)}
                onAprobar={() => setModalAccion({ tipo: 'aprobar', solicitud })}
                onRechazar={() => setModalAccion({ tipo: 'rechazar', solicitud })}
              />
            ))}
          </div>
        )}
      </div>

      {/* Historial */}
      <div>
        <h3 style={{ color: '#ff9800', marginBottom: '20px', fontSize: '20px' }}>
          📜 Historial ({solicitudesProcesadas.length})
        </h3>

        {solicitudesProcesadas.length === 0 ? (
          <div style={{ 
            backgroundColor: '#2d2d2d', 
            borderRadius: '10px', 
            padding: '40px', 
            textAlign: 'center', 
            border: '1px solid #3d3d3d' 
          }}>
            <div style={{ fontSize: '60px', marginBottom: '15px', opacity: 0.5 }}>📭</div>
            <p style={{ color: '#aaa', margin: 0 }}>No hay solicitudes procesadas</p>
          </div>
        ) : (
          <div style={{ backgroundColor: '#2d2d2d', borderRadius: '10px', padding: '20px', border: '1px solid #3d3d3d' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ff9800' }}>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Empresa</th>
                  <th style={{ padding: '12px', textAlign: 'left', color: '#ff9800', fontSize: '13px' }}>Fecha</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#ff9800', fontSize: '13px' }}>Estado</th>
                  <th style={{ padding: '12px', textAlign: 'center', color: '#ff9800', fontSize: '13px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {solicitudesProcesadas.map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #3d3d3d' }}>
                    <td style={{ padding: '12px', color: '#fff', fontSize: '14px' }}>{s.microempresa_nombre}</td>
                    <td style={{ padding: '12px', color: '#aaa', fontSize: '13px' }}>
                      {new Date(s.fecha_solicitud).toLocaleDateString('es-BO')}
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '5px 12px',
                        borderRadius: '15px',
                        backgroundColor: s.estado === 'aprobado' ? '#1b4d1b' : '#4d1f1f',
                        color: s.estado === 'aprobado' ? '#4caf50' : '#ff6b6b',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {s.estado === 'aprobado' ? '✅ Aprobado' : '❌ Rechazado'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', textAlign: 'center' }}>
                      <button
                        onClick={() => setModalImagen(s.comprobante_url)}
                        style={{
                          padding: '6px 12px',
                          backgroundColor: '#9c27b0',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        👁️ Ver Comprobante
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal de Imagen */}
      {modalImagen && (
        <ModalImagen
          url={modalImagen}
          cerrar={() => setModalImagen(null)}
        />
      )}

      {/* Modal de Acción */}
      {modalAccion && (
        <ModalAccion
          accion={modalAccion}
          cerrar={() => setModalAccion(null)}
          onConfirmar={async (comentario) => {
            const resultado = modalAccion.tipo === 'aprobar'
              ? await api.aprobarSolicitud(modalAccion.solicitud.id, comentario)
              : await api.rechazarSolicitud(modalAccion.solicitud.id, comentario);

            if (resultado.success) {
              alert(`✅ ${resultado.message}`);
              cargarSolicitudes();
              if (actualizarDatos) actualizarDatos();
              setModalAccion(null);
            } else {
              alert(`❌ Error: ${resultado.message}`);
            }
          }}
        />
      )}
    </div>
  );
}

// ============================================
// COMPONENTE: TARJETA DE SOLICITUD
// ============================================

function TarjetaSolicitud({ solicitud, onVerImagen, onAprobar, onRechazar }) {
  return (
    <div style={{
      backgroundColor: '#2d2d2d',
      borderRadius: '15px',
      padding: '25px',
      border: '2px solid #ff9800',
      boxShadow: '0 4px 15px rgba(255,152,0,0.2)'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Información de la empresa */}
        <div>
          <h4 style={{ margin: '0 0 15px 0', color: '#ff9800', fontSize: '18px' }}>
            🏪 Información de la Empresa
          </h4>
          <div style={{ backgroundColor: '#1a1a1a', padding: '15px', borderRadius: '8px' }}>
            <p style={{ margin: '0 0 8px 0', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
              {solicitud.microempresa_nombre}
            </p>
            <p style={{ margin: '0 0 8px 0', color: '#aaa', fontSize: '13px' }}>
              📧 {solicitud.microempresa_email}
            </p>
            <p style={{ margin: '0 0 8px 0', color: '#aaa', fontSize: '13px' }}>
              💳 Método: <strong style={{ color: '#ff9800' }}>{solicitud.metodo_pago_display || solicitud.metodo_pago}</strong>
            </p>
            <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>
              📅 {new Date(solicitud.fecha_solicitud).toLocaleDateString('es-BO', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>

        {/* Comprobante */}
        <div>
          <h4 style={{ margin: '0 0 15px 0', color: '#ff9800', fontSize: '18px' }}>
            💳 Comprobante de Pago
          </h4>
          <div 
            onClick={onVerImagen}
            style={{
              backgroundColor: '#1a1a1a',
              padding: '15px',
              borderRadius: '8px',
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px dashed #444',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#ff9800';
              e.currentTarget.style.backgroundColor = '#2d2d10';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#444';
              e.currentTarget.style.backgroundColor = '#1a1a1a';
            }}
          >
            {solicitud.comprobante ? (
              <>
                <div style={{ fontSize: '50px', marginBottom: '10px' }}>🖼️</div>
                <p style={{ margin: 0, color: '#ff9800', fontSize: '14px', fontWeight: 'bold' }}>
                  Clic para ver imagen
                </p>
              </>
            ) : (
              <>
                <div style={{ fontSize: '50px', marginBottom: '10px', opacity: 0.3 }}>❌</div>
                <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>
                  Sin comprobante
                </p>
              </>
            )}
            <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '12px' }}>
              Monto: <strong style={{ color: '#4caf50' }}>${solicitud.monto}</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={onAprobar}
          style={{
            flex: 1,
            padding: '14px',
            background: 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '15px',
            boxShadow: '0 4px 15px rgba(76,175,80,0.3)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          ✅ Aprobar Solicitud
        </button>

        <button
          onClick={onRechazar}
          style={{
            flex: 1,
            padding: '14px',
            background: 'linear-gradient(135deg, #f44336 0%, #e57373 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold',
            fontSize: '15px',
            boxShadow: '0 4px 15px rgba(244,67,54,0.3)',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          ❌ Rechazar Solicitud
        </button>
      </div>
    </div>
  );
} 

// ============================================
// MODAL: VER IMAGEN
// ============================================

function ModalImagen({ url, cerrar }) {
  const [error, setError] = useState(false);
  const [cargando, setCargando] = useState(true);

  console.log('🖼️ URL recibida:', url);

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.95)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px'
    }}
    onClick={cerrar}
    >
      <div style={{
        position: 'relative',
        maxWidth: '90%',
        maxHeight: '90%'
      }}>
        <button
          onClick={cerrar}
          style={{
            position: 'absolute',
            top: '-40px',
            right: '0',
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
            justifyContent: 'center',
            zIndex: 2001
          }}
        >
          ✕
        </button>

        {cargando && !error && (
          <div style={{
            textAlign: 'center',
            color: '#fff',
            padding: '40px'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
            <p>Cargando imagen...</p>
          </div>
        )}

        {error ? (
          <div style={{
            textAlign: 'center',
            color: '#fff',
            padding: '40px',
            backgroundColor: '#2d2d2d',
            borderRadius: '10px',
            border: '2px solid #f44336'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>❌</div>
            <p style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 'bold' }}>Error al cargar la imagen</p>
            <p style={{ margin: 0, color: '#aaa', fontSize: '14px', wordBreak: 'break-all' }}>
              URL: {url}
            </p>
            <button
              onClick={cerrar}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#ff9800',
                color: '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cerrar
            </button>
          </div>
        ) : (
          <img
            src={url}
            alt="Comprobante de pago"
            onLoad={() => {
              setCargando(false);
              console.log('✅ Imagen cargada correctamente');
            }}
            onError={(e) => {
              setCargando(false);
              setError(true);
              console.error('❌ Error al cargar imagen:', url);
              console.error('❌ Error del evento:', e);
            }}
            style={{
              maxWidth: '100%',
              maxHeight: '80vh',
              borderRadius: '10px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
              display: error || cargando ? 'none' : 'block'
            }}
            onClick={(e) => e.stopPropagation()}
          />
        )}
      </div>
    </div>
  );
}

// ============================================
// MODAL: APROBAR/RECHAZAR
// ============================================

function ModalAccion({ accion, cerrar, onConfirmar }) {
  const [comentario, setComentario] = useState('');
  const [procesando, setProcesando] = useState(false);

  const esAprobar = accion.tipo === 'aprobar';

  const handleConfirmar = async () => {
    setProcesando(true);
    await onConfirmar(comentario);
    setProcesando(false);
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
      zIndex: 2000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#2d2d2d',
        borderRadius: '15px',
        maxWidth: '500px',
        width: '100%',
        border: `2px solid ${esAprobar ? '#4caf50' : '#f44336'}`,
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '25px',
          backgroundColor: esAprobar ? '#1b4d1b' : '#4d1f1f',
          borderBottom: `2px solid ${esAprobar ? '#4caf50' : '#f44336'}`
        }}>
          <h3 style={{ margin: 0, color: '#fff', fontSize: '20px' }}>
            {esAprobar ? '✅ Aprobar Solicitud' : '❌ Rechazar Solicitud'}
          </h3>
          <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '13px' }}>
            {accion.solicitud.microempresa_nombre}
          </p>
        </div>

        {/* Contenido */}
        <div style={{ padding: '25px' }}>
          <p style={{ margin: '0 0 15px 0', color: '#fff', fontSize: '14px' }}>
            {esAprobar 
              ? '¿Estás seguro de aprobar esta solicitud? La empresa pasará a plan Premium.'
              : '¿Estás seguro de rechazar esta solicitud?'}
          </p>

          <div>
            <label style={{ display: 'block', color: '#fff', marginBottom: '8px', fontSize: '14px', fontWeight: 'bold' }}>
              Comentario (opcional)
            </label>
            <textarea
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              rows="3"
              placeholder="Agregar un comentario..."
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
            />
          </div>
        </div>

        {/* Botones */}
        <div style={{ padding: '0 25px 25px', display: 'flex', gap: '10px' }}>
          <button
            onClick={cerrar}
            disabled={procesando}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: '#444',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: procesando ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirmar}
            disabled={procesando}
            style={{
              flex: 1,
              padding: '12px',
              background: procesando ? '#666' : (esAprobar 
                ? 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)' 
                : 'linear-gradient(135deg, #f44336 0%, #e57373 100%)'),
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: procesando ? 'not-allowed' : 'pointer',
              fontWeight: 'bold'
            }}
          >
            {procesando ? '⏳ Procesando...' : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VistaSolicitudes;