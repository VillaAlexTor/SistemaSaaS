import React, { useState } from 'react';
import HomePage from './components/home/HomePage';
import LoginUnificado from './components/auth/LoginUnificado';
import RegisterForm from './components/auth/RegisterForm';
import RecoverPasswordForm from './components/auth/RecoverPasswordForm';
import Dashboard from './components/dashboard/Dashboard';

// Componente principal de la aplicación
function App() {
  // Estados para controlar qué vista mostrar
  const [vista, setVista] = useState('home');
  const [usuarioActual, setUsuarioActual] = useState(null);

  // Función para hacer login
  const hacerLogin = (datosUsuario) => {
    setUsuarioActual(datosUsuario);
    
    // Redirigir según el rol del usuario
    if (datosUsuario.rol === 'superadmin') {
      setVista('dashboardAdmin');
    } else if (datosUsuario.rol === 'microempresa') {
      setVista('dashboardMicroempresa');
    } else if (datosUsuario.rol === 'usuario') {
      setVista('dashboardUsuario');
    }
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    setUsuarioActual(null);
    setVista('home');
  };

  // Mostrar la vista correspondiente
  if (vista === 'home') {
    return <HomePage cambiarVista={setVista} />;
  }

  if (vista === 'login') {
    return <LoginUnificado cambiarVista={setVista} onLogin={hacerLogin} />;
  }

  if (vista === 'register') {
    return <RegisterForm cambiarVista={setVista} />;
  }

  if (vista === 'recover') {
    return <RecoverPasswordForm cambiarVista={setVista} />;
  }

  // Dashboards según rol
  if (vista === 'dashboardAdmin') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#9c27b0' }}>👑 Dashboard Administrador</h1>
        <p>Bienvenido {usuarioActual?.nombre}</p>
        <p>Email: {usuarioActual?.email}</p>
        <button
          onClick={cerrarSesion}
          style={{
            marginTop: '20px',
            padding: '10px 30px',
            backgroundColor: '#ff9800',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  if (vista === 'dashboardMicroempresa') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#2196f3' }}>🏪 Dashboard Microempresa</h1>
        <p>Bienvenido {usuarioActual?.nombre}</p>
        <p>Email: {usuarioActual?.email}</p>
        <p>Plan: {usuarioActual?.plan}</p>
        <p>Rubro: {usuarioActual?.rubro}</p>
        <button
          onClick={cerrarSesion}
          style={{
            marginTop: '20px',
            padding: '10px 30px',
            backgroundColor: '#ff9800',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  if (vista === 'dashboardUsuario') {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '40px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#ff9800' }}>🛒 Dashboard Usuario</h1>
        <p>Bienvenido {usuarioActual?.nombre}</p>
        <p>Email: {usuarioActual?.email}</p>
        <button
          onClick={cerrarSesion}
          style={{
            marginTop: '20px',
            padding: '10px 30px',
            backgroundColor: '#ff9800',
            color: '#000',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    );
  }

  // Por defecto, antiguo dashboard (temporal)
  return <Dashboard usuario={usuarioActual?.rol} cerrarSesion={cerrarSesion} />;
}

export default App;