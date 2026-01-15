import React, { useState } from 'react';
import { api } from '../../services/api';

function RecoverPasswordForm({ cambiarVista }) {
  const [email, setEmail] = useState('');
  const [tipo, setTipo] = useState('usuario'); 
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const enviarCorreo = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    const resultado = await api.solicitarRecuperacion(email, tipo);

    if (resultado.success) {
      setEnviado(true);
    } else {
      setError(resultado.message || 'Error al enviar el correo');
    }

    setCargando(false);
  };

  // Si ya se envió el correo
  if (enviado) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        padding: '20px'
      }}>
        <div style={{ 
          backgroundColor: '#2d2d2d', 
          padding: '40px', 
          borderRadius: '15px',
          boxShadow: '0 8px 30px rgba(255,152,0,0.4)',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          border: '2px solid #ff9800'
        }}>
          <div style={{ 
            fontSize: '80px', 
            marginBottom: '20px',
            animation: 'bounce 1s ease-in-out'
          }}>
            ✅
          </div>
          <h2 style={{ color: '#ff9800', marginBottom: '15px', fontSize: '24px' }}>
            ¡Correo Enviado!
          </h2>
          <p style={{ color: '#aaa', marginBottom: '10px', lineHeight: '1.6' }}>
            Hemos enviado un enlace de recuperación a:
          </p>
          <p style={{ color: '#fff', fontWeight: 'bold', marginBottom: '25px' }}>
            {email}
          </p>
          <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '30px', lineHeight: '1.6' }}>
            Por favor revisa tu bandeja de entrada y tu carpeta de spam.
            El enlace es válido por <strong style={{ color: '#ff9800' }}>1 hora</strong>.
          </p>
          <button
            onClick={() => cambiarVista('login')}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
              color: '#000',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '16px',
              boxShadow: '0 6px 20px rgba(255,152,0,0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(255,152,0,0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 6px 20px rgba(255,152,0,0.4)';
            }}
          >
            Volver al Login
          </button>
        </div>
      </div>
    );
  }

  // Formulario de recuperación
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#1a1a1a',
      padding: '20px'
    }}>
      <div style={{ 
        backgroundColor: '#2d2d2d', 
        padding: '40px', 
        borderRadius: '15px',
        boxShadow: '0 8px 30px rgba(255,152,0,0.4)',
        maxWidth: '500px',
        width: '100%',
        border: '2px solid #ff9800'
      }}>
        {/* Icono y título */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            backgroundColor: '#ff9800',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px',
            boxShadow: '0 0 20px rgba(255,152,0,0.5)'
          }}>
            🔑
          </div>
          <h1 style={{ color: '#ff9800', marginBottom: '10px', fontSize: '26px' }}>
            Recuperar Contraseña
          </h1>
          <p style={{ color: '#aaa', fontSize: '14px' }}>
            Ingresa tu correo para recibir un enlace de recuperación
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div style={{
            backgroundColor: '#4d1f1f',
            color: '#ff6b6b',
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #ff6b6b',
            fontSize: '14px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={enviarCorreo}>
          {/* Selector de tipo de cuenta */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#fff', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              Tipo de Cuenta
            </label>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setTipo('usuario')}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: tipo === 'usuario' ? '#ff9800' : 'transparent',
                  color: tipo === 'usuario' ? '#000' : '#ff9800',
                  border: '2px solid #ff9800',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                👤 Usuario
              </button>
              <button
                type="button"
                onClick={() => setTipo('microempresa')}
                style={{
                  flex: 1,
                  padding: '12px',
                  backgroundColor: tipo === 'microempresa' ? '#ff9800' : 'transparent',
                  color: tipo === 'microempresa' ? '#000' : '#ff9800',
                  border: '2px solid #ff9800',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  transition: 'all 0.3s ease'
                }}
              >
                🏪 Microempresa
              </button>
            </div>
          </div>

          {/* Email */}
          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              color: '#fff', 
              fontWeight: 'bold',
              fontSize: '14px'
            }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              required
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #444',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                transition: 'border-color 0.3s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff9800'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
          </div>

          {/* Botones */}
          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%',
              padding: '14px',
              background: cargando ? '#666' : 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
              color: cargando ? '#aaa' : '#000',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: cargando ? 'not-allowed' : 'pointer',
              marginBottom: '15px',
              boxShadow: cargando ? 'none' : '0 6px 20px rgba(255,152,0,0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!cargando) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255,152,0,0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!cargando) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(255,152,0,0.4)';
              }
            }}
          >
            {cargando ? '⏳ Enviando...' : '📧 Enviar Enlace de Recuperación'}
          </button>

          <button
            type="button"
            onClick={() => cambiarVista('login')}
            disabled={cargando}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: 'transparent',
              color: '#ff9800',
              border: '2px solid #ff9800',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: cargando ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!cargando) e.target.style.backgroundColor = 'rgba(255,152,0,0.1)';
            }}
            onMouseLeave={(e) => {
              if (!cargando) e.target.style.backgroundColor = 'transparent';
            }}
          >
            ← Volver al Login
          </button>
        </form>

        {/* Info adicional */}
        <div style={{ 
          marginTop: '25px', 
          paddingTop: '20px', 
          borderTop: '1px solid #3d3d3d',
          textAlign: 'center'
        }}>
          <p style={{ color: '#aaa', fontSize: '13px', margin: 0 }}>
            💡 El enlace de recuperación expirará en 1 hora
          </p>
        </div>
      </div>
    </div>
  );
}

export default RecoverPasswordForm;