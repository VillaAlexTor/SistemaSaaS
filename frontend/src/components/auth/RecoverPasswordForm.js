import React, { useState } from 'react';

// Componente para recuperar contraseña
function RecoverPasswordForm({ cambiarVista }) {
  const [email, setEmail] = useState('');
  const [enviado, setEnviado] = useState(false);

  // Función para enviar el correo
  const enviarCorreo = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar el correo
    setEnviado(true);
  };

  // Si ya se envió el correo
  if (enviado) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#1a1a1a'
      }}>
        <div style={{ 
          backgroundColor: '#2d2d2d', 
          padding: '40px', 
          borderRadius: '10px',
          boxShadow: '0 4px 20px rgba(255,152,0,0.3)',
          width: '400px',
          textAlign: 'center',
          border: '1px solid #3d3d3d'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>
            ✅
          </div>
          <h2 style={{ color: '#ff9800', marginBottom: '15px' }}>
            Correo Enviado
          </h2>
          <p style={{ color: '#aaa', marginBottom: '25px' }}>
            Hemos enviado un enlace de recuperación a tu correo electrónico. 
            Por favor revisa tu bandeja de entrada.
          </p>
          <button
            onClick={() => cambiarVista('login')}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#ff9800',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(255,152,0,0.4)'
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
      backgroundColor: '#1a1a1a'
    }}>
      <div style={{ 
        backgroundColor: '#2d2d2d', 
        padding: '40px', 
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(255,152,0,0.3)',
        width: '400px',
        border: '1px solid #3d3d3d'
      }}>
        {/* Icono y título */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '60px', marginBottom: '15px' }}>
            🔑
          </div>
          <h1 style={{ color: '#ff9800', marginBottom: '10px' }}>
            Recuperar Contraseña
          </h1>
          <p style={{ color: '#aaa', fontSize: '14px' }}>
            Ingresa tu correo para recibir un enlace de recuperación
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={enviarCorreo}>
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
              placeholder="ejemplo@correo.com"
              required
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

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#ff9800',
              color: '#000',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '15px',
              boxShadow: '0 4px 15px rgba(255,152,0,0.4)'
            }}
          >
            Enviar Enlace de Recuperación
          </button>

          <button
            type="button"
            onClick={() => cambiarVista('login')}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              color: '#ff9800',
              border: '2px solid #ff9800',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Volver al Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default RecoverPasswordForm;
