// backend/src/index.ts

import http from 'http';
import app from './server'; // Importa la instancia de la aplicación ya configurada

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`📁 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT configurado: ${process.env.JWT_SECRET ? 'Sí' : 'No'}`);
  console.log(`🤖 OpenAI configurado: ${process.env.OPENAI_API_KEY ? 'Sí' : 'No'}`);
  console.log(`🎙️  ElevenLabs configurado: ${process.env.ELEVENLABS_API_KEY ? 'Sí' : 'No'}`);
});

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
  console.log('SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado grácilmente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT recibido, cerrando servidor...');
  server.close(() => {
    console.log('Servidor cerrado grácilmente');
    process.exit(0);
  });
});