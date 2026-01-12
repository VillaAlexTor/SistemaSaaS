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
        backgroundColor: '#e8f5e9'
      }}>
        <div style={{ 
          backgroundColor: 'white', 
          padding: '40px', 
          borderRadius: '10px',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          width: '400px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>
            ✅
          </div>
          <h2 style={{ color: '#2e7d32', marginBottom: '15px' }}>
            Correo Enviado
          </h2>
          <p style={{ color: '#666', marginBottom: '25px' }}>
            Hemos enviado un enlace de recuperación a tu correo electrónico. 
            Por favor revisa tu bandeja de entrada.
          </p>
          <button
            onClick={() => cambiarVista('login')}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold'
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
      backgroundColor: '#e8f5e9'
    }}>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '400px'
      }}>
        {/* Icono y título */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '60px', marginBottom: '15px' }}>
            🔑
          </div>
          <h1 style={{ color: '#2e7d32', marginBottom: '10px' }}>
            Recuperar Contraseña
          </h1>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Ingresa tu correo y te enviaremos un enlace
          </p>
        </div>

        {/* Formulario */}
        <form onSubmit={enviarCorreo}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '5px', 
              color: '#333', 
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
                border: '2px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#4caf50',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginBottom: '15px'
            }}
          >
            Enviar Enlace
          </button>

          <button
            type="button"
            onClick={() => cambiarVista('login')}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'transparent',
              color: '#4caf50',
              border: '2px solid #4caf50',
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