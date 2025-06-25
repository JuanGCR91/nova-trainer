import jwt from 'jsonwebtoken';
import request from 'supertest';
import app from '../server';

// Cambia `your_default_jwt_secret_here` por el mismo secreto usado en tu app en producción
const secret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Generar un token valido de administrador
const tokenValidoAdmin = jwt.sign(
  { username: 'adminUser', role: 'admin' }, 
  secret, 
  { expiresIn: '1h' }
);

// Usa un token inválido simulado
const tokenInvalido = 'wrong_token_string';

describe('GET /api/usuarios', () => {
  it('debería devolver 403 si no es un admin', async () => {
    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${tokenInvalido}`);
    expect(response.status).toBe(403);
  });

  it('debería devolver 200 para un admin autorizado', async () => {
    const response = await request(app)
      .get('/api/usuarios')
      .set('Authorization', `Bearer ${tokenValidoAdmin}`);
    expect(response.status).toBe(200);
  });
});