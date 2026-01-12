import React, { useState } from 'react';

// Formulario de Registro de Microempresa
function RegisterForm({ cambiarVista }) {
  // Datos del formulario
  const [datos, setDatos] = useState({
    nombreEmpresa: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
    nombreAdmin: '',
    password: '',
    password2: '',
    plan: 'basico'
  });

  // Cambiar datos del formulario
  const cambiarDato = (campo, valor) => {
    setDatos({ ...datos, [campo]: valor });
  };

  // Enviar formulario
  const enviar = (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (datos.password !== datos.password2) {
      alert('Las contraseñas no coinciden');
      return;
    }

    alert('Registro exitoso!');
    cambiarVista('login');
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#0d0d0d',
      backgroundImage: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: '#1e1e1e',
        padding: '30px',
        borderRadius: '15px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        border: '1px solid #333'
      }}>
        {/* Encabezado */}
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#ff6b35', marginBottom: '10px' }}>
            📝 Registro de Microempresa
          </h1>
          <p style={{ color: '#888' }}>Completa todos los datos para registrarte</p>
        </div>

        {/* Formulario */}
        <form onSubmit={enviar}>
          {/* Datos de la Empresa */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#ff6b35', marginBottom: '15px', borderBottom: '2px solid #ff6b35', paddingBottom: '5px' }}>
              Datos de la Empresa
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#e0e0e0' }}>
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  value={datos.nombreEmpresa}
                  onChange={(e) => cambiarDato('nombreEmpresa', e.target.value)}
                  placeholder="Ej: Tienda Don Juan"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '2px solid #333', 
                    borderRadius: '8px',
                    backgroundColor: '#2a2a2a',
                    color: '#e0e0e0'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#e0e0e0' }}>
                  NIT/RUC *
                </label>
                <input
                  type="text"
                  value={datos.nit}
                  onChange={(e) => cambiarDato('nit', e.target.value)}
                  placeholder="1234567890"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '2px solid #333', 
                    borderRadius: '8px',
                    backgroundColor: '#2a2a2a',
                    color: '#e0e0e0'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#e0e0e0' }}>
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={datos.telefono}
                  onChange={(e) => cambiarDato('telefono', e.target.value)}
                  placeholder="+591 12345678"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '2px solid #333', 
                    borderRadius: '8px',
                    backgroundColor: '#2a2a2a',
                    color: '#e0e0e0'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#e0e0e0' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={datos.email}
                  onChange={(e) => cambiarDato('email', e.target.value)}
                  placeholder="correo@empresa.com"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '2px solid #333', 
                    borderRadius: '8px',
                    backgroundColor: '#2a2a2a',
                    color: '#e0e0e0'
                  }}
                />
              </div>
            </div>

            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#e0e0e0' }}>
                Dirección *
              </label>
              <input
                type="text"
                value={datos.direccion}
                onChange={(e) => cambiarDato('direccion', e.target.value)}
                placeholder="Ej: Av. Principal #123"
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '2px solid #333', 
                  borderRadius: '8px',
                  backgroundColor: '#2a2a2a',
                  color: '#e0e0e0'
                }}
              />
            </div>
          </div>

          {/* Datos del Administrador */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#ff6b35', marginBottom: '15px', borderBottom: '2px solid #ff6b35', paddingBottom: '5px' }}>
              Datos del Administrador
            </h3>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#e0e0e0' }}>
                Nombre Completo *
              </label>
              <input
                type="text"
                value={datos.nombreAdmin}
                onChange={(e) => cambiarDato('nombreAdmin', e.target.value)}
                placeholder="Juan Pérez"
                required
                style={{ 
                  width: '100%', 
                  padding: '10px', 
                  border: '2px solid #333', 
                  borderRadius: '8px', 
                  marginBottom: '15px',
                  backgroundColor: '#2a2a2a',
                  color: '#e0e0e0'
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#e0e0e0' }}>
                  Contraseña *
                </label>
                <input
                  type="password"
                  value={datos.password}
                  onChange={(e) => cambiarDato('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength="6"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '2px solid #333', 
                    borderRadius: '8px',
                    backgroundColor: '#2a2a2a',
                    color: '#e0e0e0'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#e0e0e0' }}>
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  value={datos.password2}
                  onChange={(e) => cambiarDato('password2', e.target.value)}
                  placeholder="Repetir contraseña"
                  required
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: '2px solid #333', 
                    borderRadius: '8px',
                    backgroundColor: '#2a2a2a',
                    color: '#e0e0e0'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Plan de Suscripción */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#ff6b35', marginBottom: '15px', borderBottom: '2px solid #ff6b35', paddingBottom: '5px' }}>
              Selecciona tu Plan
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {/* Plan Básico */}
              <div
                onClick={() => cambiarDato('plan', 'basico')}
                style={{
                  border: datos.plan === 'basico' ? '3px solid #ff6b35' : '2px solid #333',
                  padding: '15px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: datos.plan === 'basico' ? '#2a1f1a' : '#1e1e1e',
                  boxShadow: datos.plan === 'basico' ? '0 4px 15px rgba(255, 107, 53, 0.3)' : 'none'
                }}
              >
                <h4 style={{ margin: '0 0 10px 0', color: '#ff6b35' }}>Plan Básico</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#888' }}>
                  Perfecto para comenzar
                </p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff6b35', margin: 0 }}>
                  GRATIS
                </p>
              </div>

              {/* Plan Premium */}
              <div
                onClick={() => cambiarDato('plan', 'premium')}
                style={{
                  border: datos.plan === 'premium' ? '3px solid #ffd700' : '2px solid #333',
                  padding: '15px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: datos.plan === 'premium' ? '#2a2416' : '#1e1e1e',
                  boxShadow: datos.plan === 'premium' ? '0 4px 15px rgba(255, 215, 0, 0.3)' : 'none'
                }}
              >
                <h4 style={{ margin: '0 0 10px 0', color: '#ffd700' }}>Plan Premium</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#888' }}>
                  Todas las funciones
                </p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffd700', margin: 0 }}>
                  $29/mes
                </p>
              </div>
            </div>
          </div>

          {/* Términos y condiciones */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#aaa' }}>
              <input type="checkbox" required style={{ marginRight: '8px' }} />
              Acepto los términos y condiciones del servicio
            </label>
          </div>

          {/* Botones */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => cambiarVista('login')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#333',
                color: '#e0e0e0',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#ff6b35',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(255, 107, 53, 0.3)'
              }}
            >
              Registrar Empresa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;