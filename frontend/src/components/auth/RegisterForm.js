import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { api } from '../../services/api';

// Formulario de Registro de Microempresa
function RegisterForm({ cambiarVista }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [datos, setDatos] = useState({
    nombreEmpresa: '',
    nit: '',
    direccion: '',
    telefono: '',
    email: '',
    rubro: '',
    nombreAdmin: '',
    password: '',
    password2: '',
    plan: 'basico'
  });

  const cambiarDato = (campo, valor) => {
    setDatos({ ...datos, [campo]: valor });
  };

  const onCaptchaChange = (token) => {
    console.log('✅ Captcha completado:', token);
    setCaptchaToken(token);
    setError('');
  };
  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    
    // ✅ Validar captcha
    if (!captchaToken) {
      setError('Por favor completa el CAPTCHA');
      return;
    }
    
    if (datos.password !== datos.password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setCargando(true);

    const datosEnviar = {
      nombre: datos.nombreEmpresa,
      nit: datos.nit,
      email: datos.email,
      password: datos.password,
      telefono: datos.telefono,
      direccion: datos.direccion,
      rubro: datos.rubro,
      plan: datos.plan,
      recaptcha_token: captchaToken  // ✅ Agregar el token
    };

    const resultado = await api.registerMicroempresa(datosEnviar);

    if (resultado.success) {
      alert('¡Empresa registrada exitosamente!');
      cambiarVista('login');
    } else {
      setError(resultado.message || 'Error al registrar la empresa');
      // ✅ Resetear captcha si hay error
      setCaptchaToken(null);
      window.grecaptcha.reset();
    }

    setCargando(false);
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#1a1a1a',
      padding: '20px'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto',
        backgroundColor: '#2d2d2d',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(255,152,0,0.3)',
        border: '1px solid #3d3d3d'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#ff9800', marginBottom: '10px' }}>
            📝 Registro de Microempresa
          </h1>
          <p style={{ color: '#aaa' }}>Completa todos los datos para registrarte</p>
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
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#ff9800', marginBottom: '15px', borderBottom: '2px solid #ff9800', paddingBottom: '5px' }}>
              Datos de la Empresa
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                  Nombre de la Empresa *
                </label>
                <input
                  type="text"
                  value={datos.nombreEmpresa}
                  onChange={(e) => cambiarDato('nombreEmpresa', e.target.value)}
                  placeholder="Ej: Tienda Don Juan"
                  required
                  style={{ width: '100%', padding: '8px', border: '2px solid #444', borderRadius: '5px', backgroundColor: '#1a1a1a', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                  NIT/RUC *
                </label>
                <input
                  type="text"
                  value={datos.nit}
                  onChange={(e) => cambiarDato('nit', e.target.value)}
                  placeholder="1234567890"
                  required
                  style={{ width: '100%', padding: '8px', border: '2px solid #444', borderRadius: '5px', backgroundColor: '#1a1a1a', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                  Teléfono *
                </label>
                <input
                  type="tel"
                  value={datos.telefono}
                  onChange={(e) => cambiarDato('telefono', e.target.value)}
                  placeholder="+591 12345678"
                  required
                  style={{ width: '100%', padding: '8px', border: '2px solid #444', borderRadius: '5px', backgroundColor: '#1a1a1a', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                  Email *
                </label>
                <input
                  type="email"
                  value={datos.email}
                  onChange={(e) => cambiarDato('email', e.target.value)}
                  placeholder="correo@empresa.com"
                  required
                  style={{ width: '100%', padding: '8px', border: '2px solid #444', borderRadius: '5px', backgroundColor: '#1a1a1a', color: '#fff' }}
                />
              </div>
            </div>

            <div style={{ marginTop: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                Dirección *
              </label>
              <input
                type="text"
                value={datos.direccion}
                onChange={(e) => cambiarDato('direccion', e.target.value)}
                placeholder="Ej: Av. Principal #123"
                required
                style={{ width: '100%', padding: '8px', border: '2px solid #444', borderRadius: '5px', backgroundColor: '#1a1a1a', color: '#fff' }}
              />
            </div>
          </div>
          <div style={{ marginTop: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
              Rubro / Giro del Negocio
            </label>
            <select
              value={datos.rubro}
              onChange={(e) => cambiarDato('rubro', e.target.value)}
              required
              style={{ width: '100%', padding: '8px', border: '2px solid #444', borderRadius: '5px', backgroundColor: '#1a1a1a', color: '#fff' }}
            >
              <option value="">Selecciona un rubro</option>
              <option value="Abarrotes">🛒 Abarrotes</option>
              <option value="Restaurante">🍽️ Restaurante</option>
              <option value="Farmacia">💊 Farmacia</option>
              <option value="Ferretería">🔨 Ferretería</option>
              <option value="Ropa">👔 Ropa y Accesorios</option>
              <option value="Tecnología">💻 Tecnología</option>
              <option value="Servicios">🔧 Servicios</option>
              <option value="Otro">📦 Otro</option>
            </select>
          </div>
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#ff9800', marginBottom: '15px', borderBottom: '2px solid #ff9800', paddingBottom: '5px' }}>
              Datos del Administrador
            </h3>
            
            <div>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                Nombre Completo *
              </label>
              <input
                type="text"
                value={datos.nombreAdmin}
                onChange={(e) => cambiarDato('nombreAdmin', e.target.value)}
                placeholder="Juan Pérez"
                required
                style={{ width: '100%', padding: '8px', border: '2px solid #444', borderRadius: '5px', marginBottom: '15px', backgroundColor: '#1a1a1a', color: '#fff' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                  Contraseña *
                </label>
                <input
                  type="password"
                  value={datos.password}
                  onChange={(e) => cambiarDato('password', e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength="6"
                  style={{ width: '100%', padding: '8px', border: '2px solid #444', borderRadius: '5px', backgroundColor: '#1a1a1a', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#fff' }}>
                  Confirmar Contraseña *
                </label>
                <input
                  type="password"
                  value={datos.password2}
                  onChange={(e) => cambiarDato('password2', e.target.value)}
                  placeholder="Repetir contraseña"
                  required
                  style={{ width: '100%', padding: '8px', border: '2px solid #444', borderRadius: '5px', backgroundColor: '#1a1a1a', color: '#fff' }}
                />
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#ff9800', marginBottom: '15px', borderBottom: '2px solid #ff9800', paddingBottom: '5px' }}>
              Selecciona tu Plan
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div
                onClick={() => cambiarDato('plan', 'basico')}
                style={{
                  border: datos.plan === 'basico' ? '3px solid #ff9800' : '2px solid #444',
                  padding: '15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: datos.plan === 'basico' ? '#2d2410' : '#1a1a1a'
                }}
              >
                <h4 style={{ margin: '0 0 10px 0', color: '#ff9800' }}>Plan Básico</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#aaa' }}>
                  Perfecto para comenzar
                </p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff9800', margin: 0 }}>
                  GRATIS
                </p>
              </div>

              <div
                onClick={() => cambiarDato('plan', 'premium')}
                style={{
                  border: datos.plan === 'premium' ? '3px solid #ffb74d' : '2px solid #444',
                  padding: '15px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  backgroundColor: datos.plan === 'premium' ? '#2d2410' : '#1a1a1a'
                }}
              >
                <h4 style={{ margin: '0 0 10px 0', color: '#ffb74d' }}>Plan Premium</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#aaa' }}>
                  Todas las funciones
                </p>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffb74d', margin: 0 }}>
                  $29/mes
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#aaa' }}>
              <input type="checkbox" required style={{ marginRight: '8px' }} />
              Acepto los términos y condiciones del servicio
            </label>
          </div>
          {/* ✅ CAPTCHA */}
            <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
              <ReCAPTCHA
                sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                onChange={onCaptchaChange}
                theme="dark"
              />
            </div>       
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={() => cambiarVista('login')}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: '#444',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={cargando || !captchaToken}  // ✅ Agregar || !captchaToken
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: (cargando || !captchaToken) ? '#666' : '#ff9800',  // ✅ Actualizar
                color: (cargando || !captchaToken) ? '#aaa' : '#000',  // ✅ Actualizar
                border: 'none',
                borderRadius: '5px',
                cursor: (cargando || !captchaToken) ? 'not-allowed' : 'pointer',  // ✅ Actualizar
                fontWeight: 'bold',
                boxShadow: (cargando || !captchaToken) ? 'none' : '0 4px 15px rgba(255,152,0,0.4)'  // ✅ Actualizar
              }}
            >
              {cargando ? '⏳ Registrando...' : 'Registrar Empresa'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;