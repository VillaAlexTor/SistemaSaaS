import React, { useState } from 'react';

// Pantalla de inicio mejorada
function HomePage({ cambiarVista }) {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #252525 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative',
      padding: '20px'
    }}>
      {/* Círculos decorativos */}
      <div style={{
        position: 'absolute',
        top: '-80px',
        right: '-80px',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,152,0,0.25) 0%, rgba(255,152,0,0) 70%)',
        filter: 'blur(70px)',
        animation: 'pulse 4s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-120px',
        left: '-120px',
        width: '450px',
        height: '450px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,152,0,0.18) 0%, rgba(255,152,0,0) 70%)',
        filter: 'blur(90px)',
        animation: 'pulse 5s ease-in-out infinite'
      }}></div>

      {/* Partículas flotantes */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '10%',
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        backgroundColor: '#ff9800',
        opacity: 0.6,
        animation: 'float2 6s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        top: '60%',
        right: '15%',
        width: '3px',
        height: '3px',
        borderRadius: '50%',
        backgroundColor: '#ff9800',
        opacity: 0.4,
        animation: 'float2 7s ease-in-out infinite'
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '25%',
        left: '20%',
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        backgroundColor: '#ffb74d',
        opacity: 0.5,
        animation: 'float2 5s ease-in-out infinite'
      }}></div>

      {/* Contenido principal */}
      <div style={{
        textAlign: 'center',
        maxWidth: '950px',
        padding: '30px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo con efecto */}
        <div style={{
          fontSize: '110px',
          marginBottom: '15px',
          animation: 'float 3.5s ease-in-out infinite',
          filter: 'drop-shadow(0 0 25px rgba(255,152,0,0.4))'
        }}>
          🏪
        </div>

        {/* Título */}
        <h1 style={{
          fontSize: '52px',
          fontWeight: 'bold',
          color: '#ff9800',
          margin: '0 0 15px 0',
          textShadow: '0 0 35px rgba(255,152,0,0.6)',
          letterSpacing: '1px'
        }}>
          Sistema de Ventas
        </h1>

        {/* Subtítulo */}
        <h2 style={{
          fontSize: '26px',
          color: '#e0e0e0',
          margin: '0 0 25px 0',
          fontWeight: '300',
          opacity: 0.9
        }}>
          Para Microempresas
        </h2>

        {/* Descripción */}
        <p style={{
          fontSize: '17px',
          color: '#b8b8b8',
          lineHeight: '1.7',
          margin: '0 0 45px 0',
          maxWidth: '680px',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}>
          Gestiona tu inventario, controla tus ventas y administra tu negocio 
          de forma simple y eficiente. Todo lo que necesitas para hacer crecer 
          tu microempresa en un solo lugar.
        </p>

        {/* Características */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '35px',
          marginBottom: '45px',
          flexWrap: 'wrap'
        }}>
          {[
            { emoji: '📦', texto: 'Inventario' },
            { emoji: '💰', texto: 'Ventas' },
            { emoji: '👥', texto: 'Clientes' },
            { emoji: '📊', texto: 'Reportes' }
          ].map((item, i) => (
            <div key={i} style={{ 
              textAlign: 'center',
              padding: '15px',
              borderRadius: '12px',
              backgroundColor: 'rgba(255,152,0,0.05)',
              border: '1px solid rgba(255,152,0,0.15)',
              minWidth: '100px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,152,0,0.12)';
              e.currentTarget.style.transform = 'translateY(-5px)';
              e.currentTarget.style.borderColor = 'rgba(255,152,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255,152,0,0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255,152,0,0.15)';
            }}>
              <div style={{ fontSize: '38px', marginBottom: '8px' }}>{item.emoji}</div>
              <p style={{ color: '#ff9800', fontWeight: '600', margin: 0, fontSize: '15px' }}>
                {item.texto}
              </p>
            </div>
          ))}
        </div>

        {/* Botones */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '18px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => cambiarVista('login')}
            style={{
              padding: '14px 38px',
              fontSize: '17px',
              fontWeight: '600',
              backgroundColor: '#ff9800',
              color: '#000000',
              border: 'none',
              borderRadius: '25px',
              cursor: 'pointer',
              boxShadow: '0 6px 22px rgba(255,152,0,0.45)',
              minWidth: '190px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ffb74d';
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 10px 30px rgba(255,152,0,0.65)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ff9800';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 6px 22px rgba(255,152,0,0.45)';
            }}
          >
            Iniciar Sesión
          </button>

          <button
            onClick={() => cambiarVista('register')}
            style={{
              padding: '14px 38px',
              fontSize: '17px',
              fontWeight: '600',
              backgroundColor: 'transparent',
              color: '#ff9800',
              border: '2.5px solid #ff9800',
              borderRadius: '25px',
              cursor: 'pointer',
              minWidth: '190px',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ff9800';
              e.target.style.color = '#000000';
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 6px 22px rgba(255,152,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#ff9800';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            Registrarse Gratis
          </button>
        </div>

        {/* Texto inferior */}
        <p style={{
          marginTop: '35px',
          fontSize: '13px',
          color: '#777777',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          <span style={{ color: '#ffb74d' }}>✨</span>
          Sin costos ocultos • Plan básico gratuito • Fácil de usar
        </p>
      </div>

      {/* Animaciones */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) translateX(0px); opacity: 0.3; }
          25% { transform: translateY(-15px) translateX(5px); opacity: 0.6; }
          50% { transform: translateY(-10px) translateX(-5px); opacity: 0.8; }
          75% { transform: translateY(-20px) translateX(3px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

// Login mejorado
function LoginForm({ cambiarVista, hacerLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verPassword, setVerPassword] = useState(false);

  const enviarFormulario = () => {
    alert('Iniciando sesión...');
    hacerLogin('administrador');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decoración de fondo */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 30% 50%, rgba(255,152,0,0.08) 0%, transparent 50%)',
        pointerEvents: 'none'
      }}></div>

      <div style={{ 
        backgroundColor: '#2d2d2d', 
        padding: '40px', 
        borderRadius: '15px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,152,0,0.1)',
        width: '100%',
        maxWidth: '420px',
        border: '1px solid #3d3d3d',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo y título */}
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{ 
            width: '75px', 
            height: '75px', 
            backgroundColor: '#ff9800', 
            borderRadius: '50%',
            margin: '0 auto 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '38px',
            boxShadow: '0 4px 20px rgba(255,152,0,0.5)',
            animation: 'pulse2 3s ease-in-out infinite'
          }}>
            🏪
          </div>
          <h1 style={{ 
            color: '#ff9800', 
            marginBottom: '5px', 
            fontSize: '28px',
            fontWeight: 'bold'
          }}>
            Sistema de Ventas
          </h1>
          <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>
            Microempresas
          </p>
        </div>

        {/* Email */}
        <div style={{ marginBottom: '22px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: '#e0e0e0', 
            fontWeight: '600',
            fontSize: '14px'
          }}>
            Correo Electrónico
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ejemplo@correo.com"
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '2px solid #404040',
              borderRadius: '8px',
              fontSize: '14px',
              backgroundColor: '#1a1a1a',
              color: '#fff',
              outline: 'none',
              transition: 'all 0.3s ease',
              boxSizing: 'border-box'
            }}
            onFocus={(e) => e.target.style.borderColor = '#ff9800'}
            onBlur={(e) => e.target.style.borderColor = '#404040'}
          />
        </div>

        {/* Contraseña */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '8px', 
            color: '#e0e0e0', 
            fontWeight: '600',
            fontSize: '14px'
          }}>
            Contraseña
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type={verPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              style={{
                width: '100%',
                padding: '12px 14px',
                paddingRight: '45px',
                border: '2px solid #404040',
                borderRadius: '8px',
                fontSize: '14px',
                backgroundColor: '#1a1a1a',
                color: '#fff',
                outline: 'none',
                transition: 'all 0.3s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#ff9800'}
              onBlur={(e) => e.target.style.borderColor = '#404040'}
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
                fontSize: '20px',
                opacity: 0.7,
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.opacity = '1'}
              onMouseLeave={(e) => e.target.style.opacity = '0.7'}
            >
              {verPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        {/* Recordar y recuperar */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '25px', 
          fontSize: '13px',
          alignItems: 'center'
        }}>
          <label style={{ 
            display: 'flex', 
            alignItems: 'center', 
            color: '#aaa',
            cursor: 'pointer'
          }}>
            <input type="checkbox" style={{ marginRight: '6px', cursor: 'pointer' }} />
            Recordarme
          </label>
          <button
            onClick={() => cambiarVista('recover')}
            style={{ 
              background: 'none', 
              border: 'none', 
              color: '#ff9800', 
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>

        {/* Botón principal */}
        <button
          onClick={enviarFormulario}
          style={{
            width: '100%',
            padding: '13px',
            backgroundColor: '#ff9800',
            color: '#000000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 18px rgba(255,152,0,0.4)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#ffb74d';
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 24px rgba(255,152,0,0.6)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#ff9800';
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 18px rgba(255,152,0,0.4)';
          }}
        >
          Ingresar al Sistema
        </button>

        {/* Registro */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '25px', 
          fontSize: '14px',
          paddingTop: '20px',
          borderTop: '1px solid #3d3d3d'
        }}>
          <span style={{ color: '#aaa' }}>¿No tienes cuenta? </span>
          <button
            onClick={() => cambiarVista('register')}
            style={{
              background: 'none',
              border: 'none',
              color: '#ff9800',
              cursor: 'pointer',
              fontWeight: '600',
              textDecoration: 'none',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            Registrarse aquí
          </button>
        </div>

        {/* Volver */}
        <div style={{ textAlign: 'center', marginTop: '18px' }}>
          <button
            onClick={() => cambiarVista('home')}
            style={{
              background: 'none',
              border: 'none',
              color: '#777',
              cursor: 'pointer',
              fontSize: '13px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#aaa'}
            onMouseLeave={(e) => e.target.style.color = '#777'}
          >
            ← Volver al inicio
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse2 {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}

// App principal
function App() {
  const [vista, setVista] = useState('home');
  const [usuario, setUsuario] = useState(null);

  const hacerLogin = (rol) => {
    setUsuario(rol);
    setVista('dashboard');
  };

  if (vista === 'home') {
    return <HomePage cambiarVista={setVista} />;
  }

  if (vista === 'dashboard') {
    return (
      <div style={{ 
        padding: '40px', 
        textAlign: 'center',
        background: '#1a1a1a',
        minHeight: '100vh'
      }}>
        <h1 style={{ color: '#ff9800' }}>Dashboard - Bienvenido {usuario}</h1>
        <button
          onClick={() => setVista('home')}
          style={{
            marginTop: '20px',
            padding: '12px 30px',
            backgroundColor: '#ff9800',
            color: '#000',
            border: 'none',
            borderRadius: '8px',
            fontSize: '15px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  return <LoginForm cambiarVista={setVista} hacerLogin={hacerLogin} />;
}

export default App;