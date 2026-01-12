import React from 'react';

// Pantalla de inicio simplificada
function HomePage({ cambiarVista }) {
  return (
    <div style={{
      height: '100vh',
      width: '100%',
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #2d2d2d 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Decoración de fondo */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,152,0,0.3) 0%, rgba(255,152,0,0) 70%)',
        filter: 'blur(60px)'
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-150px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,152,0,0.2) 0%, rgba(255,152,0,0) 70%)',
        filter: 'blur(80px)'
      }}></div>

      {/* Contenido principal */}
      <div style={{
        textAlign: 'center',
        maxWidth: '900px',
        padding: '40px',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Logo */}
        <div style={{
          fontSize: '120px',
          marginBottom: '20px',
          animation: 'float 3s ease-in-out infinite'
        }}>
          🏪
        </div>

        {/* Título */}
        <h1 style={{
          fontSize: '56px',
          fontWeight: 'bold',
          color: '#ff9800',
          margin: '0 0 20px 0',
          textShadow: '0 0 30px rgba(255,152,0,0.5)'
        }}>
          Sistema de Ventas
        </h1>

        {/* Subtítulo */}
        <h2 style={{
          fontSize: '28px',
          color: '#ffffff',
          margin: '0 0 30px 0',
          fontWeight: 'normal'
        }}>
          Para Microempresas
        </h2>

        {/* Descripción */}
        <p style={{
          fontSize: '18px',
          color: '#cccccc',
          lineHeight: '1.8',
          margin: '0 0 50px 0',
          maxWidth: '700px',
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
          gap: '40px',
          marginBottom: '50px',
          flexWrap: 'wrap'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
            <p style={{ color: '#ff9800', fontWeight: 'bold', margin: 0 }}>Inventario</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>💰</div>
            <p style={{ color: '#ff9800', fontWeight: 'bold', margin: 0 }}>Ventas</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>👥</div>
            <p style={{ color: '#ff9800', fontWeight: 'bold', margin: 0 }}>Clientes</p>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📊</div>
            <p style={{ color: '#ff9800', fontWeight: 'bold', margin: 0 }}>Reportes</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={() => cambiarVista('login')}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: '#ff9800',
              color: '#000000',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              boxShadow: '0 5px 20px rgba(255,152,0,0.4)',
              minWidth: '200px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ffb74d';
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(255,152,0,0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#ff9800';
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 5px 20px rgba(255,152,0,0.4)';
            }}
          >
            Iniciar Sesión
          </button>

          <button
            onClick={() => cambiarVista('catalogo')}
            style={{
              padding: '15px 40px',
              fontSize: '18px',
              fontWeight: 'bold',
              backgroundColor: 'transparent',
              color: '#ff9800',
              border: '3px solid #ff9800',
              borderRadius: '30px',
              cursor: 'pointer',
              minWidth: '200px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#ff9800';
              e.target.style.color = '#000000';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'transparent';
              e.target.style.color = '#ff9800';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Ver Empresas
          </button>
        </div>

        {/* Texto inferior */}
        <p style={{
          marginTop: '40px',
          fontSize: '14px',
          color: '#888888'
        }}>
          ✨ Sin costos ocultos • Plan básico gratuito • Fácil de usar
        </p>
      </div>

      {/* Animación CSS */}
      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
}

export default HomePage;