# Práctica 08 — Prisma: esquema y migraciones

## Objetivo

Configurar Prisma sobre la API del gimnasio y representar sus cuatro entidades en MySQL mediante un historial de migraciones.

Las entidades son Clase, Horario, Miembro e Inscripcion.

## Entorno utilizado

- MySQL 8.0.41, puerto 3306.
- MySQL Workbench.
- Prisma, Prisma Client y adaptador MariaDB 7.10.1.
- NestJS 11.2.8.
- Base de datos: `gimnasio_practica08`.

## Instalación y configuración

Desde la carpeta `practica08`:

```powershell
npm install
Copy-Item .env.example .env
```

Editar `.env` y sustituir los datos de ejemplo por las credenciales locales:

```dotenv
DATABASE_URL="mysql://root:TU_PASSWORD@localhost:3306/gimnasio_practica08"
```

Si la contraseña contiene caracteres especiales, deben codificarse para una URL.

El archivo `.env` no se entrega. `.env.example` contiene únicamente una plantilla sin credenciales reales.

`prisma7.config.ts` carga las variables mediante `import "dotenv/config"` y obtiene la conexión desde `DATABASE_URL`.

## Aplicar las migraciones

Para reproducir el esquema en una base local nueva, con un usuario que tenga los permisos necesarios:

```powershell
npx prisma migrate deploy
npx prisma generate
npm run build
```

`migrate deploy` aplica las migraciones existentes. No genera un historial nuevo.

Durante el desarrollo se utilizó `prisma migrate dev --name ...` para generar y aplicar cada cambio.

Para consultar el estado:

```powershell
npx prisma migrate status
```

## Esquema

| Modelo | Tabla | Características |
|---|---|---|
| Clase | `clases` | ID autoincremental, nombre y descripción opcional |
| Horario | `horarios` | Relación con Clase y datos del horario |
| Miembro | `miembros` | Correo único y estado activo por defecto |
| Inscripcion | `inscripciones` | Relaciones con Horario y Miembro, estado y fecha |

Los nombres de las tablas se establecen mediante `@@map`.

`EstadoInscripcion` admite `confirmada` y `cancelada`.

La combinación de `horarioId` y `miembroId` tiene una restricción única.

## Historial de migraciones

Se generaron y aplicaron cinco migraciones, en este orden:

1. `inicial`: creación de `clases`.
2. `agregar_descripcion_clase`: incorporación de la descripción opcional.
3. `agregar_horarios`: creación de `horarios` y su relación con `clases`.
4. `agregar_miembros`: creación de `miembros`, con correo único.
5. `agregar_inscripciones`: creación de `inscripciones`, sus relaciones y su restricción única compuesta.

Los archivos SQL y `migration_lock.toml` se incluyen en `prisma/migrations`.

La primera migración utilizó `CREATE TABLE`; la segunda agregó una columna mediante `ALTER TABLE`.

MySQL contiene las cuatro tablas del gimnasio y `_prisma_migrations`, que registra el historial aplicado.

## Relaciones

- Una Clase puede tener varios Horarios.
- Un Horario puede tener varias Inscripciones.
- Un Miembro puede tener varias Inscripciones.

Inscripcion actúa como entidad intermedia entre Miembro y Horario, y almacena además el estado y la fecha.

Las relaciones se configuraron con `onDelete: Cascade`. Eliminar un registro padre puede eliminar sus registros relacionados.

## Alcance

Esta práctica define y aplica el esquema de MySQL y genera el cliente de Prisma.

Los repositorios de la API continúan en memoria. Generar el cliente no cambia automáticamente el almacenamiento de los servicios.

La restricción única de horario y miembro también incluye las inscripciones canceladas. Al conectar los repositorios con MySQL será necesario contemplar esa restricción en las operaciones de reinscripción.

## Verificación

```powershell
npx prisma validate
npx prisma migrate status
npx prisma generate
npm run build
npm audit
```

Resultados obtenidos:

- Esquema validado.
- Cinco migraciones aplicadas y ninguna pendiente.
- Cuatro tablas del gimnasio comprobadas en Workbench.
- Cliente Prisma 7.10.1 generado.
- Compilación sin errores.
- Auditoría con cero vulnerabilidades.

Se utiliza un override de Multer 2.5.0 dentro de `@nestjs/platform-express`.

## Preguntas de reflexión

### 1. ¿Por qué el adaptador se llama adapter-mariadb si usamos MySQL?

Porque utiliza el conector de MariaDB, que también es compatible con MySQL. El nombre identifica el conector empleado, no obliga a cambiar el servidor de base de datos a MariaDB.

### 2. ¿Editar schema.prisma cambió algo en la base de datos antes de migrar?

No. Editar el archivo cambió la descripción del esquema en el proyecto.

El cambio en MySQL ocurrió al ejecutar la migración, que generó y aplicó el SQL correspondiente.

### 3. ¿La carpeta de migraciones es una foto del esquema o un historial?

Es un historial de cambios ordenados.

Por ejemplo, primero se creó `clases` sin descripción y después otra migración agregó esa columna. Conservar ambas permite reproducir esa evolución.

### 4. ¿Por qué Horario.clase crea columna y Clase.horarios no?

La columna real es `Horario.claseId`. El campo de relación `Horario.clase` utiliza ese valor mediante `@relation(fields: [claseId], references: [id])`.

`Clase.horarios` representa la relación inversa: permite acceder a los horarios de una clase, pero no necesita otra columna en `clases`.

Los campos de relación no son columnas adicionales; la relación se almacena mediante la clave foránea `claseId`.

### 5. ¿De dónde sale la relación muchos a muchos entre Miembro y Horario?

De la entidad intermedia Inscripcion.

Cada inscripción pertenece a un miembro y a un horario. Un miembro puede tener varias inscripciones y un horario puede tener varias inscripciones; así se forma la relación muchos a muchos.

## Evidencias

### Migración inicial
![Creación de Clase](evidencias/01-migracion-inicial.png)

### Descripción opcional
![Segunda migración](evidencias/02-descripcion-clase.png)

### Horarios
![Migración de Horario](evidencias/03-horarios.png)

### Miembros
![Migración de Miembro](evidencias/04-miembros.png)

### Inscripciones
![Migración de Inscripcion](evidencias/05-inscripciones.png)

### Tablas en MySQL
![Cuatro tablas del gimnasio](evidencias/06-tablas-mysql.png)

### Índice único de Inscripción
![Índice único compuesto de horario y miembro](evidencias/07-indices-inscripciones.png)

### Estado de las migraciones
![Cinco migraciones sin pendientes](evidencias/08-estado-migraciones.png)

### Verificación final
![Generación, compilación y auditoría](evidencias/09-verificacion-final.png)