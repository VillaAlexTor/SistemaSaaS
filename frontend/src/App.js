import React, { useState } from 'react';
import HomePage from './components/home/HomePage';
import LoginUnificado from './components/auth/LoginUnificado';
import RegisterForm from './components/auth/RegisterForm';
import RegisterUsuarioForm from './components/auth/RegisterUsuarioForm';
import RecoverPasswordForm from './components/auth/RecoverPasswordForm';
import Dashboard from './components/dashboard/Dashboard';
import DashboardMicroempresa from './components/dashboard/DashboardMicroempresa';
import DashboardUsuario from './components/dashboard/DashboardUsuario';
import CatalogoPublico from './components/catalogo/CatalogoPublico';

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

  if (vista === 'registerUsuario') {
    return <RegisterUsuarioForm cambiarVista={setVista} />;
  }

  if (vista === 'recover') {
    return <RecoverPasswordForm cambiarVista={setVista} />;
  }

  // Catálogo público (sin login)
  if (vista === 'catalogoPublico') {
    return <CatalogoPublico cambiarVista={setVista} />;
  }

  // Dashboards según rol
  if (vista === 'dashboardAdmin') {
    return <Dashboard usuario={usuarioActual} cerrarSesion={cerrarSesion} />;
  }

  if (vista === 'dashboardMicroempresa') {
    return <DashboardMicroempresa usuario={usuarioActual} cerrarSesion={cerrarSesion} />;
  }

  if (vista === 'dashboardUsuario') {
    return <DashboardUsuario usuario={usuarioActual} cerrarSesion={cerrarSesion} />;
  }

  // Vista por defecto
  return <HomePage cambiarVista={setVista} />;
}

export default App;