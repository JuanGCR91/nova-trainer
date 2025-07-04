Documento Técnico: Entrenamiento de un Agente de IA para el Desarrollo del Proyecto NOVA TRAINER

1. Propósito del Agente IA
El agente IA se entrenará para asistir en el diseño, desarrollo, prueba, despliegue y documentación de la plataforma SaaS multitenant NOVA TRAINER, cuyo objetivo es entrenar agentes de contact center mediante simulaciones con IA conversacional y evaluaciones automáticas.

2. Objetivos Específicos
1.      Apoyar en la generación de código frontend y backend según el stack definido.
2.      Documentar requerimientos funcionales y no funcionales.
3.      Asistir en el diseño de base de datos y relaciones.
4.      Proveer prompts personalizados para el modelo GPT.
5.      Simular escenarios y pruebas de usuario por rol.
6.      Sugerir arquitecturas escalables y seguras.

3. Stack Tecnológico de Referencia
Frontend:
·         Next.js (React) + TypeScript
·         Tailwind CSS + shadcn/ui
·         next-intl / react-i18next
·         NextAuth.js
Backend:
·         Node.js + Express (TypeScript)
·         Prisma ORM
·         PostgreSQL
·         API REST o GraphQL
DevOps:
·         GitHub + GitHub Actions
·         Docker Compose local
·         Despliegue: Vercel (frontend), Render o AWS (backend)
·         Monitorización: Sentry, Grafana/Prometheus

4. Reglas y Funciones por Rol
Administrador:
·         Crear usuarios (supervisores, agentes).
·         Crear empresas multitenant.
·         Control total sobre campañas y usuarios.
Supervisor:
·         Crear/editar campañas y escenarios.
·         Crear solo usuarios agentes y asignarlos a campañas.
·         Cambiar agentes de campaña.
·         Crear campos personalizados del cliente simulado.
·         Activar visibilidad de campos para CRM del agente.
·         Configurar prompt GPT por campaña:
o   Visualizar campos del cliente.
o   Arrastrar campos al prompt.
·         Visualizar dashboards y reportes.
Agente:
·         Acceder al simulador.
·         Solicitar cliente aleatoriamente.
·         Iniciar llamada con IA.
·         Visualizar solo su desempeño.
·         No puede descargar reportes.

5. Reglas de Seguridad
·         Autenticación robusta (JWT o NextAuth).
·         Cifrado HTTPS + AES-256.
·         Roles y permisos estrictos.
·         Prevención XSS, CSRF, SQLi.
·         Logging de auditoría.

6. Prompts GPT por Campaña
Formato general de prompt:
Eres un cliente llamado {{nombre}}. Tienes {{edad}} años y llamas por el siguiente motivo: {{motivo}}. Estás molesto porque {{descripcion}}. Tu objetivo es que el agente {{objetivo}}.
El agente IA deberá permitir al supervisor:
·         Ver la lista de campos definidos.
·         Insertarlos de forma visual (drag & drop) en el prompt.

7. Flujo General del Proyecto (User Journeys)
1.      Login / Registro / Selección de rol.
2.      Supervisor crea campaña y campos de cliente.
3.      Carga de clientes simulados.
4.      Configuración del prompt.
5.      Supervisor crea agentes y los asigna.
6.      Agente solicita cliente aleatorio.
7.      Inicia conversación con IA.
8.      Recibe feedback automático.
9.      Supervisor monitorea KPIs.

8. Recomendaciones de Desarrollo para el Agente IA
·         Usar embeddings para entender estructura del sistema.
·         Instruir sobre relaciones entre entidades (campañas, agentes, campos, evaluaciones).
·         Entrenar con ejemplos de prompts, escenarios, respuestas deseadas.
·         Documentar cada módulo en lenguaje natural y código comentado.
·         Generar archivos .ts, .tsx, .sql y .md bajo convenciones de carpeta /src, /components, /api, /db, /docs.

