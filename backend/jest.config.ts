// jest.config.js

module.exports = {
  preset: 'ts-jest',  // Usa el preset para TypeScript
  testEnvironment: 'node',  // Define el entorno para las pruebas
  transform: {
    '^.+\\.tsx?$': 'ts-jest',  // Usa ts-jest para transformar archivos TypeScript
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'], // Extensiones manejadas
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'], // Patrón de nombres de archivo de prueba
};