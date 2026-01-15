import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { api } from '../../services/api';
import ModalPago from '../common/ModalPago';

function RegisterForm({ cambiarVista }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [captchaToken, setCaptchaToken] = useState(null);
  const [mostrarModalPago, setMostrarModalPago] = useState(false);
  const [pagoCompletado, setPagoCompletado] = useState(false);
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

  const manejarSeleccionPlan = (plan) => {
    cambiarDato('plan', plan);
    
    // Si selecciona premium, mostrar modal de pago
    if (plan === 'premium') {
      setMostrarModalPago(true);
    } else {
      setPagoCompletado(false);
    }
  };

  const handlePagoExitoso = (infoPago) => {
    console.log('✅ Pago exitoso:', infoPago);
    setPagoCompletado(true);
    setMostrarModalPago(false);
  };

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validar captcha
    if (!captchaToken) {
      setError('Por favor completa el CAPTCHA');
      return;
    }

    // Validar contraseñas
    if (datos.password !== datos.password2) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar pago si es premium
    if (datos.plan === 'premium' && !pagoCompletado) {
      setError('Debes completar el pago para el Plan Premium');
      setMostrarModalPago(true);
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
      recaptcha_token: captchaToken
    };

    const resultado = await api.registerMicroempresa(datosEnviar);

    if (resultado.success) {
      alert('¡Empresa registrada exitosamente!');
      cambiarVista('login');
    } else {
      setError(resultado.message || 'Error al registrar la empresa');
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
          {/* Datos de la Empresa */}
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
          </div>

          {/* Datos del Administrador */}
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

          {/* Selección de Plan */}
          <div style={{ marginBottom: '25px' }}>
            <h3 style={{ color: '#ff9800', marginBottom: '15px', borderBottom: '2px solid #ff9800', paddingBottom: '5px' }}>
              Selecciona tu Plan
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              {/* Plan Básico */}
              <div
                onClick={() => manejarSeleccionPlan('basico')}
                style={{
                  border: datos.plan === 'basico' ? '3px solid #2196f3' : '2px solid #444',
                  padding: '20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: datos.plan === 'basico' ? '#1a2d3d' : '#1a1a1a',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                {datos.plan === 'basico' && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: '#2196f3',
                    color: '#fff',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    ✓ Seleccionado
                  </div>
                )}
                <h4 style={{ margin: '0 0 10px 0', color: '#2196f3', fontSize: '18px' }}>📦 Plan Básico</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#aaa' }}>
                  Perfecto para comenzar
                </p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#2196f3', margin: '10px 0' }}>
                  GRATIS
                </p>
                <ul style={{ margin: '15px 0 0 0', padding: '0 0 0 20px', color: '#aaa', fontSize: '13px', lineHeight: '1.8' }}>
                  <li>Gestión de productos</li>
                  <li>Registro de ventas</li>
                  <li>Gestión de clientes</li>
                  <li style={{ color: '#666' }}>❌ Reportes avanzados</li>
                  <li style={{ color: '#666' }}>❌ Múltiples usuarios</li>
                </ul>
              </div>

              {/* Plan Premium */}
              <div
                onClick={() => manejarSeleccionPlan('premium')}
                style={{
                  border: datos.plan === 'premium' ? '3px solid #ff9800' : '2px solid #444',
                  padding: '20px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  backgroundColor: datos.plan === 'premium' ? '#2d2410' : '#1a1a1a',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                {datos.plan === 'premium' && (
                  <div style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    backgroundColor: pagoCompletado ? '#4caf50' : '#ff9800',
                    color: pagoCompletado ? '#fff' : '#000',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                    fontWeight: 'bold'
                  }}>
                    {pagoCompletado ? '✓ Pago Completado' : '⚠️ Requiere Pago'}
                  </div>
                )}
                <div style={{
                  position: 'absolute',
                  top: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#ff9800',
                  color: '#000',
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 10px rgba(255,152,0,0.5)'
                }}>
                  ⭐ RECOMENDADO
                </div>
                <h4 style={{ margin: '10px 0 10px 0', color: '#ff9800', fontSize: '18px' }}>⭐ Plan Premium</h4>
                <p style={{ margin: '0 0 10px 0', fontSize: '13px', color: '#aaa' }}>
                  Todas las funciones
                </p>
                <p style={{ fontSize: '32px', fontWeight: 'bold', color: '#ff9800', margin: '10px 0' }}>
                  $ 29/mes
                </p>
                <ul style={{ margin: '15px 0 0 0', padding: '0 0 0 20px', color: '#aaa', fontSize: '13px', lineHeight: '1.8' }}>
                  <li style={{ color: '#fff' }}>✓ Gestión de productos</li>
                  <li style={{ color: '#fff' }}>✓ Registro de ventas</li>
                  <li style={{ color: '#fff' }}>✓ Gestión de clientes</li>
                  <li style={{ color: '#ff9800', fontWeight: 'bold' }}>✓ Reportes avanzados</li>
                  <li style={{ color: '#ff9800', fontWeight: 'bold' }}>✓ Múltiples usuarios</li>
                  <li style={{ color: '#ff9800', fontWeight: 'bold' }}>✓ Soporte prioritario</li>
                </ul>
                {datos.plan === 'premium' && !pagoCompletado && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setMostrarModalPago(true);
                    }}
                    style={{
                      marginTop: '15px',
                      width: '100%',
                      padding: '10px',
                      background: 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)',
                      color: '#000',
                      border: 'none',
                      borderRadius: '5px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      fontSize: '14px'
                    }}
                  >
                    💳 Completar Pago
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Términos */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', fontSize: '13px', color: '#aaa' }}>
              <input type="checkbox" required style={{ marginRight: '8px' }} />
              Acepto los términos y condiciones del servicio
            </label>
          </div>

          {/* CAPTCHA */}
          <div style={{ marginBottom: '25px', display: 'flex', justifyContent: 'center' }}>
            <ReCAPTCHA
              sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
              onChange={onCaptchaChange}
              theme="dark"
            />
          </div>       

          {/* Botones */}
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
              disabled={cargando || !captchaToken || (datos.plan === 'premium' && !pagoCompletado)}
              style={{
                flex: 1,
                padding: '12px',
                backgroundColor: (cargando || !captchaToken || (datos.plan === 'premium' && !pagoCompletado)) ? '#666' : '#ff9800',
                color: (cargando || !captchaToken || (datos.plan === 'premium' && !pagoCompletado)) ? '#aaa' : '#000',
                border: 'none',
                borderRadius: '5px',
                cursor: (cargando || !captchaToken || (datos.plan === 'premium' && !pagoCompletado)) ? 'not-allowed' : 'pointer',
                fontWeight: 'bold',
                boxShadow: (cargando || !captchaToken || (datos.plan === 'premium' && !pagoCompletado)) ? 'none' : '0 4px 15px rgba(255,152,0,0.4)'
              }}
            >
              {cargando ? '⏳ Registrando...' : 'Registrar Empresa'}
            </button>
          </div>
        </form>
      </div>

      {/* Modal de Pago */}
      {mostrarModalPago && (
        <ModalPago 
          cerrar={() => setMostrarModalPago(false)}
          onPagoExitoso={handlePagoExitoso}
          monto={29}
        />
      )}
    </div>
  );
}

export default RegisterForm;