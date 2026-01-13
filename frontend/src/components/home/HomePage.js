import React from 'react';

// Pantalla de inicio mejorada
function HomePage({ cambiarVista }) {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Partículas de fondo animadas */}
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '15%',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,152,0,0.15) 0%, rgba(255,152,0,0) 70%)',
        filter: 'blur(40px)',
        animation: 'pulse 4s ease-in-out infinite'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '10%',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,152,0,0.1) 0%, rgba(255,152,0,0) 70%)',
        filter: 'blur(60px)',
        animation: 'pulse 5s ease-in-out infinite reverse'
      }}></div>

      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,152,0,0.05) 0%, rgba(255,152,0,0) 70%)',
        filter: 'blur(80px)',
        transform: 'translate(-50%, -50%)',
        animation: 'rotate 20s linear infinite'
      }}></div>

      {/* Grid decorativo */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(255,152,0,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,152,0,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        opacity: 0.3
      }}></div>

      {/* Contenido principal */}
      <div style={{
        textAlign: 'center',
        maxWidth: '1100px',
        padding: '40px 20px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo con efecto glassmorphism */}
        <div style={{
          display: 'inline-block',
          padding: '30px',
          marginBottom: '30px',
          background: 'rgba(255,152,0,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '30px',
          border: '2px solid rgba(255,152,0,0.2)',
          boxShadow: '0 8px 32px rgba(255,152,0,0.2)',
          animation: 'float 3s ease-in-out infinite'
        }}>
          <div style={{
            fontSize: '100px',
            filter: 'drop-shadow(0 0 20px rgba(255,152,0,0.5))'
          }}>
            🏪
          </div>
        </div>

        {/* Título principal con gradiente */}
        <h1 style={{
          fontSize: '64px',
          fontWeight: '900',
          background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 50%, #ff9800 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '0 0 15px 0',
          textShadow: '0 0 40px rgba(255,152,0,0.3)',
          letterSpacing: '-2px'
        }}>
          Sistema de Ventas
        </h1>

        {/* Badge "Para Microempresas" */}
        <div style={{
          display: 'inline-block',
          padding: '10px 25px',
          background: 'rgba(255,152,0,0.15)',
          border: '2px solid rgba(255,152,0,0.3)',
          borderRadius: '25px',
          marginBottom: '30px',
          backdropFilter: 'blur(10px)'
        }}>
          <h2 style={{
            fontSize: '18px',
            color: '#ff9800',
            margin: 0,
            fontWeight: '600',
            letterSpacing: '1px',
            textTransform: 'uppercase'
          }}>
            ⚡ Para Microempresas
          </h2>
        </div>

        {/* Descripción */}
        <p style={{
          fontSize: '20px',
          color: '#b0b0b0',
          lineHeight: '1.8',
          margin: '0 auto 60px auto',
          maxWidth: '750px',
          fontWeight: '300'
        }}>
          Gestiona tu inventario, controla tus ventas y administra tu negocio 
          de forma <span style={{ color: '#ff9800', fontWeight: '500' }}>simple y eficiente</span>. 
          Todo lo que necesitas para hacer crecer tu microempresa en un solo lugar.
        </p>

        {/* Características con cards mejoradas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '25px',
          marginBottom: '60px',
          maxWidth: '900px',
          margin: '0 auto 60px auto'
        }}>
          {[
            { emoji: '📦', titulo: 'Inventario', desc: 'Control total' },
            { emoji: '💰', titulo: 'Ventas', desc: 'Gestión rápida' },
            { emoji: '👥', titulo: 'Clientes', desc: 'Base de datos' },
            { emoji: '📊', titulo: 'Reportes', desc: 'Análisis detallado' }
          ].map((item, index) => (
            <div
              key={index}
              style={{
                padding: '30px 20px',
                background: 'rgba(45,45,45,0.4)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                border: '1px solid rgba(255,152,0,0.2)',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.background = 'rgba(255,152,0,0.1)';
                e.currentTarget.style.borderColor = 'rgba(255,152,0,0.5)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(255,152,0,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(45,45,45,0.4)';
                e.currentTarget.style.borderColor = 'rgba(255,152,0,0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ 
                fontSize: '50px', 
                marginBottom: '15px',
                filter: 'drop-shadow(0 4px 8px rgba(255,152,0,0.3))'
              }}>
                {item.emoji}
              </div>
              <p style={{ 
                color: '#ff9800', 
                fontWeight: '700', 
                margin: '0 0 5px 0',
                fontSize: '18px'
              }}>
                {item.titulo}
              </p>
              <p style={{
                color: '#888',
                fontSize: '13px',
                margin: 0,
                fontWeight: '400'
              }}>
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Botones de acción mejorados */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '50px'
        }}>
          <button
            onClick={() => cambiarVista('login')}
            style={{
              padding: '18px 50px',
              fontSize: '18px',
              fontWeight: '700',
              background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
              color: '#000000',
              border: 'none',
              borderRadius: '50px',
              cursor: 'pointer',
              boxShadow: '0 10px 30px rgba(255,152,0,0.4)',
              minWidth: '220px',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-3px) scale(1.02)';
              e.target.style.boxShadow = '0 15px 40px rgba(255,152,0,0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 10px 30px rgba(255,152,0,0.4)';
            }}
          >
            🚀 Iniciar Sesión
          </button>

          <button
            onClick={() => cambiarVista('catalogo')}
            style={{
              padding: '18px 50px',
              fontSize: '18px',
              fontWeight: '700',
              background: 'rgba(255,152,0,0.1)',
              color: '#ff9800',
              border: '2px solid #ff9800',
              borderRadius: '50px',
              cursor: 'pointer',
              minWidth: '220px',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = '#ff9800';
              e.target.style.color = '#000000';
              e.target.style.transform = 'translateY(-3px) scale(1.02)';
              e.target.style.boxShadow = '0 10px 30px rgba(255,152,0,0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,152,0,0.1)';
              e.target.style.color = '#ff9800';
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = 'none';
            }}
          >
            🛒 Ver Empresas
          </button>
        </div>

        {/* Features badges */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '30px',
          flexWrap: 'wrap',
          marginTop: '40px'
        }}>
          {['✨ Sin costos ocultos', '🎁 Plan básico gratuito', '⚡ Fácil de usar'].map((text, i) => (
            <div
              key={i}
              style={{
                padding: '8px 20px',
                background: 'rgba(255,152,0,0.08)',
                border: '1px solid rgba(255,152,0,0.2)',
                borderRadius: '20px',
                fontSize: '14px',
                color: '#b0b0b0',
                fontWeight: '500'
              }}
            >
              {text}
            </div>
          ))}
        </div>

        {/* Footer text */}
        <p style={{
          marginTop: '60px',
          fontSize: '13px',
          color: '#666',
          fontWeight: '300'
        }}>
          © 2026 Sistema de Ventas • Hecho con ❤️ para microempresas
        </p>
      </div>

      {/* Animaciones CSS mejoradas */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.1);
          }
        }

        @keyframes rotate {
          from {
            transform: translate(-50%, -50%) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg);
          }
        }

        button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        button:active {
          transform: scale(0.98) !important;
        }
      `}</style>
    </div>
  );
}

export default HomePage;