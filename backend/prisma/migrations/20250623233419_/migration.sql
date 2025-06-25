/*
  Warnings:

  - You are about to drop the column `campanaId` on the `ClienteSimulado` table. All the data in the column will be lost.
  - You are about to drop the column `caracteristicas` on the `ClienteSimulado` table. All the data in the column will be lost.
  - You are about to drop the column `motivo` on the `ClienteSimulado` table. All the data in the column will be lost.
  - You are about to drop the column `nombre` on the `ClienteSimulado` table. All the data in the column will be lost.
  - You are about to drop the column `objeciones` on the `ClienteSimulado` table. All the data in the column will be lost.
  - You are about to drop the column `perfil` on the `ClienteSimulado` table. All the data in the column will be lost.
  - You are about to drop the `Campaña` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ClienteSimulado" DROP CONSTRAINT "ClienteSimulado_campanaId_fkey";

-- AlterTable
ALTER TABLE "ClienteSimulado" DROP COLUMN "campanaId",
DROP COLUMN "caracteristicas",
DROP COLUMN "motivo",
DROP COLUMN "nombre",
DROP COLUMN "objeciones",
DROP COLUMN "perfil",
ADD COLUMN     "asignadoA" INTEGER,
ADD COLUMN     "campaniaId" INTEGER,
ADD COLUMN     "datos" JSONB,
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'disponible',
ADD COLUMN     "fechaActualizacion" TIMESTAMP(3),
ADD COLUMN     "fechaAsignacion" TIMESTAMP(3),
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "apellido" TEXT,
ADD COLUMN     "fechaActualizacion" TIMESTAMP(3),
ADD COLUMN     "fechaCreacion" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "password" TEXT;

-- DropTable
DROP TABLE "Campaña";

-- CreateTable
CREATE TABLE "Campania" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'activa',
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3),
    "campos" JSONB NOT NULL,
    "prompt" TEXT NOT NULL,
    "criteriosEvaluacion" JSONB,
    "creadorId" INTEGER NOT NULL,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Campania_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Simulacion" (
    "id" SERIAL NOT NULL,
    "clienteId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "sessionId" TEXT NOT NULL,
    "estado" TEXT NOT NULL DEFAULT 'en_progreso',
    "fechaInicio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaFin" TIMESTAMP(3),
    "duracion" INTEGER,
    "transcripcion" JSONB NOT NULL,
    "calificacion" DOUBLE PRECISION,
    "feedback" TEXT,
    "evaluacion" JSONB,
    "tipificacion" JSONB,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Simulacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracionSistema" (
    "id" SERIAL NOT NULL,
    "clave" TEXT NOT NULL,
    "valor" JSONB NOT NULL,
    "descripcion" TEXT,
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConfiguracionSistema_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Campania_estado_idx" ON "Campania"("estado");

-- CreateIndex
CREATE INDEX "Campania_fechaInicio_fechaFin_idx" ON "Campania"("fechaInicio", "fechaFin");

-- CreateIndex
CREATE UNIQUE INDEX "Simulacion_sessionId_key" ON "Simulacion"("sessionId");

-- CreateIndex
CREATE INDEX "Simulacion_usuarioId_estado_idx" ON "Simulacion"("usuarioId", "estado");

-- CreateIndex
CREATE INDEX "Simulacion_clienteId_idx" ON "Simulacion"("clienteId");

-- CreateIndex
CREATE INDEX "Simulacion_sessionId_idx" ON "Simulacion"("sessionId");

-- CreateIndex
CREATE INDEX "Simulacion_fechaInicio_idx" ON "Simulacion"("fechaInicio");

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracionSistema_clave_key" ON "ConfiguracionSistema"("clave");

-- CreateIndex
CREATE INDEX "ConfiguracionSistema_clave_idx" ON "ConfiguracionSistema"("clave");

-- CreateIndex
CREATE INDEX "ClienteSimulado_campaniaId_estado_idx" ON "ClienteSimulado"("campaniaId", "estado");

-- CreateIndex
CREATE INDEX "ClienteSimulado_asignadoA_idx" ON "ClienteSimulado"("asignadoA");

-- CreateIndex
CREATE INDEX "Usuario_email_idx" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_rol_idx" ON "Usuario"("rol");

-- AddForeignKey
ALTER TABLE "Campania" ADD CONSTRAINT "Campania_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteSimulado" ADD CONSTRAINT "ClienteSimulado_campaniaId_fkey" FOREIGN KEY ("campaniaId") REFERENCES "Campania"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulacion" ADD CONSTRAINT "Simulacion_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "ClienteSimulado"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Simulacion" ADD CONSTRAINT "Simulacion_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
