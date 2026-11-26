# Práctica 21 — Rutas, formulario y catálogo desde la API

En esta práctica organicé el panel del gimnasio en páginas con Angular Router, agregué un formulario reactivo para preparar una nueva clase y conecté el catálogo con la API mediante `httpResource`. El filtro, el resumen y el detalle siguen usando el servicio `Catalogo`.

## Ejecución

El proyecto incluye [gimnasio-admin](gimnasio-admin/) y [gimnasio-backend](gimnasio-backend/). Requiere MySQL 8, Node.js compatible con Angular 22 y dos terminales.

En el backend, `.env.ejemplo` contiene las variables de configuración. `DATABASE_URL` debe apuntar a `gimnasio_practica21` con las credenciales locales de MySQL. La base se prepara en Workbench con esta consulta.

```sql
CREATE DATABASE IF NOT EXISTS gimnasio_practica21
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

```powershell
cd gimnasio-backend
npm ci
Copy-Item .env.ejemplo .env
# Completar las credenciales locales en .env antes de continuar.
npm run prisma:generate
npx prisma migrate deploy
npm run prisma:seed
npm run start:dev
```

La API se sirve en `http://localhost:3000`. La carga inicial inserta los ejemplos y conserva los registros existentes al repetirse.

En otra terminal, desde la carpeta de la práctica:

```powershell
cd gimnasio-admin
npm ci
npm start
```

El panel se abre en `http://localhost:4200`. La dirección de la API está en `src/app/config.ts`. Cada proyecto se compila con `npm run build` desde su propia carpeta.

## Rutas

La barra permanece en el componente raíz y la página activa aparece en `router-outlet`. Las rutas son `/clases`, `/clases/nueva`, `/horarios` y `/miembros`. Horarios y Miembros muestran la página inicial solicitada para este ejercicio.

### Equivalencias con React Router

`router-outlet` cumple la función de `Outlet`, que indica dónde se muestra la página dentro del layout. `routerLink` equivale a `Link` para navegar sin recargar el documento. `routerLinkActive` aplica la clase del enlace activo, como el estado activo de `NavLink`.

### Orden de las rutas

Angular revisa las rutas en orden. El comodín `**` va al final porque acepta cualquier dirección y podría ocultar las rutas declaradas después. La redirección de la ruta vacía usa `pathMatch: 'full'` para coincidir únicamente con la dirección vacía completa.

## Formulario reactivo

El formulario contiene nombre, categoría, descripción, duración e imagen. Al intentar guardar, `markAllAsTouched()` permite ver los mensajes de los campos pendientes. Una duración de 47 minutos activa la regla de bloques de 5 minutos. Con datos válidos se muestra el objeto preparado mediante `getRawValue()`.

### ¿Dónde vive el valor de un campo?

Cada valor vive en un `FormControl` dentro del `FormGroup`. El control también guarda sus validadores y estados como `touched`, `dirty` e `invalid`. `formControlName` conecta ese modelo con el campo HTML. En React se suele usar `useState` para guardar el valor y manejar por separado los cambios y las validaciones.

### ¿Qué devuelve el validador propio?

`multiploDe(5)` devuelve `null` cuando el valor cumple la regla. Cuando falla, devuelve un objeto `{ multiploDe: { n, valor } }`. La plantilla consulta esa llave con `hasError('multiploDe')` para mostrar el mensaje. Los valores vacíos se delegan a `Validators.required`.

## Catálogo desde la API

`httpResource<Sobre<Clase[]>>` consulta `GET /clases`. El servicio obtiene las clases de `data` y expone estados de carga y error. Las imágenes de las tarjetas, el detalle y la vista previa se sirven desde la API.

### ¿Qué cambió en el servicio?

La fuente del catálogo pasó del arreglo local a un recurso HTTP. Los componentes mantienen las lecturas de `visibles()`, `minutosTotales()` y `seleccionada()`, y las acciones `filtrar()` y `seleccionar()`. El servicio conserva ese contrato y concentra el acceso a los datos. La página del catálogo además muestra los estados de carga y error.

### ¿Por qué se puede leer sin iniciar sesión?

El backend declara `GET /clases` como público mediante `@Publico()`. El guard permite esa consulta sin token. Las imágenes también son archivos públicos servidos por la API. Las operaciones de escritura mantienen la autorización del backend.

## Verificación

Ambos proyectos compilaron correctamente y sus instalaciones reportaron cero vulnerabilidades. Comprobé la navegación a Horarios y su enlace activo, los mensajes del formulario, el rechazo de 47 minutos, la aceptación de 50 minutos y la presentación del objeto preparado. También verifiqué las ocho imágenes desde la API y el mensaje de error al detener el backend.

## Evidencias

- [Ruta Horarios](evidencias/01-ruta-horarios.png). La dirección muestra `/horarios` y su enlace aparece activo.
- [Validación del formulario](evidencias/02-formulario-validacion.png). Al intentar guardar aparecen los mensajes de nombre y descripción obligatorios.
- [Duración de 47 minutos](evidencias/03-duracion-47.png). El validador propio muestra el mensaje de bloques de 5 minutos.
- [Objeto validado](evidencias/04-objeto-validado.png). Con una duración de 50 minutos, el formulario muestra los cinco campos preparados para la API.
- [Catálogo desde la API](evidencias/05-catalogo-api.png). El catálogo muestra 8 clases y 380 minutos, y Network registra `GET http://localhost:3000/clases` con respuesta `200 OK`.
