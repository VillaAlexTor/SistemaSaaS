import React, { useState } from 'react';
import { api } from '../../services/api';

function RegisterUsuarioForm({ cambiarVista }) {
  const [verPassword, setVerPassword] = useState(false);
  const [verPassword2, setVerPassword2] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const [datos, setDatos] = useState({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    password: '',
    password2: '',
    aceptaTerminos: false
  });

  const cambiarDato = (campo, valor) => {
    setDatos({ ...datos, [campo]: valor });
  };
  
  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    
    if (datos.password !== datos.password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (!datos.aceptaTerminos) {
      setError('Debes aceptar los términos y condiciones');
      return;
    }

    setCargando(true);

    const datosEnviar = {
      nombre: datos.nombre,
      apellido: datos.apellido,
      email: datos.email,
      telefono: datos.telefono,
      password: datos.password
    };

    const resultado = await api.registerUsuario(datosEnviar);

    if (resultado.success) {
      alert(`¡Registro exitoso! Bienvenido ${datos.nombre} ${datos.apellido}`);
      cambiarVista('login');
    } else {
      setError(resultado.message || 'Error al registrar usuario');
    }

    setCargando(false);
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
        maxWidth: '550px',
        width: '100%',
        backgroundColor: '#2d2d2d',
        padding: '40px',
        borderRadius: '15px',
        boxShadow: '0 8px 30px rgba(255,152,0,0.4)',
        border: '2px solid #ff9800'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '35px' }}>
          <div style={{
            width: '90px',
            height: '90px',
            backgroundColor: '#ff9800',
            borderRadius: '50%',
            margin: '0 auto 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            boxShadow: '0 0 25px rgba(255,152,0,0.6)'
          }}>
            🛒
          </div>
          <h1 style={{ color: '#ff9800', marginBottom: '8px', fontSize: '28px' }}>
            Crear Cuenta de Usuario
          </h1>
          <p style={{ color: '#aaa', fontSize: '15px', margin: 0 }}>
            Únete para comprar en microempresas locales
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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>
                Nombre *
              </label>
              <input
                type="text"
                value={datos.nombre}
                onChange={(e) => cambiarDato('nombre', e.target.value)}
                placeholder="Juan"
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #444', borderRadius: '8px', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px', transition: 'border-color 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = '#ff9800'}
                onBlur={(e) => e.target.style.borderColor = '#444'}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>
                Apellido *
              </label>
              <input
                type="text"
                value={datos.apellido}
                onChange={(e) => cambiarDato('apellido', e.target.value)}
                placeholder="Pérez"
                required
                style={{ width: '100%', padding: '12px', border: '2px solid #444', borderRadius: '8px', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px', transition: 'border-color 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = '#ff9800'}
                onBlur={(e) => e.target.style.borderColor = '#444'}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>
              Correo Electrónico *
            </label>
            <input
              type="email"
              value={datos.email}
              onChange={(e) => cambiarDato('email', e.target.value)}
              placeholder="tu@email.com"
              required
              style={{ width: '100%', padding: '12px', border: '2px solid #444', borderRadius: '8px', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px', transition: 'border-color 0.3s' }}
              onFocus={(e) => e.target.style.borderColor = '#ff9800'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>
              Teléfono *
            </label>
            <input
              type="tel"
              value={datos.telefono}
              onChange={(e) => cambiarDato('telefono', e.target.value)}
              placeholder="+591 12345678"
              required
              style={{ width: '100%', padding: '12px', border: '2px solid #444', borderRadius: '8px', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px', transition: 'border-color 0.3s' }}
              onFocus={(e) => e.target.style.borderColor = '#ff9800'}
              onBlur={(e) => e.target.style.borderColor = '#444'}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>
              Contraseña *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={verPassword ? "text" : "password"}
                value={datos.password}
                onChange={(e) => cambiarDato('password', e.target.value)}
                placeholder="Mínimo 6 caracteres"
                required
                minLength="6"
                style={{ width: '100%', padding: '12px', paddingRight: '45px', border: '2px solid #444', borderRadius: '8px', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px', transition: 'border-color 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = '#ff9800'}
                onBlur={(e) => e.target.style.borderColor = '#444'}
              />
              <button
                type="button"
                onClick={() => setVerPassword(!verPassword)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}
              >
                {verPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold', color: '#fff', fontSize: '14px' }}>
              Confirmar Contraseña *
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={verPassword2 ? "text" : "password"}
                value={datos.password2}
                onChange={(e) => cambiarDato('password2', e.target.value)}
                placeholder="Repetir contraseña"
                required
                style={{ width: '100%', padding: '12px', paddingRight: '45px', border: '2px solid #444', borderRadius: '8px', backgroundColor: '#1a1a1a', color: '#fff', fontSize: '14px', transition: 'border-color 0.3s' }}
                onFocus={(e) => e.target.style.borderColor = '#ff9800'}
                onBlur={(e) => e.target.style.borderColor = '#444'}
              />
              <button
                type="button"
                onClick={() => setVerPassword2(!verPassword2)}
                style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '20px' }}
              >
                {verPassword2 ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div style={{ marginBottom: '25px', padding: '15px', backgroundColor: '#1a1a1a', borderRadius: '8px', border: '1px solid #444' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', fontSize: '13px', color: '#aaa', cursor: 'pointer' }}>
              <input 
                type="checkbox"
                checked={datos.aceptaTerminos}
                onChange={(e) => cambiarDato('aceptaTerminos', e.target.checked)}
                required
                style={{ marginRight: '10px', marginTop: '2px', cursor: 'pointer' }}
              />
              <span>
                Acepto los <span style={{ color: '#ff9800', fontWeight: 'bold' }}>términos y condiciones</span> del servicio y la <span style={{ color: '#ff9800', fontWeight: 'bold' }}>política de privacidad</span>
              </span>
            </label>
          </div>

          <div style={{ backgroundColor: 'rgba(255,152,0,0.1)', border: '1px solid rgba(255,152,0,0.3)', borderRadius: '8px', padding: '15px', marginBottom: '25px' }}>
            <p style={{ margin: '0 0 10px 0', color: '#ff9800', fontWeight: 'bold', fontSize: '14px' }}>
              ✨ Beneficios de crear tu cuenta:
            </p>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#aaa', fontSize: '13px', lineHeight: '1.8' }}>
              <li>Acceso a productos de microempresas locales</li>
              <li>Historial de compras y pedidos</li>
              <li>Ofertas y promociones exclusivas</li>
              <li>Soporte personalizado</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={cargando}
            style={{ width: '100%', padding: '14px', background: cargando ? '#666' : 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)', color: cargando ? '#aaa' : '#000', border: 'none', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: cargando ? 'not-allowed' : 'pointer', boxShadow: cargando ? 'none' : '0 6px 20px rgba(255,152,0,0.4)', marginBottom: '15px', transition: 'all 0.3s ease' }}
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
            {cargando ? '⏳ Registrando...' : '🚀 Crear mi Cuenta'}
          </button>

          <button
            type="button"
            onClick={() => cambiarVista('login')}
            disabled={cargando}
            style={{ width: '100%', padding: '14px', backgroundColor: 'transparent', color: '#ff9800', border: '2px solid #ff9800', borderRadius: '10px', fontSize: '16px', fontWeight: 'bold', cursor: cargando ? 'not-allowed' : 'pointer', transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => {
              if (!cargando) e.target.style.backgroundColor = 'rgba(255,152,0,0.1)';
            }}
            onMouseLeave={(e) => {
              if (!cargando) e.target.style.backgroundColor = 'transparent';
            }}
          >
            Cancelar
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '25px', paddingTop: '20px', borderTop: '1px solid #3d3d3d' }}>
          <p style={{ margin: '0 0 10px 0', color: '#aaa', fontSize: '14px' }}>
            ¿Tienes una microempresa?
          </p>
          <button
            onClick={() => cambiarVista('register')}
            disabled={cargando}
            style={{ background: 'none', border: 'none', color: '#2196f3', cursor: cargando ? 'not-allowed' : 'pointer', fontWeight: 'bold', textDecoration: 'underline', fontSize: '14px' }}
          >
            Registra tu Empresa aquí
          </button>
        </div>

        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          <button
            onClick={() => cambiarVista('home')}
            disabled={cargando}
            style={{ background: 'none', border: 'none', color: '#888', cursor: cargando ? 'not-allowed' : 'pointer', fontSize: '13px' }}
          >
            ← Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default RegisterUsuarioForm;