// UTILIDADES DE AUTENTICACIÓN
// Funciones para login, hash de contraseñas y verificación

import { 
  ADMINISTRADORES, 
  MICROEMPRESAS, 
  USUARIOS 
} from '../data/datosSimulados';

// ============================================
// FUNCIÓN PARA HASHEAR CONTRASEÑAS
// ============================================
// En producción usarías bcrypt en el backend
// Aquí usamos base64 como simulación simple
export const hashPassword = (password) => {
  // Convertir a base64 (simulando hash)
  return btoa(password);
};

// ============================================
// FUNCIÓN PARA VERIFICAR CONTRASEÑA
// ============================================
export const verificarPassword = (password, passwordHash) => {
  return hashPassword(password) === passwordHash;
};

// ============================================
// AUTENTICAR ADMINISTRADOR
// ============================================
export const autenticarAdmin = (email, password) => {
  // Buscar admin por email
  const admin = ADMINISTRADORES.find(a => a.email === email);
  
  if (!admin) {
    return { 
      success: false, 
      mensaje: 'Email no encontrado' 
    };
  }

  // Verificar contraseña
  if (!verificarPassword(password, admin.password)) {
    return { 
      success: false, 
      mensaje: 'Contraseña incorrecta' 
    };
  }

  // Verificar si está activo
  if (!admin.activo) {
    return { 
      success: false, 
      mensaje: 'Usuario desactivado' 
    };
  }

  // Login exitoso
  return {
    success: true,
    usuario: {
      id: admin.id,
      nombre: admin.nombre,
      email: admin.email,
      rol: admin.rol
    }
  };
};

// ============================================
// AUTENTICAR MICROEMPRESA
// ============================================
export const autenticarMicroempresa = (email, password) => {
  // Buscar microempresa por email
  const empresa = MICROEMPRESAS.find(m => m.email === email);
  
  if (!empresa) {
    return { 
      success: false, 
      mensaje: 'Email no encontrado. Verifica tus credenciales.' 
    };
  }

  // Verificar contraseña
  if (!verificarPassword(password, empresa.password)) {
    return { 
      success: false, 
      mensaje: 'Contraseña incorrecta' 
    };
  }

  // Verificar si la empresa está activa
  if (!empresa.activo) {
    return { 
      success: false, 
      mensaje: 'Tu empresa está desactivada. Contacta al administrador.' 
    };
  }

  // Login exitoso
  return {
    success: true,
    usuario: {
      id: empresa.id,
      nombre: empresa.nombre,
      email: empresa.email,
      rol: 'microempresa',
      plan: empresa.plan,
      rubro: empresa.rubro
    }
  };
};

// ============================================
// AUTENTICAR USUARIO FINAL
// ============================================
export const autenticarUsuario = (email, password) => {
  // Buscar usuario por email
  const usuario = USUARIOS.find(u => u.email === email);
  
  if (!usuario) {
    return { 
      success: false, 
      mensaje: 'Email no encontrado. Regístrate primero.' 
    };
  }

  // Verificar contraseña
  if (!verificarPassword(password, usuario.password)) {
    return { 
      success: false, 
      mensaje: 'Contraseña incorrecta' 
    };
  }

  // Login exitoso
  return {
    success: true,
    usuario: {
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: 'usuario'
    }
  };
};

// ============================================
// REGISTRAR NUEVA MICROEMPRESA
// ============================================
export const registrarMicroempresa = (datos) => {
  // Verificar si el email ya existe
  const existe = MICROEMPRESAS.find(m => m.email === datos.email);
  
  if (existe) {
    return { 
      success: false, 
      mensaje: 'El email ya está registrado' 
    };
  }

  // Crear nueva microempresa
  const nuevaEmpresa = {
    id: MICROEMPRESAS.length + 1,
    nombre: datos.nombreEmpresa,
    ruc: datos.ruc,
    direccion: datos.direccion,
    telefono: datos.telefono,
    email: datos.email,
    password: hashPassword(datos.password),
    rubro: datos.rubro || 'General',
    plan: datos.plan || 'basico',
    activo: false, // Inactiva hasta que admin la apruebe
    fechaRegistro: new Date().toISOString().split('T')[0]
  };

  // Agregar a la lista (en producción se guardaría en BD)
  MICROEMPRESAS.push(nuevaEmpresa);

  return {
    success: true,
    mensaje: 'Registro exitoso. Espera la aprobación del administrador.',
    empresa: nuevaEmpresa
  };
};

