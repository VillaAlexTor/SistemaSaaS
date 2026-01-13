// BASE DE DATOS SIMULADA
// Este archivo simula una base de datos mientras no tengamos backend

// Función para simular hash de contraseñas (convertir a base64)
const hashPassword = (password) => {
  return btoa(password); // Convierte a base64
};

// ============================================
// ADMINISTRADORES DEL SISTEMA
// ============================================
export const ADMINISTRADORES = [
  {
    id: 1,
    nombre: 'Super Admin',
    email: 'admin@sistema.com',
    password: ('admin123'),
    rol: 'superadmin',
    activo: true
  }
];

// ============================================
// MICROEMPRESAS REGISTRADAS EN EL SISTEMA
// ============================================
export const MICROEMPRESAS = [
  {
    id: 1,
    nombre: 'Tienda Don Juanito',
    ruc: '1234567890',
    rubro: 'Abarrotes',
    descripcion: 'Tienda de barrio con productos de primera necesidad',
    direccion: 'Av. 6 de Agosto #1234',
    telefono: '+591 12345678',
    email: 'juanito@tienda.com',
    password: ('tienda123'),
    plan: 'premium',
    activo: true,
    fechaRegistro: '2024-01-15',
    logo: '🏪'
  },
  {
    id: 2,
    nombre: 'Ferretería El Martillo',
    ruc: '9876543210',
    rubro: 'Ferretería',
    descripcion: 'Ferretería con todo tipo de herramientas y materiales de construcción',
    direccion: 'Av. Industrial #456',
    telefono: '+591 71234567',
    email: 'ferreteria@gmail.com',
    password: ('ferreteria123'),
    plan: 'basico',
    activo: true,
    fechaRegistro: '2025-11-15',
    logo: '🔨'
  },
  {
    id: 3,
    nombre: 'Farmacia San José',
    ruc: '7890123456',
    rubro: 'Farmacia',
    descripcion: 'Farmacia con medicamentos y productos de salud',
    direccion: 'Calle Comercio #789',
    telefono: '+591 76543210',
    email: 'farmacia@gmail.com',
    password: ('farm123'),
    plan: 'premium',
    activo: true,
    fechaRegistro: '2025-12-01',
    logo: '💊'
  },
  {
    id: 4,
    nombre: 'Librería El Saber',
    ruc: '4561237890',
    rubro: 'Librería',
    descripcion: 'Librería con variedad de textos escolares y universitarios',
    direccion: 'Av. América #345',
    telefono: '+591 77778888',
    email: 'libros@gmail.com',
    password: ('libros123'),
    plan: 'basico',
    activo: true,
    fechaRegistro: '2025-11-05',
    logo: '📚'
  },
  {
    id: 5,
    nombre: 'Tecnología Pro',
    ruc: '3216549870',
    rubro: 'Tecnología',
    descripcion: 'Venta de equipos electrónicos y tecnología',
    direccion: 'Calle Sucre #456',
    telefono: '+591 77777777',
    email: 'tecno@gmail.com',
    password: ('tecno123'),
    plan: 'premium',
    activo: true,
    fechaRegistro: '2025-11-20',
    logo: '💻'
  }
];

// ============================================
// USUARIOS FINALES (COMPRADORES)
// ============================================
export const USUARIOS = [
  {
    id: 1,
    nombre: 'Pedro Gómez',
    email: 'usuario@gmail.com',
    password: ('user123'),
    telefono: '+591 70000001',
    direccion: 'Zona Sur #123',
    fechaRegistro: '2026-01-01',
    rol: 'usuario'
  },
  {
    id: 2,
    nombre: 'Laura Mendoza',
    email: 'comprador@gmail.com',
    password: ('comp123'),
    telefono: '+591 70000002',
    direccion: 'Zona Norte #456',
    fechaRegistro: '2026-01-05',
    rol: 'usuario'
  },
  {
    id: 3,
    nombre: 'Miguel Torres',
    email: 'cliente@gmail.com',
    password: ('cliente123'),
    telefono: '+591 70000003',
    direccion: 'Centro #789',
    fechaRegistro: '2026-01-10',
    rol: 'usuario'
  }
];

