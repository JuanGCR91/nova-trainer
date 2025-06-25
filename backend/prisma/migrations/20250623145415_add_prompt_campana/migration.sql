/*
  Warnings:

  - Added the required column `campos` to the `Campaña` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prompt` to the `Campaña` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Campaña" ADD COLUMN     "campos" JSONB NOT NULL,
ADD COLUMN     "prompt" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ClienteSimulado" ADD COLUMN     "campanaId" INTEGER;

-- AddForeignKey
ALTER TABLE "ClienteSimulado" ADD CONSTRAINT "ClienteSimulado_campanaId_fkey" FOREIGN KEY ("campanaId") REFERENCES "Campaña"("id") ON DELETE SET NULL ON UPDATE CASCADE;
