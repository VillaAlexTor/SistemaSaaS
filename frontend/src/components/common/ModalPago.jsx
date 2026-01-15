import React, { useState } from 'react';

function ModalPago({ cerrar, onPagoExitoso, monto = 120 }) {
  const [metodoPago, setMetodoPago] = useState('qr'); // 'qr' o 'tarjeta'
  const [cargando, setCargando] = useState(false);
  const [datosTarjeta, setDatosTarjeta] = useState({
    numero: '',
    nombre: '',
    vencimiento: '',
    cvv: ''
  });

  // Simular procesamiento de pago
  const procesarPago = async () => {
    setCargando(true);

    // Validaciones
    if (metodoPago === 'tarjeta') {
      if (!datosTarjeta.numero || !datosTarjeta.nombre || !datosTarjeta.vencimiento || !datosTarjeta.cvv) {
        alert('❌ Por favor completa todos los datos de la tarjeta');
        setCargando(false);
        return;
      }

      // Validar formato de tarjeta
      if (datosTarjeta.numero.replace(/\s/g, '').length !== 16) {
        alert('❌ El número de tarjeta debe tener 16 dígitos');
        setCargando(false);
        return;
      }

      if (datosTarjeta.cvv.length !== 3) {
        alert('❌ El CVV debe tener 3 dígitos');
        setCargando(false);
        return;
      }
    }

    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simular éxito (en producción aquí iría la llamada real a la pasarela)
    const exito = true; // Cambiar a lógica real cuando integres pasarela

    if (exito) {
      alert('✅ ¡Pago procesado exitosamente!');
      if (onPagoExitoso) {
        onPagoExitoso({
          metodo: metodoPago,
          monto: monto,
          fecha: new Date().toISOString()
        });
      }
      cerrar();
    } else {
      alert('❌ Error al procesar el pago. Intenta nuevamente.');
    }

    setCargando(false);
  };

  const formatearNumeroTarjeta = (valor) => {
    const numeros = valor.replace(/\s/g, '');
    const grupos = numeros.match(/.{1,4}/g);
    return grupos ? grupos.join(' ') : numeros;
  };

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
    }}>
      <div style={{
        backgroundColor: '#2d2d2d',
        borderRadius: '15px',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '2px solid #ff9800'
      }}>
        {/* Header */}
        <div style={{
          padding: '25px 30px',
          borderBottom: '2px solid #ff9800',
          backgroundColor: '#1a1a1a',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, color: '#ff9800', fontSize: '24px' }}>
              💳 Procesar Pago
            </h2>
            <p style={{ margin: '5px 0 0 0', color: '#aaa', fontSize: '13px' }}>
              Plan Premium - ${monto} USD/mes
            </p>
          </div>
          <button
            onClick={cerrar}
            disabled={cargando}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f44336',
              color: '#fff',
              fontSize: '24px',
              cursor: cargando ? 'not-allowed' : 'pointer',
              opacity: cargando ? 0.5 : 1
            }}
          >
            ✕
          </button>
        </div>

        {/* Contenido */}
        <div style={{ padding: '30px' }}>
          {/* Selector de método de pago */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '10px', color: '#fff', fontWeight: 'bold' }}>
              Método de Pago
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <button
                type="button"
                onClick={() => setMetodoPago('qr')}
                disabled={cargando}
                style={{
                  padding: '15px',
                  border: metodoPago === 'qr' ? '3px solid #ff9800' : '2px solid #444',
                  borderRadius: '10px',
                  backgroundColor: metodoPago === 'qr' ? '#2d2410' : '#1a1a1a',
                  color: '#fff',
                  cursor: cargando ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                📱 QR / Transferencia
              </button>
              <button
                type="button"
                onClick={() => setMetodoPago('tarjeta')}
                disabled={cargando}
                style={{
                  padding: '15px',
                  border: metodoPago === 'tarjeta' ? '3px solid #ff9800' : '2px solid #444',
                  borderRadius: '10px',
                  backgroundColor: metodoPago === 'tarjeta' ? '#2d2410' : '#1a1a1a',
                  color: '#fff',
                  cursor: cargando ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                💳 Tarjeta
              </button>
            </div>
          </div>

          {/* Contenido según método */}
          {metodoPago === 'qr' ? (
            <div style={{
              padding: '30px',
              backgroundColor: '#1a1a1a',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <h3 style={{ color: '#ff9800', marginBottom: '20px' }}>
                Escanea el código QR
              </h3>
              
              {/* QR Code simulado */}
              <div style={{
                width: '250px',
                height: '250px',
                margin: '0 auto 20px',
                backgroundColor: '#fff',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '120px'
              }}>
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=Pago-Premium-$29" 
                  alt="QR Code"
                  style={{ width: '100%', height: '100%', borderRadius: '10px' }}
                />
              </div>

              <div style={{
                backgroundColor: '#2d2d2d',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '15px'
              }}>
                <p style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '13px' }}>
                  Número de cuenta:
                </p>
                <p style={{ margin: 0, color: '#fff', fontWeight: 'bold', fontSize: '18px', fontFamily: 'monospace' }}>
                  1234-5678-9012-3456
                </p>
              </div>

              <p style={{ margin: 0, color: '#aaa', fontSize: '13px' }}>
                Monto a pagar: <strong style={{ color: '#ff9800', fontSize: '18px' }}>$ {monto}</strong>
              </p>
              <p style={{ margin: '10px 0 0 0', color: '#666', fontSize: '12px' }}>
                Después de realizar el pago, haz clic en "Confirmar Pago"
              </p>
            </div>
          ) : (
            <div>
              <h3 style={{ color: '#ff9800', marginBottom: '20px' }}>
                Datos de la Tarjeta
              </h3>

              <div style={{ display: 'grid', gap: '15px' }}>
                {/* Número de tarjeta */}
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                    Número de Tarjeta *
                  </label>
                  <input
                    type="text"
                    value={datosTarjeta.numero}
                    onChange={(e) => {
                      const valor = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
                      if (valor.length <= 16) {
                        setDatosTarjeta({ ...datosTarjeta, numero: formatearNumeroTarjeta(valor) });
                      }
                    }}
                    placeholder="1234 5678 9012 3456"
                    disabled={cargando}
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '2px solid #444',
                      backgroundColor: '#1a1a1a',
                      color: '#fff',
                      fontSize: '16px',
                      fontFamily: 'monospace',
                      letterSpacing: '2px'
                    }}
                  />
                </div>

                {/* Nombre */}
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                    Nombre en la Tarjeta *
                  </label>
                  <input
                    type="text"
                    value={datosTarjeta.nombre}
                    onChange={(e) => setDatosTarjeta({ ...datosTarjeta, nombre: e.target.value.toUpperCase() })}
                    placeholder="JUAN PEREZ"
                    disabled={cargando}
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

                {/* Vencimiento y CVV */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                      Vencimiento (MM/AA) *
                    </label>
                    <input
                      type="text"
                      value={datosTarjeta.vencimiento}
                      onChange={(e) => {
                        let valor = e.target.value.replace(/\D/g, '');
                        if (valor.length >= 2) {
                          valor = valor.slice(0, 2) + '/' + valor.slice(2, 4);
                        }
                        if (valor.length <= 5) {
                          setDatosTarjeta({ ...datosTarjeta, vencimiento: valor });
                        }
                      }}
                      placeholder="MM/AA"
                      disabled={cargando}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid #444',
                        backgroundColor: '#1a1a1a',
                        color: '#fff',
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        textAlign: 'center'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                      CVV *
                    </label>
                    <input
                      type="password"
                      value={datosTarjeta.cvv}
                      onChange={(e) => {
                        const valor = e.target.value.replace(/\D/g, '');
                        if (valor.length <= 3) {
                          setDatosTarjeta({ ...datosTarjeta, cvv: valor });
                        }
                      }}
                      placeholder="123"
                      maxLength="3"
                      disabled={cargando}
                      style={{
                        width: '100%',
                        padding: '12px',
                        borderRadius: '8px',
                        border: '2px solid #444',
                        backgroundColor: '#1a1a1a',
                        color: '#fff',
                        fontSize: '16px',
                        fontFamily: 'monospace',
                        textAlign: 'center'
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Info de seguridad */}
              <div style={{
                marginTop: '20px',
                padding: '12px',
                backgroundColor: '#1a1a1a',
                borderRadius: '8px',
                border: '1px solid #444'
              }}>
                <p style={{ margin: 0, color: '#aaa', fontSize: '12px', lineHeight: '1.6' }}>
                  🔒 Tu información está segura. Usamos encriptación SSL para proteger tus datos.
                </p>
              </div>
            </div>
          )}

          {/* Botones */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '25px' }}>
            <button
              type="button"
              onClick={cerrar}
              disabled={cargando}
              style={{
                flex: 1,
                padding: '14px',
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: cargando ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                opacity: cargando ? 0.5 : 1
              }}
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={procesarPago}
              disabled={cargando}
              style={{
                flex: 1,
                padding: '14px',
                background: cargando ? '#666' : 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                color: cargando ? '#aaa' : '#000',
                border: 'none',
                borderRadius: '8px',
                cursor: cargando ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                fontSize: '16px',
                boxShadow: cargando ? 'none' : '0 4px 15px rgba(255,152,0,0.4)'
              }}
            >
              {cargando ? '⏳ Procesando...' : `💳 Pagar $${monto} USD`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalPago;