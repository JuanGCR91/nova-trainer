/*
  Warnings:

  - Changed the type of `caracteristicas` on the `ClienteSimulado` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- Crear columna temporal
ALTER TABLE "ClienteSimulado" ADD COLUMN "caracteristicas_temp" JSONB;

-- Convertir datos existentes de string a JSON
-- Si los datos ya están en formato JSON válido:
UPDATE "ClienteSimulado" 
SET "caracteristicas_temp" = "caracteristicas"::jsonb 
WHERE "caracteristicas"::text ~ '^[\[\{].*[\]\}]$';

-- Si hay datos que no son JSON válidos, convertirlos a objeto JSON:
UPDATE "ClienteSimulado" 
SET "caracteristicas_temp" = json_build_object('data', "caracteristicas")::jsonb 
WHERE "caracteristicas_temp" IS NULL;

-- Eliminar columna original
ALTER TABLE "ClienteSimulado" DROP COLUMN "caracteristicas";

-- Renombrar columna temporal
ALTER TABLE "ClienteSimulado" RENAME COLUMN "caracteristicas_temp" TO "caracteristicas";

-- Hacer la columna NOT NULL
ALTER TABLE "ClienteSimulado" ALTER COLUMN "caracteristicas" SET NOT NULL;