// backend/src/server.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

// Cargar variables de entorno
dotenv.config();

// Importar rutas
import authRoutes from './routes/auth';
import usuariosRoutes from './routes/usuarios';
import campañasRoutes from './routes/campañas';
import clientesRoutes from './routes/clientes';
import simuladorRoutes from './routes/simulador';

// Importar middleware
import { authenticateJWT } from './middleware/auth';

// Configuración de la aplicación Express
const app = express();
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,  // Permite compartir cookies de autenticación entre dominios.
};

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET no configurado en .env');
}

// Middleware globales
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos (audio, uploads)
app.use('/audio', express.static(path.join(__dirname, '../temp/audio')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Rutas públicas
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas protegidas
app.use('/api/usuarios', authenticateJWT, usuariosRoutes);
app.use('/api/campañas', authenticateJWT, campañasRoutes);
app.use('/api/clientes', authenticateJWT, clientesRoutes);
app.use('/api/simulador', authenticateJWT, simuladorRoutes);

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint no encontrado' 
  });
});

// Manejo de errores global
app.use((
  err: Error & { status?: number },  // Mejora tipado del error
  req: express.Request, 
  res: express.Response, 
  next: express.NextFunction
) => {
  console.error('Error no manejado:', err);
  res.status(err.status || 500).json({ 
    error: 'Error interno del servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Exportar la aplicación para que pueda ser usada en index.ts
export default app;