# Gestión de Incapacidades – Demo

Aplicación web interna para **gestión de incapacidades médicas** (radicación, seguimiento y trazabilidad), desarrollada con:

- **Next.js** (App Router, TypeScript)
- **NextAuth** (autenticación por credenciales)
- **Prisma ORM** con **SQLite**
- **Next API routes** para lógica de negocio
- Generación de **PDF** en el navegador con `jspdf`

La aplicación está pensada como una demo funcional para uso académico / interno.

---

## 1. Requisitos previos

Asegúrate de tener instalado:

- **Node.js** >= 18 (recomendado LTS)
- **npm** (incluido con Node)
- No es necesario instalar SQLite manualmente, Prisma gestiona el archivo de base de datos.

---

## 2. Instalación

1. Clonar el repositorio:

   ```bash
   git clone <URL_DEL_REPO>
   cd gestion_incapacidades

   ```

2. Instalar dependencias:

npm install

Esto instalará, entre otros:

next, react, react-dom

next-auth

prisma y @prisma/client

bcrypt

ts-node (para el seed)

jspdf (para exportar a PDF desde el detalle de una incapacidad)

3. Configuración de variables de entorno

Crea un archivo .env.local en la raíz del proyecto (mismo nivel que package.json) con algo similar a lo siguiente:

# Base de datos SQLite (archivo local)

DATABASE_URL="file:./dev.db"

# Configuración NextAuth

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="cambia-esto-por-una-clave-larga-y-segura"

Nota:

NEXTAUTH_SECRET puede generarse con cualquier string largo y aleatorio.

Si el proyecto ya incluye un .env.local de ejemplo, respétalo y ajusta solo lo necesario.

4. Base de datos y Prisma

El esquema de datos está definido en prisma/schema.prisma.

Para generar la base de datos y el cliente Prisma:

npx prisma migrate dev --name init

(O, si el proyecto ya está funcionando, puedes usar npx prisma db push para aplicar el esquema sin migraciones.)

Ejecutar el seed para crear usuarios de prueba:

npm run db:seed

Esto ejecuta prisma/seed.ts y crea dos usuarios:

Analista:

email: analista@example.com

password: demo123

Colaborador:

email: colaborador@example.com

password: demo123

(Opcional) Abrir Prisma Studio para ver/editar la base de datos:

npx prisma studio

5. Scripts disponibles

En package.json:

{
"scripts": {
"dev": "next dev",
"build": "next build",
"start": "next start",
"lint": "eslint",
"db:seed": "ts-node --transpile-only prisma/seed.ts"
}
}

