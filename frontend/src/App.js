import React, { useState, useEffect } from 'react';
import HomePage from './components/home/HomePage';
import LoginUnificado from './components/auth/LoginUnificado';
import RegisterForm from './components/auth/RegisterForm';
import RegisterUsuarioForm from './components/auth/RegisterUsuarioForm';
import RecoverPasswordForm from './components/auth/RecoverPasswordForm';
import ResetPasswordForm from './components/auth/ResetPasswordForm'; 
import Dashboard from './components/dashboard/Dashboard';
import DashboardMicroempresa from './components/dashboard/DashboardMicroempresa';
import DashboardEmpleado from './components/dashboard/DashboardEmpleado'; // ✅ IMPORTAR
import DashboardUsuario from './components/dashboard/DashboardUsuario';
import CatalogoPublico from './components/catalogo/CatalogoPublico';

// Componente principal de la aplicación
function App() {
  const [vista, setVista] = useState('home');
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cargando, setCargando] = useState(true);

  // ✅ RECUPERAR SESIÓN AL CARGAR LA APP
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        setUsuarioActual(usuario);
        
        // Redirigir al dashboard correspondiente
        if (usuario.rol === 'superadmin') {
          setVista('dashboardAdmin');
        } else if (usuario.rol === 'microempresa') {
          setVista('dashboardMicroempresa');
        } else if (usuario.rol === 'empleado') {
          setVista('dashboardEmpleado');
        } else if (usuario.rol === 'usuario') {
          setVista('dashboardUsuario');
        }
      } catch (error) {
        console.error('Error al parsear usuario guardado:', error);
        localStorage.removeItem('usuario');
      }
    }
    
    setCargando(false);
  }, []);

  // ✅ DETECTAR URL DE RESET PASSWORD
  useEffect(() => {
    const path = window.location.pathname;
    const search = window.location.search;

    if (path.includes('reset-password') || search.includes('token=')) {
      setVista('reset-password');
    }
  }, []);

  // ✅ HACER LOGIN Y GUARDAR EN LOCALSTORAGE
  const hacerLogin = (datosUsuario) => {
    setUsuarioActual(datosUsuario);
    localStorage.setItem('usuario', JSON.stringify(datosUsuario));
    
    // Redirigir según el rol del usuario
    if (datosUsuario.rol === 'superadmin') {
      setVista('dashboardAdmin');
    } else if (datosUsuario.rol === 'microempresa') {
      setVista('dashboardMicroempresa');
    } else if (datosUsuario.rol === 'empleado') {
      setVista('dashboardEmpleado');
    } else if (datosUsuario.rol === 'usuario') {
      setVista('dashboardUsuario');
    }
  };

  // ✅ CERRAR SESIÓN Y LIMPIAR LOCALSTORAGE
  const cerrarSesion = () => {
    setUsuarioActual(null);
    localStorage.removeItem('usuario');
    setVista('home');
  };

  // ✅ ACTUALIZAR USUARIO EN ESTADO Y LOCALSTORAGE
  const actualizarUsuario = (nuevosDatos) => {
    const usuarioActualizado = { ...usuarioActual, ...nuevosDatos };
    setUsuarioActual(usuarioActualizado);
    localStorage.setItem('usuario', JSON.stringify(usuarioActualizado));
  };

  // Mostrar pantalla de carga mientras recupera la sesión
  if (cargando) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#1a1a1a'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>⏳</div>
          <p style={{ color: '#ff9800', fontSize: '18px' }}>Cargando...</p>
        </div>
      </div>
    );
  }

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

  if (vista === 'reset-password') {
    return <ResetPasswordForm cambiarVista={setVista} />;
  }

  if (vista === 'catalogoPublico') {
    return <CatalogoPublico cambiarVista={setVista} />;
  }

  // Dashboards según rol
  if (vista === 'dashboardAdmin') {
    return (
      <Dashboard 
        usuario={usuarioActual} 
        cerrarSesion={cerrarSesion}
        actualizarUsuario={actualizarUsuario}
      />
    );
  }

  if (vista === 'dashboardMicroempresa') {
    return (
      <DashboardMicroempresa 
        usuario={usuarioActual} 
        cerrarSesion={cerrarSesion}
        actualizarUsuario={actualizarUsuario}
      />
    );
  }

  // ✅ Dashboard de Empleado
  if (vista === 'dashboardEmpleado') {
    return (
      <DashboardEmpleado 
        usuario={usuarioActual} 
        cerrarSesion={cerrarSesion}
        actualizarUsuario={actualizarUsuario}
      />
    );
  }

  if (vista === 'dashboardUsuario') {
    return (
      <DashboardUsuario 
        usuario={usuarioActual} 
        cerrarSesion={cerrarSesion}
        actualizarUsuario={actualizarUsuario}
      />
    );
  }

  // Vista por defecto
  return <HomePage cambiarVista={setVista} />;
}

export default App;