// ============================================
// FUNCIONES AUXILIARES
// ============================================

// Función para validar login de administrador
export const validarLoginAdmin = (email, password) => {
  const admin = ADMINISTRADORES.find(a => a.email === email);
  if (!admin) return null;
  
  const passwordHash = (password);
  if (admin.password === passwordHash && admin.activo) {
    return { ...admin, password: undefined }; // No devolver la contraseña
  }
  return null;
};

// Función para validar login de microempresa
export const validarLoginMicroempresa = (email, password) => {
  const microempresa = MICROEMPRESAS.find(m => m.email === email);
  if (!microempresa) return null;
  
  const passwordHash = hashPassword(password);
  if (microempresa.password === passwordHash && microempresa.activo) {
    return { ...microempresa, password: undefined, rol: 'microempresa' };
  }
  return null;
};

// Función para validar login de usuario
export const validarLoginUsuario = (email, password) => {
  const usuario = USUARIOS.find(u => u.email === email);
  if (!usuario) return null;
  
  const passwordHash = hashPassword(password);
  if (usuario.password === passwordHash) {
    return { ...usuario, password: undefined };
  }
  return null;
};

// Función para buscar microempresa por email
export const buscarMicroempresaPorEmail = (email) => {
  return MICROEMPRESAS.find(m => m.email === email);
};

// Función para buscar usuario por email
export const buscarUsuarioPorEmail = (email) => {
  return USUARIOS.find(u => u.email === email);
};

// Función para obtener microempresas activas
export const obtenerMicroempresasActivas = () => {
  return MICROEMPRESAS.filter(m => m.activo);
};

// Función para obtener microempresas por rubro
export const obtenerMicroempresasPorRubro = (rubro) => {
  return MICROEMPRESAS.filter(m => m.rubro === rubro && m.activo);
};

// Función para buscar microempresas por nombre
export const buscarMicroempresasPorNombre = (nombre) => {
  return MICROEMPRESAS.filter(m => 
    m.nombre.toLowerCase().includes(nombre.toLowerCase()) && m.activo
  );
};

// Función para obtener todos los rubros únicos
export const obtenerRubros = () => {
  const rubros = [...new Set(MICROEMPRESAS.map(m => m.rubro))];
  return rubros.sort();
};

// Función para registrar nueva microempresa
export const registrarMicroempresa = (datos) => {
  const nuevoId = Math.max(...MICROEMPRESAS.map(m => m.id)) + 1;
  const nuevaMicroempresa = {
    id: nuevoId,
    ...datos,
    password: hashPassword(datos.password),
    activo: true,
    fechaRegistro: new Date().toISOString().split('T')[0]
  };
  MICROEMPRESAS.push(nuevaMicroempresa);
  return nuevaMicroempresa;
};

// Función para registrar nuevo usuario
export const registrarUsuario = (datos) => {
  const nuevoId = Math.max(...USUARIOS.map(u => u.id)) + 1;
  const nuevoUsuario = {
    id: nuevoId,
    ...datos,
    password: hashPassword(datos.password),
    rol: 'usuario',
    fechaRegistro: new Date().toISOString().split('T')[0]
  };
  USUARIOS.push(nuevoUsuario);
  return nuevoUsuario;
};

// ============================================
// CREDENCIALES DE PRUEBA (PARA DESARROLLO)
// ============================================
export const CREDENCIALES_PRUEBA = {
  admin: {
    email: 'admin@sistema.com',
    password: 'admin123',
    descripcion: 'Administrador del sistema'
  },
  microempresa: {
    email: 'juanito@tienda.com',
    password: 'tienda123',
    descripcion: 'Tienda Don Juanito (Premium)'
  },
  usuario: {
    email: 'usuario@gmail.com',
    password: 'user123',
    descripcion: 'Usuario comprador'
  }
};