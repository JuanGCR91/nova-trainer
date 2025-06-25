/*
  Warnings:

  - You are about to drop the column `campaniaId` on the `ClienteSimulado` table. All the data in the column will be lost.
  - You are about to drop the `Campania` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Campania" DROP CONSTRAINT "Campania_creadorId_fkey";

-- DropForeignKey
ALTER TABLE "ClienteSimulado" DROP CONSTRAINT "ClienteSimulado_campaniaId_fkey";

-- DropIndex
DROP INDEX "ClienteSimulado_campaniaId_estado_idx";

-- AlterTable
ALTER TABLE "ClienteSimulado" DROP COLUMN "campaniaId",
ADD COLUMN     "campanaId" INTEGER;

-- DropTable
DROP TABLE "Campania";

-- CreateTable
CREATE TABLE "Campana" (
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

    CONSTRAINT "Campana_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Campana_estado_idx" ON "Campana"("estado");

-- CreateIndex
CREATE INDEX "Campana_fechaInicio_fechaFin_idx" ON "Campana"("fechaInicio", "fechaFin");

-- CreateIndex
CREATE INDEX "ClienteSimulado_campanaId_estado_idx" ON "ClienteSimulado"("campanaId", "estado");

-- AddForeignKey
ALTER TABLE "Campana" ADD CONSTRAINT "Campana_creadorId_fkey" FOREIGN KEY ("creadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClienteSimulado" ADD CONSTRAINT "ClienteSimulado_campanaId_fkey" FOREIGN KEY ("campanaId") REFERENCES "Campana"("id") ON DELETE CASCADE ON UPDATE CASCADE;
