import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

function ResetPasswordForm({ cambiarVista }) {
  const [token, setToken] = useState('');
  const [tipo, setTipo] = useState('usuario');
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [verPassword2, setVerPassword2] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState(false);

  useEffect(() => {
    // ✅ CORREGIDO: Obtener el token y tipo desde la URL usando window.location
    const params = new URLSearchParams(window.location.search);
    const tokenParam = params.get('token');
    const tipoParam = params.get('tipo');

    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError('Token no encontrado en la URL');
    }

    if (tipoParam) {
      setTipo(tipoParam);
    }
  }, []);

  const enviar = async (e) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Token inválido o expirado');
      return;
    }

    if (nuevaPassword !== confirmarPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (nuevaPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setCargando(true);

    const resultado = await api.restablecerPassword(token, tipo, nuevaPassword);

    if (resultado.success) {
      setExito(true);
    } else {
      setError(resultado.message || 'Error al restablecer la contraseña');
    }

    setCargando(false);
  };

  // Pantalla de éxito
  if (exito) {
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
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>
            🎉
          </div>
          <h2 style={{ color: '#ff9800', marginBottom: '15px', fontSize: '24px' }}>
            ¡Contraseña Restablecida!
          </h2>
          <p style={{ color: '#aaa', marginBottom: '30px', lineHeight: '1.6' }}>
            Tu contraseña ha sido actualizada exitosamente.
            Ya puedes iniciar sesión con tu nueva contraseña.
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
            Ir al Login
          </button>
        </div>
      </div>
    );
  }

  // Formulario para restablecer contraseña
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
            🔒
          </div>
          <h1 style={{ color: '#ff9800', marginBottom: '10px', fontSize: '26px' }}>
            Nueva Contraseña
          </h1>
          <p style={{ color: '#aaa', fontSize: '14px' }}>
            Ingresa tu nueva contraseña
          </p>
        </div>

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

        <form onSubmit={enviar}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#fff', 
              fontSize: '14px' 
            }}>
              Nueva Contraseña *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={verPassword ? "text" : "password"}
                value={nuevaPassword}
                onChange={(e) => setNuevaPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength="6"
                style={{
                  width: '100%',
                  padding: '12px',
                  paddingRight: '45px',
                  border: '2px solid #444',
                  borderRadius: '8px',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  fontSize: '14px',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff9800'}
                onBlur={(e) => e.target.style.borderColor = '#444'}
              />
              <button
                type="button"
                onClick={() => setVerPassword(!verPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                {verPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 'bold', 
              color: '#fff', 
              fontSize: '14px' 
            }}>
              Confirmar Contraseña *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={verPassword2 ? "text" : "password"}
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                placeholder="Repetir contraseña"
                required
                style={{
                  width: '100%',
                  padding: '12px',
                  paddingRight: '45px',
                  border: '2px solid #444',
                  borderRadius: '8px',
                  backgroundColor: '#1a1a1a',
                  color: '#fff',
                  fontSize: '14px',
                  transition: 'border-color 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#ff9800'}
                onBlur={(e) => e.target.style.borderColor = '#444'}
              />
              <button
                type="button"
                onClick={() => setVerPassword2(!verPassword2)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '20px'
                }}
              >
                {verPassword2 ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando || !token}
            style={{
              width: '100%',
              padding: '14px',
              background: (cargando || !token) ? '#666' : 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
              color: (cargando || !token) ? '#aaa' : '#000',
              border: 'none',
              borderRadius: '10px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: (cargando || !token) ? 'not-allowed' : 'pointer',
              boxShadow: (cargando || !token) ? 'none' : '0 6px 20px rgba(255,152,0,0.4)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (!cargando && token) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(255,152,0,0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!cargando && token) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 6px 20px rgba(255,152,0,0.4)';
              }
            }}
          >
            {cargando ? '⏳ Actualizando...' : '🔒 Restablecer Contraseña'}
          </button>
        </form>

        {/* Info adicional */}
        <div style={{ 
          marginTop: '25px', 
          paddingTop: '20px', 
          borderTop: '1px solid #3d3d3d',
          textAlign: 'center'
        }}>
          <button
            onClick={() => cambiarVista('login')}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff9800',
              cursor: 'pointer',
              fontSize: '14px',
              textDecoration: 'underline'
            }}
          >
            ← Volver al Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPasswordForm;