import jwt from 'jsonwebtoken';

// Utiliza el secreto real que usas en tu ambiente
const secret = process.env.JWT_SECRET || 'your_default_jwt_secret_here';

// Genera un token para un usuario administrador de pruebas
const token = jwt.sign(
  {
    username: 'adminUser',
    role: 'admin'  // Asegúrate de que el payload refleja un usuario administrador
  }, 
  secret, 
  { expiresIn: '1h' }
);

console.log(`Token JWT de administrador: ${token}`);