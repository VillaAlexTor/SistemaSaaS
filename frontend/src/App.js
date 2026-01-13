import React, { useState } from 'react';
import HomePage from './components/home/HomePage';
import LoginUnificado from './components/auth/LoginUnificado';
import RegisterForm from './components/auth/RegisterForm';
import RecoverPasswordForm from './components/auth/RecoverPasswordForm';
// CORREGIR: Todos los dashboards están en la misma carpeta
import Dashboard from './components/dashboard/Dashboard';
import DashboardMicroempresa from './components/dashboard/DashboardMicroempresa';
import DashboardUsuario from './components/dashboard/DashboardUsuario';

function App() {
  const [vista, setVista] = useState('home');
  const [usuarioActual, setUsuarioActual] = useState(null);

  const hacerLogin = (datosUsuario) => {
    setUsuarioActual(datosUsuario);
    
    if (datosUsuario.rol === 'superadmin') {
      setVista('dashboardAdmin');
    } else if (datosUsuario.rol === 'microempresa') {
      setVista('dashboardMicroempresa');
    } else if (datosUsuario.rol === 'usuario') {
      setVista('dashboardUsuario');
    }
  };

  const cerrarSesion = () => {
    setUsuarioActual(null);
    setVista('home');
  };

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

  if (vista === 'dashboardAdmin') {
    return <Dashboard usuario={usuarioActual} cerrarSesion={cerrarSesion} />;
  }

  if (vista === 'dashboardMicroempresa') {
    return <DashboardMicroempresa usuario={usuarioActual} cerrarSesion={cerrarSesion} />;
  }

  if (vista === 'dashboardUsuario') {
    return <DashboardUsuario usuario={usuarioActual} cerrarSesion={cerrarSesion} />;
  }

  return <HomePage cambiarVista={setVista} />;
}

export default App;