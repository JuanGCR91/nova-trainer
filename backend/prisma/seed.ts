// backend/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { AuthService } from '../src/services/auth.service';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...');

  // Crear usuarios de prueba
  const usuarios = [
    {
      email: 'admin@novatrainer.com',
      password: 'admin123',
      nombre: 'Admin',
      apellido: 'Sistema',
      rol: 'admin'
    },
    {
      email: 'supervisor@novatrainer.com',
      password: 'super123',
      nombre: 'Juan',
      apellido: 'Supervisor',
      rol: 'supervisor'
    },
    {
      email: 'agente@novatrainer.com',
      password: 'agente123',
      nombre: 'María',
      apellido: 'Agente',
      rol: 'agente'
    },
    {
      email: 'agente2@novatrainer.com',
      password: 'agente123',
      nombre: 'Carlos',
      apellido: 'Mendez',
      rol: 'agente'
    }
  ];

  console.log('👥 Creando usuarios...');
  for (const userData of usuarios) {
    const hashedPassword = await AuthService.hashPassword(userData.password);
    const usuario = await prisma.usuario.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        password: hashedPassword
      }
    });
    console.log(`   ✅ Usuario creado: ${usuario.email}`);
  }

  // Obtener el supervisor para asignarlo como creador
  const supervisor = await prisma.usuario.findUnique({
    where: { email: 'supervisor@novatrainer.com' }
  });

  if (supervisor) {
    // Crear campañas de ejemplo
    console.log('📋 Creando campañas...');

    const campana1 = await prisma.campana.create({
      data: {
        nombre: 'Retención de Clientes - Internet Hogar',
        descripcion: 'Campaña para retener clientes que quieren cancelar su servicio de internet',
        estado: 'activa',
        fechaInicio: new Date(),
        creadorId: supervisor.id,
        campos: [
          { nombre: 'nombre', tipo: 'texto', requerido: true },
          { nombre: 'apellido', tipo: 'texto', requerido: true },
          { nombre: 'dni', tipo: 'texto', requerido: true },
          { nombre: 'plan_actual', tipo: 'texto', requerido: true },
          { nombre: 'meses_cliente', tipo: 'numero', requerido: true },
          { nombre: 'motivo_cancelacion', tipo: 'texto', requerido: true },
          { nombre: 'monto_factura', tipo: 'numero', requerido: true }
        ],
        prompt: `Actúa como [nombre] [apellido], un cliente que tiene [meses_cliente] meses con la empresa.

Tu plan actual es: [plan_actual]
Tu monto de factura mensual es: S/. [monto_factura]

Estás llamando porque quieres cancelar tu servicio. Tu motivo principal es: [motivo_cancelacion]

Comportamiento:
- Inicialmente estás decidido a cancelar
- Si te ofrecen un descuento del 20% o más, podrías reconsiderar
- Si te ofrecen upgrade gratis por 3 meses, también lo considerarías
- Eres educado pero firme en tu decisión
- Si el agente es muy insistente, te molestas un poco
- Valoras el buen trato y las explicaciones claras`,
        criteriosEvaluacion: [
          { nombre: 'Empatía', peso: 20 },
          { nombre: 'Manejo de objeciones', peso: 25 },
          { nombre: 'Conocimiento del producto', peso: 15 },
          { nombre: 'Propuesta de valor', peso: 20 },
          { nombre: 'Cierre efectivo', peso: 20 }
        ]
      }
    });
    console.log(`   ✅ Campaña creada: ${campana1.nombre}`);

    const campana2 = await prisma.campana.create({
      data: {
        nombre: 'Ventas - Seguro de Vida',
        descripcion: 'Campaña de venta de seguros de vida para clientes del banco',
        estado: 'activa',
        fechaInicio: new Date(),
        creadorId: supervisor.id,
        campos: [
          { nombre: 'nombre', tipo: 'texto', requerido: true },
          { nombre: 'apellido', tipo: 'texto', requerido: true },
          { nombre: 'edad', tipo: 'numero', requerido: true },
          { nombre: 'profesion', tipo: 'texto', requerido: true },
          { nombre: 'tiene_hijos', tipo: 'booleano', requerido: true },
          { nombre: 'ingreso_mensual', tipo: 'numero', requerido: true },
          { nombre: 'personalidad', tipo: 'texto', requerido: true }
        ],
        prompt: `Actúa como [nombre] [apellido], tienes [edad] años y trabajas como [profesion].

Información personal:
- Ingreso mensual aproximado: S/. [ingreso_mensual]
- ¿Tienes hijos?: [tiene_hijos]
- Personalidad: [personalidad]

Contexto:
- El banco te está llamando para ofrecerte un seguro de vida
- No estabas pensando en contratar un seguro
- Eres [personalidad] al hablar por teléfono

Comportamiento según personalidad:
- Si eres "escéptico": Haces muchas preguntas y dudas de los beneficios
- Si eres "amigable": Escuchas con atención pero necesitas estar convencido
- Si eres "ocupado": Tienes prisa y solo te interesa si es muy relevante
- Si eres "analítico": Quieres todos los detalles y números exactos`,
        criteriosEvaluacion: [
          { nombre: 'Apertura efectiva', peso: 15 },
          { nombre: 'Identificación de necesidades', peso: 20 },
          { nombre: 'Presentación del producto', peso: 20 },
          { nombre: 'Manejo de objeciones', peso: 25 },
          { nombre: 'Cierre de venta', peso: 20 }
        ]
      }
    });
    console.log(`   ✅ Campaña creada: ${campana2.nombre}`);

    // Crear clientes simulados para cada campaña
    console.log('👤 Creando clientes simulados...');

    // Clientes para campaña de retención
    const clientesRetencion = [
      {
        campanaId: campana1.id,
        datos: {
          nombre: 'Ana',
          apellido: 'García',
          dni: '12345678',
          plan_actual: 'Internet 100 Mbps',
          meses_cliente: 24,
          motivo_cancelacion: 'El precio subió mucho y ya no puedo pagarlo',
          monto_factura: 159
        },
        estado: 'disponible',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        campanaId: campana1.id,
        datos: {
          nombre: 'Roberto',
          apellido: 'Mendoza',
          dni: '87654321',
          plan_actual: 'Internet 50 Mbps + Cable',
          meses_cliente: 36,
          motivo_cancelacion: 'El servicio se cae constantemente',
          monto_factura: 189
        },
        estado: 'disponible',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        campanaId: campana1.id,
        datos: {
          nombre: 'Lucía',
          apellido: 'Torres',
          dni: '45678912',
          plan_actual: 'Internet 200 Mbps',
          meses_cliente: 12,
          motivo_cancelacion: 'Me voy a mudar a otra ciudad',
          monto_factura: 199
        },
        estado: 'disponible',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }
    ];

    for (const clienteData of clientesRetencion) {
      await prisma.clienteSimulado.create({ data: clienteData });
    }
    console.log(`   ✅ ${clientesRetencion.length} clientes creados para retención`);

    // Clientes para campaña de ventas
    const clientesVentas = [
      {
        campanaId: campana2.id,
        datos: {
          nombre: 'Pedro',
          apellido: 'Sánchez',
          edad: 35,
          profesion: 'Ingeniero de Software',
          tiene_hijos: true,
          ingreso_mensual: 8000,
          personalidad: 'analítico'
        },
        estado: 'disponible',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        campanaId: campana2.id,
        datos: {
          nombre: 'Carmen',
          apellido: 'Flores',
          edad: 28,
          profesion: 'Doctora',
          tiene_hijos: false,
          ingreso_mensual: 12000,
          personalidad: 'amigable'
        },
        estado: 'disponible',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        campanaId: campana2.id,
        datos: {
          nombre: 'Miguel',
          apellido: 'Ramos',
          edad: 45,
          profesion: 'Empresario',
          tiene_hijos: true,
          ingreso_mensual: 15000,
          personalidad: 'ocupado'
        },
        estado: 'disponible',
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }
    ];

    for (const clienteData of clientesVentas) {
      await prisma.clienteSimulado.create({ data: clienteData });
    }
    console.log(`   ✅ ${clientesVentas.length} clientes creados para ventas`);
  }

  // Configuraciones del sistema
  console.log('⚙️  Creando configuraciones del sistema...');

  await prisma.configuracionSistema.create({
    data: {
      clave: 'tiempo_maximo_llamada',
      valor: 600, // 10 minutos en segundos
      descripcion: 'Tiempo máximo permitido para una simulación en segundos'
    }
  });

  await prisma.configuracionSistema.create({
    data: {
      clave: 'intentos_maximos_simulacion',
      valor: 3,
      descripcion: 'Número máximo de intentos por cliente simulado'
    }
  });

  console.log('✅ Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