// ============================================
// REGISTRAR NUEVO USUARIO
// ============================================
export const registrarUsuario = (datos) => {
  // Verificar si el email ya existe
  const existe = USUARIOS.find(u => u.email === datos.email);
  
  if (existe) {
    return { 
      success: false, 
      mensaje: 'El email ya está registrado' 
    };
  }

  // Crear nuevo usuario
  const nuevoUsuario = {
    id: USUARIOS.length + 1,
    nombre: datos.nombre,
    email: datos.email,
    password: hashPassword(datos.password),
    telefono: datos.telefono || '',
    direccion: datos.direccion || '',
    fechaRegistro: new Date().toISOString().split('T')[0]
  };

  // Agregar a la lista
  USUARIOS.push(nuevoUsuario);

  return {
    success: true,
    mensaje: 'Registro exitoso. Ya puedes iniciar sesión.',
    usuario: nuevoUsuario
  };
};

// ============================================
// RECUPERAR CONTRASEÑA
// ============================================
export const recuperarPassword = (email, tipoUsuario) => {
  let usuario = null;

  // Buscar según el tipo de usuario
  if (tipoUsuario === 'admin') {
    usuario = ADMINISTRADORES.find(a => a.email === email);
  } else if (tipoUsuario === 'microempresa') {
    usuario = MICROEMPRESAS.find(m => m.email === email);
  } else if (tipoUsuario === 'usuario') {
    usuario = USUARIOS.find(u => u.email === email);
  }

  if (!usuario) {
    return { 
      success: false, 
      mensaje: 'Email no encontrado en el sistema' 
    };
  }

  // Simular envío de email
  // En producción, aquí enviarías un email real con un token
  console.log('📧 Email de recuperación enviado a:', email);
  
  return {
    success: true,
    mensaje: 'Se ha enviado un correo con instrucciones para recuperar tu contraseña'
  };
};

// ============================================
// CAMBIAR CONTRASEÑA
// ============================================
export const cambiarPassword = (email, passwordActual, passwordNueva, tipoUsuario) => {
  let usuario = null;
  let lista = null;

  // Buscar usuario según tipo
  if (tipoUsuario === 'admin') {
    usuario = ADMINISTRADORES.find(a => a.email === email);
    lista = ADMINISTRADORES;
  } else if (tipoUsuario === 'microempresa') {
    usuario = MICROEMPRESAS.find(m => m.email === email);
    lista = MICROEMPRESAS;
  } else if (tipoUsuario === 'usuario') {
    usuario = USUARIOS.find(u => u.email === email);
    lista = USUARIOS;
  }

  if (!usuario) {
    return { 
      success: false, 
      mensaje: 'Usuario no encontrado' 
    };
  }

  // Verificar contraseña actual
  if (!verificarPassword(passwordActual, usuario.password)) {
    return { 
      success: false, 
      mensaje: 'La contraseña actual es incorrecta' 
    };
  }

  // Actualizar contraseña
  usuario.password = hashPassword(passwordNueva);

  return {
    success: true,
    mensaje: 'Contraseña actualizada correctamente'
  };
};

// ============================================
// OBTENER DATOS DE USUARIO POR EMAIL
// ============================================
export const obtenerUsuarioPorEmail = (email, tipoUsuario) => {
  if (tipoUsuario === 'admin') {
    return ADMINISTRADORES.find(a => a.email === email);
  } else if (tipoUsuario === 'microempresa') {
    return MICROEMPRESAS.find(m => m.email === email);
  } else if (tipoUsuario === 'usuario') {
    return USUARIOS.find(u => u.email === email);
  }
  return null;
};

// ============================================
// VALIDAR EMAIL
// ============================================
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// ============================================
// VALIDAR CONTRASEÑA
// ============================================
export const validarPassword = (password) => {
  // Mínimo 6 caracteres
  if (password.length < 6) {
    return {
      valida: false,
      mensaje: 'La contraseña debe tener al menos 6 caracteres'
    };
  }

  return {
    valida: true,
    mensaje: 'Contraseña válida'
  };
};