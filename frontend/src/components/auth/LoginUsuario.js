import React, { useState } from 'react';
import { autenticarUsuario } from '../../utils/auth';

// Login para Usuarios Finales (Compradores)
function LoginUsuario({ cambiarVista, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  // Función para enviar el formulario
  const enviarFormulario = (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    // Simular delay de autenticación
    setTimeout(() => {
      // Autenticar usuario
      const resultado = autenticarUsuario(email, password);

      if (resultado.success) {
        // Login exitoso
        alert(`¡Bienvenido ${resultado.usuario.nombre}!`);
        onLogin(resultado.usuario);
      } else {
        // Login fallido
        setError(resultado.mensaje);
      }
      
      setCargando(false);
    }, 500);
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
        maxWidth: '420px',
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
            🛒
          </div>
          <h1 style={{ color: '#ff9800', marginBottom: '5px' }}>
            Acceso Usuario
          </h1>
          <p style={{ color: '#aaa', fontSize: '14px' }}>
            Encuentra y compra en microempresas
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

          {/* Usuarios de prueba */}
          <div style={{
            backgroundColor: '#1a1a1a',
            padding: '12px',
            borderRadius: '5px',
            marginBottom: '20px',
            border: '1px solid #444',
            fontSize: '12px'
          }}>
            <p style={{ margin: 0, color: '#ff9800', fontWeight: 'bold', marginBottom: '8px' }}>
              🧪 Usuarios de Prueba:
            </p>
            <div style={{ marginBottom: '5px' }}>
              <p style={{ margin: 0, color: '#aaa' }}>
                📧 <strong style={{ color: '#fff' }}>usuario@gmail.com</strong> / 🔒 user123
              </p>
            </div>
            <div>
              <p style={{ margin: 0, color: '#aaa' }}>
                📧 <strong style={{ color: '#fff' }}>comprador@gmail.com</strong> / 🔒 comp123
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
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px' }}>
          <span style={{ color: '#aaa' }}>¿No tienes cuenta? </span>
          <button
            onClick={() => cambiarVista('registerUsuario')}
            disabled={cargando}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff9800',
              cursor: 'pointer',
              fontWeight: 'bold',
              textDecoration: 'underline'
            }}
          >
            Crear Cuenta
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '10px' }}>
          <button
            onClick={() => cambiarVista('recoverUsuario')}
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

        {/* Explorar sin cuenta */}
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: '#1a1a1a',
          borderRadius: '5px',
          border: '1px solid #444',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '13px' }}>
            ¿Quieres explorar primero?
          </p>
          <button
            onClick={() => cambiarVista('catalogo')}
            disabled={cargando}
            style={{
              padding: '8px 20px',
              backgroundColor: 'transparent',
              color: '#ff9800',
              border: '2px solid #ff9800',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              fontSize: '13px'
            }}
          >
            Ver Catálogo sin Cuenta
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginUsuario;