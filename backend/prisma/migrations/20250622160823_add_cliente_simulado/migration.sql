-- CreateTable
CREATE TABLE "ClienteSimulado" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "perfil" TEXT NOT NULL,
    "objeciones" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "caracteristicas" TEXT NOT NULL,

    CONSTRAINT "ClienteSimulado_pkey" PRIMARY KEY ("id")
);