9. Roadmap de Entrenamiento del Agente IA
Semana
Actividad
1
Entrenamiento en estructura y flujo de usuarios
2
Modelado de datos y relaciones Prisma + PostgreSQL
3
Generación de prompts GPT y UI de configuración
4
Desarrollo incremental con pruebas por rol
5
Automatización de CI/CD y despliegue
6+
Optimizaciones, funciones extendidas y validación de seguridad


Este documento servirá como guía técnica base para instruir y entrenar un agente IA de desarrollo que asista de forma continua en el ciclo de vida del proyecto NOVA TRAINER.
🧠 Resumen General del Proyecto
Tipo: Plataforma SaaS B2B multitenant
 Objetivo: Entrenamiento con IA conversacional de agentes de contact center, mediante simulaciones, feedback automático y visualización de desempeño.
 Alcance: MVP + Desarrollo completo.

👤 Roles y Funcionalidades
🔧 Administrador
Tiene control total sobre la plataforma y su configuración general.
Funciones clave:
Gestión de usuarios, empresas (multitenant) y roles (solo Admins y Supervisores).


Supervisión de todas las campañas activas por empresa.


Control de versiones, configuración global y gestión de auditorías.


Respaldo y restauración de datos.


Acceso a todos los dashboards y logs de uso del sistema.



👨‍💼 Supervisor
Responsable de crear campañas, campos, clientes simulados, agentes y monitorear desempeño.
Funcionalidades específicas:
Gestión de Campañas y Simulaciones


Crear, editar y eliminar campañas.


Definir escenarios/casuísticas para simulación.


Gestión de Clientes Simulados


Crear clientes simulados de forma manual o masiva (.csv/.xlsx).


Customizar los campos de cada cliente simulado (nombre, edad, producto, etc.).


Activar casillas para definir qué campos del cliente serán visibles en el CRM del agente.


Gestión de Agentes


Crear usuarios con rol exclusivo de agente.


Asignar agentes a campañas específicas.


Cambiar el agente de campaña en cualquier momento.


Configuración del Prompt GPT


Pestaña especial donde:


Se visualizan los campos del cliente simulado.


Se puede arrastrar y soltar los campos dentro del área del prompt personalizado.


Esto permite generar prompts dinámicos y personalizados por campaña, con los datos del cliente simulado.


Evaluación y Feedback


Ver el historial de conversaciones de cada agente.


Visualizar y editar (si se desea) el feedback generado automáticamente por la IA.


Evaluar agentes según plantillas configurables (criterios, pesos).


Dashboard


KPIs de desempeño por agente, campaña y escenario.


Descarga de reportes y exportación de resultados.



🧑‍💻 Agente
Rol enfocado en el entrenamiento mediante simulaciones y mejora personal.
Funcionalidades específicas:
Acceso al Simulador:


Solicitar cliente de forma aleatoria (no visible para el agente antes de iniciar).


Visualizar CRM solo con los campos permitidos por el supervisor.


Clic en “Iniciar llamada” para comenzar simulación con IA (voz o chat).


Visualización de Desempeño Personal:


Ver su puntaje, evaluación y feedback automático.


Acceso únicamente a su dashboard personal.


No puede descargar reportes.


Restricciones:


No tiene acceso a históricos ajenos, ni configuración.


No puede modificar prompts, campañas ni tipificaciones.



🛠️ Stack Tecnológico Utilizado
Frontend
Next.js (React) + TypeScript


Tailwind CSS + shadcn/ui


Multiidioma: next-intl o react-i18next


Autenticación: NextAuth.js


Backend
Node.js + Express (TypeScript)


Prisma ORM


Base de datos relacional: PostgreSQL


Autenticación: JWT o NextAuth


API REST/GraphQL


Infraestructura / DevOps
Repositorio: GitHub


CI/CD: GitHub Actions


Despliegue: Vercel (frontend), Render o AWS (backend/db)


Contenedores: Docker Compose


Monitorización: Sentry, Grafana, Prometheus