npm run dev → levanta el servidor en modo desarrollo (http://localhost:3000).

npm run build → genera el build de producción.

npm start → sirve el build de producción.

npm run db:seed → carga usuarios de prueba en la tabla Usuario.

6. Uso de la aplicación
   6.1. Inicio de sesión

Levanta el proyecto:

npm run dev

Abre en el navegador:
http://localhost:3000/login

Ingresa con una de las credenciales de prueba:

Analista: analista@example.com / demo123

Colaborador: colaborador@example.com / demo123

La autenticación se gestiona con NextAuth usando un CredentialsProvider que valida el email y el password contra la tabla Usuario (hash de contraseña con bcrypt).

6.2. Panel principal (/)

Tras iniciar sesión, se redirige al panel de gestión de incapacidades:

Formulario para crear una nueva incapacidad, con campos como:

Profesional que emite (colaborador)

Nombre del paciente

Documento del paciente (opcional)

Tipo de radicación (EPS, ARL, PARTICULAR)

Fecha de inicio

Días de incapacidad

Entidad

Al guardar:

Se registra la incapacidad en la base de datos.

Aparece un mensaje de éxito: “Incapacidad creada correctamente”.

Se dispara un evento global para refrescar el listado.

Debajo del formulario hay un botón:

“Ver incapacidades registradas” → redirige a /incapacidades.

6.3. Listado de incapacidades (/incapacidades)

En esta vista se muestra el listado paginado/simple de todas las incapacidades:

Información básica por fila:

ID

Nombre del paciente (o colaborador si no se registró paciente)

Tipo

Fecha de inicio

Días

Entidad

Documento del paciente (si aplica)

Selector de estado:

REGISTRADA, EN_REVISION, APROBADA, RECHAZADA

Al cambiar el estado se hace un PATCH al endpoint /api/incapacidades/[id].

Botón “Ver”:

Abre un modal con el detalle completo de la incapacidad.

6.4. Detalle de incapacidad (modal)

Dentro del modal de detalle se muestran varios bloques:

Cabecera:

Nombre del paciente

Profesional que emite

Estado (píldora de color)

Tipo de radicación + días

Información de la incapacidad:

Documento del paciente

Entidad

Fecha de inicio

Días

Timestamps de creación y actualización

Documentos asociados:

Componente UploadBox para adjuntar archivos (.pdf, .jpeg, .png) a la incapacidad.

Componente DocsList para listar esos documentos y abrirlos.

Llamadas a rutas tipo /api/incapacidades/[id]/documentos y /api/documentos/[docId]/download.

Bitácora de movimientos:

Componente BitacoraList para ver acciones registradas (cambios de estado, etc.).

Lectura vía /api/incapacidades/[id]/bitacora.

Exportar a PDF:

Botón “Exportar PDF” que genera un PDF en el navegador usando jspdf con:

Datos del paciente

Información de la incapacidad

Trazabilidad (creado / actualizado)

Se descarga automáticamente con nombre incapacidad-[id].pdf.

7. Arquitectura (resumen rápido)

prisma/schema.prisma
Define los modelos:

Usuario (id, email, nombre, password hash, rol)

Incapacidad (datos del caso, estado, timestamps)

Documento (archivos asociados)

Bitacora (movimientos)

src/app

Páginas principales (/, /login, /incapacidades) usando el App Router.

Rutas API para CRUD de incapacidades, documentos, bitácora, etc.

src/components

incapacidades/Form.tsx → formulario de creación.

incapacidades/List.tsx → listado de incapacidades.

incapacidades/Detail.tsx → detalle en modal + exportación a PDF.

incapacidades/DocsList.tsx, BitacoraList.tsx, UploadBox.tsx → componentes auxiliares.

common/Modal.tsx → componente genérico de modal.

layout/AppHeader.tsx → barra superior con navegación y usuario.

src/lib

auth.ts → configuración de NextAuth (provider credenciales + callbacks).

db.ts → instancia de Prisma.

Utilidades varias (errores, etc.).

8. Estilo y UI

El proyecto utiliza:

CSS global minimalista (src/app/global.css) para:

tipografía

fondo oscuro con degradados

estilos base para inputs y botones

Muchos componentes usan estilos inline basados en CSSProperties para:

tarjetas

layouts de panel

modales

botones con degradados y sombras suaves

La interfaz está pensada como un pequeño dashboard interno moderno, con:

Panel de login con layout dividido (mensaje a la izquierda, formulario a la derecha).

Header fijo con navegación (Panel, Incapacidades) + usuario autenticado.

Tarjetas claras para formularios y listados de información.

9. Ejecución en producción (básico)

Para un despliegue básico en un servidor propio:

# 1. Instalar dependencias

npm install

# 2. Migrar base de datos

npx prisma migrate deploy

# 3. (Opcional) ejecutar seed de datos

npm run db:seed

# 4. Build de producción

npm run build

# 5. Servir la app

npm start

Asegúrate de configurar correctamente las variables de entorno (DATABASE_URL, NEXTAUTH_URL, NEXTAUTH_SECRET) en el entorno de producción.

10. Notas finales

Este proyecto es una base demo, pensada para ser extendida:

más roles y permisos

filtros y búsqueda avanzada en el listado

reportes agregados

mejor manejo de adjuntos (almacenamiento en S3, etc.)

El flujo actual ya permite:

login con usuarios de prueba

creación de incapacidades

actualización de estado

carga de documentos

consulta de bitácora

exportación a PDF de los datos principales
