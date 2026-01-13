import React, { useState } from 'react';
import { api } from '../../services/api';

// Login Unificado - Conectado a la API real de Django
function LoginUnificado({ cambiarVista, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Función para autenticar usando la API real
  const enviarFormulario = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      // Llamar a la API real de Django
      const resultado = await api.login(email, password);
      
      console.log('📥 Respuesta del login:', resultado);

      if (resultado.success) {
        alert(`¡Bienvenido ${resultado.usuario.nombre}!`);
        onLogin(resultado.usuario);
      } else {
        setError(resultado.message || 'Email o contraseña incorrectos');
      }
    } catch (error) {
      console.error('❌ Error en login:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setCargando(false);
    }
  };

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
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(255, 152, 0, 0.4)',
        width: '100%',
        maxWidth: '450px',
        border: '2px solid #ff9800'
      }}>
        {/* Título */}
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
            boxShadow: '0 0 20px rgba(255, 152, 0, 0.5)'
          }}>
            🏪
          </div>
          <h1 style={{ color: '#ff9800', marginBottom: '5px' }}>
            Sistema de Ventas
          </h1>
          <p style={{ color: '#aaa', fontSize: '14px' }}>
            Inicia sesión con tu cuenta
          </p>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div style={{
            backgroundColor: '#4d1f1f',
            color: '#ff6b6b',
            padding: '12px',
            borderRadius: '5px',
            marginBottom: '20px',
            border: '1px solid #ff6b6b',
            fontSize: '14px'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={enviarFormulario}>
          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              color: '#fff', 
              fontWeight: 'bold' 
            }}>
              Correo Electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={cargando}
              style={{
                width: '100%',
                padding: '10px',
                border: '2px solid #3d3d3d',
                borderRadius: '5px',
                fontSize: '14px',
                backgroundColor: '#1a1a1a',
                color: '#fff'
              }}
            />
          </div>

          {/* Contraseña */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              color: '#fff', 
              fontWeight: 'bold' 
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={verPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingrese su contraseña"
                required
                disabled={cargando}
                style={{
                  width: '100%',
                  padding: '10px',
                  border: '2px solid #3d3d3d',
                  borderRadius: '5px',
                  fontSize: '14px',
                  backgroundColor: '#1a1a1a',
                  color: '#fff'
                }}
              />
              <button
                type="button"
                onClick={() => setVerPassword(!verPassword)}
                disabled={cargando}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  fontSize: '18px'
                }}
              >
                {verPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Usuario de prueba */}
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px',
            border: '1px solid #444',
            fontSize: '12px'
          }}>
            <p style={{ margin: 0, color: '#ff9800', fontWeight: 'bold', marginBottom: '10px' }}>
              🧪 Usuario de Prueba Registrado:
            </p>
            
            <div style={{ paddingLeft: '10px', borderLeft: '3px solid #ff9800' }}>
              <p style={{ margin: 0, color: '#ff9800', fontWeight: 'bold', fontSize: '11px' }}>
                🛒 USUARIO
              </p>
              <p style={{ margin: 0, color: '#aaa' }}>
                📧 <strong style={{ color: '#fff' }}>alejandro@gmail.com</strong> / 🔒 123456
              </p>
            </div>
          </div>

          {/* Botón Ingresar */}
          <button
            type="submit"
            disabled={cargando}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: cargando ? '#666' : '#ff9800',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: cargando ? 'not-allowed' : 'pointer',
              boxShadow: cargando ? 'none' : '0 4px 15px rgba(255, 152, 0, 0.4)'
            }}
          >
            {cargando ? '⏳ Verificando...' : '🔐 Iniciar Sesión'}
          </button>
        </form>

        {/* Links */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px', 
          fontSize: '14px',
          paddingTop: '20px',
          borderTop: '1px solid #3d3d3d'
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#aaa' }}>¿No tienes cuenta?</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '15px' }}>
            <button
              onClick={() => cambiarVista('register')}
              disabled={cargando}
              style={{
                background: 'none',
                border: 'none',
                color: '#2196f3',
                cursor: 'pointer',
                fontWeight: 'bold',
                textDecoration: 'underline',
                fontSize: '13px'
              }}
            >
              Registrar Empresa
            </button>
            <span style={{ color: '#666' }}>|</span>
            <button
              onClick={() => cambiarVista('registerUsuario')}
              disabled={cargando}
              style={{
                background: 'none',
                border: 'none',
                color: '#ff9800',
                cursor: 'pointer',
                fontWeight: 'bold',
                textDecoration: 'underline',
                fontSize: '13px'
              }}
            >
              Crear Cuenta Usuario
            </button>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button
            onClick={() => cambiarVista('recover')}
            disabled={cargando}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff9800',
              cursor: 'pointer',
              fontSize: '13px',
              textDecoration: 'underline'
            }}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Volver */}
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button
            onClick={() => cambiarVista('home')}
            disabled={cargando}
            style={{
              background: 'none',
              border: 'none',
              color: '#888',
              cursor: 'pointer',
              fontSize: '13px'
            }}
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginUnificado;