import React, { useState } from 'react';
import HomePage from './components/home/HomePage';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import RecoverPasswordForm from './components/auth/RecoverPasswordForm';
import Dashboard from './components/dashboard/Dashboard';

// Componente principal de la aplicación
function App() {
  // Estados para controlar qué vista mostrar
  const [vista, setVista] = useState('home'); // home, login, register, recover, dashboard
  const [usuario, setUsuario] = useState(null);

  // Función para hacer login
  const hacerLogin = (rol) => {
    setUsuario(rol);
    setVista('dashboard');
  };

  // Función para cerrar sesión
  const cerrarSesion = () => {
    setUsuario(null);
    setVista('home'); // Volver al inicio
  };

  // Mostrar la vista correspondiente
  if (vista === 'home') {
    return <HomePage cambiarVista={setVista} />;
  }

  if (vista === 'dashboard') {
    return <Dashboard usuario={usuario} cerrarSesion={cerrarSesion} />;
  }

  if (vista === 'register') {
    return <RegisterForm cambiarVista={setVista} />;
  }

  if (vista === 'recover') {
    return <RecoverPasswordForm cambiarVista={setVista} />;
  }

  // Por defecto mostrar login
  return <LoginForm cambiarVista={setVista} hacerLogin={hacerLogin} />;
}

export default App;