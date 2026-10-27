# Práctica 14 — La tienda contra su API

## Objetivo

En esta práctica se conectó la tienda de React con una API desarrollada con NestJS, Prisma y MySQL. Se trabajó con efectos, una capa de servicios y un hook propio para consultar los productos y manejar los estados de carga, error y datos.

También se implementó un formulario controlado para completar un pago simulado. Cuando el pedido se confirma, la tienda muestra su folio, vacía el carrito y vuelve a consultar el catálogo para mostrar la existencia actualizada.

## Organización del proyecto

- `tienda/`: frontend de React y TypeScript basado en la práctica 13.
- `tienda/src/servicios/api.ts`: única instancia de Axios y traducción de errores.
- `tienda/src/servicios/productos.ts`: consulta del catálogo y extracción del sobre.
- `tienda/src/servicios/pedidos.ts`: envío del pedido y recepción de su folio.
- `tienda/src/hooks/useProductos.ts`: efecto de consulta y estados de la petición.
- `tienda/src/FormularioPago.tsx`: campos controlados y validación del pago.
- `tienda-backend/`: API de productos y pedidos con almacenamiento en MySQL.
- `tienda-backend/prisma/`: esquema, migraciones y carga inicial de productos.
- `evidencias/`: capturas de las pruebas.

## Funcionamiento

### Consulta del catálogo

La instancia de Axios utiliza una dirección base configurable mediante `VITE_API_URL` y un tiempo límite de ocho segundos. Los componentes no importan Axios; utilizan el hook y las funciones de servicio.

El servicio recibe la respuesta HTTP, extrae la lista de `respuesta.data.data` y devuelve los productos. El primer `data` corresponde a Axios y el segundo pertenece al sobre `{ data, meta }` de la API.

El hook `useProductos` inicia la consulta mediante `useEffect` y devuelve `productos`, `cargando`, `error` y `recargar`. Una respuesta anterior no modifica el estado cuando su efecto ya terminó. La pantalla muestra el indicador de carga, el mensaje con Reintentar o el catálogo, según el resultado.

Se conservaron sin cambios los componentes `TarjetaProducto`, `Catalogo`, `Filtros`, `Encabezado`, `PiePagina` y `Layout` de la práctica 13. Los datos del catálogo ahora provienen de MySQL.

### Pago simulado

Los campos de correo y teléfono utilizan `useState`, `value` y `onChange`. Antes de enviar se comprueba que el correo contenga `@`, que el teléfono tenga exactamente diez dígitos y que el carrito tenga productos. La API realiza su propia validación de los datos recibidos.

Los identificadores repetidos representan varias piezas del mismo producto. La API calcula el total, comprueba la existencia y guarda el pedido junto con el descuento del inventario en una transacción.

Cuando responde correctamente, se muestra el folio del pedido y el total confirmado. El carrito queda vacío y se vuelve a pedir el catálogo. Si el servidor devuelve un error, el formulario conserva el carrito y muestra su mensaje. Durante el envío se deshabilita el formulario para evitar pedidos duplicados desde el botón.

El pago es únicamente una simulación; no se solicitan datos bancarios ni se realizan cargos.

## Preguntas de reflexión

### 1. ¿Por qué aparecen dos peticiones al cargar la página?

Porque el proyecto utiliza `StrictMode` de React durante el desarrollo. En el montaje inicial, React ejecuta una comprobación adicional del efecto: lo inicia, ejecuta su limpieza y lo vuelve a iniciar.

Como el efecto consulta los productos, se pueden observar dos peticiones en la pestaña Red. Esto permite detectar problemas en la limpieza de los efectos. No significa que el usuario haya presionado dos veces un botón y no corresponde al comportamiento adicional de una compilación de producción.

### 2. ¿Qué pasa si se quita el arreglo de dependencias del efecto?

El efecto se ejecuta después de cada renderizado del componente. Cuando llega la respuesta, se actualiza la lista de productos y se produce un nuevo renderizado. Si el efecto no tiene arreglo de dependencias, vuelve a pedir la lista y el proceso puede repetirse continuamente.

En la pestaña Red se acumulan solicitudes a `/productos`, en lugar de limitarse a las consultas del montaje. La versión final incluye `[version]`: se consulta al montar y al cambiar esa versión mediante Reintentar o después de confirmar un pedido.

### 3. ¿Qué hace e.preventDefault() y qué pasa si se quita?

Evita la acción predeterminada de enviar el formulario mediante la navegación del navegador. Así se puede validar la información y enviar el pedido desde JavaScript sin recargar la página.

Si se quita, el navegador puede navegar o recargar al enviar el formulario. Como el estado del carrito y los campos vive en React, ese estado se pierde al montar nuevamente la aplicación. La petición asíncrona también puede quedar interrumpida y la confirmación no se muestra de forma confiable.

## Instalación y ejecución

Se requiere Node.js, npm y MySQL 8 en ejecución. El frontend y el backend se ejecutan en terminales separadas.

### Backend

Desde la raíz del repositorio:

```powershell
cd practica14/tienda-backend
npm ci
Copy-Item .env.ejemplo .env
```

La variable privada de conexión utiliza este formato, sustituyendo las credenciales por las del entorno local:

```dotenv
DATABASE_URL="mysql://root:TU_PASSWORD@localhost:3306/tienda_practica14"
PORT=3000
```

La base utiliza el nombre `tienda_practica14`. Puede crearse desde MySQL con:

```sql
CREATE DATABASE IF NOT EXISTS tienda_practica14
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

La preparación y ejecución de la API se realiza con:

```powershell
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
npm run build
npm run start:prod
```

El seeder del código base elimina los pedidos, sus renglones y los productos de esta base antes de cargar el inventario inicial. Por eso se utiliza en una base de práctica separada; no se necesita ejecutarlo en cada arranque.

### Frontend

En otra terminal, desde la raíz del repositorio:

```powershell
cd practica14/tienda
npm ci
npm run dev -- --port 5173 --strictPort
```

La dirección de la tienda es `http://localhost:5173`. La API utiliza `http://localhost:3000`. El backend admite los orígenes `localhost:5173` y `127.0.0.1:5173`.

El archivo `.env.ejemplo` del frontend documenta `VITE_API_URL`. Si se configura un `.env.local`, Vite requiere reiniciarse para leer el cambio. No se colocan contraseñas ni secretos en variables `VITE_`, ya que forman parte del código que recibe el navegador.

### Verificación

En el frontend:

```powershell
npm run build
npm run lint
npm audit
```

En el backend:

```powershell
npx prisma validate
npx prisma migrate status
npm run build
npm audit
```

Las dependencias, archivos de construcción, cliente generado de Prisma y archivos privados de entorno están excluidos mediante `.gitignore`.

## Resultados de las pruebas

Durante la revisión se confirmó la carga del catálogo desde MySQL, el registro de un pedido con folio y la actualización de la existencia después del pago. También se comprobó que un pedido sin existencia suficiente responde 409 y conserva el carrito, mientras que un teléfono inválido se rechaza antes del envío.

Con la API apagada se mostró el mensaje de conexión y el botón Reintentar. Después de iniciar nuevamente el backend, ese botón recuperó el catálogo. Al quitar temporalmente el arreglo de dependencias se observaron solicitudes repetidas a productos en la pestaña Red; la versión final conserva `[version]`.

El frontend y el backend compilaron correctamente. La revisión de código del frontend terminó sin advertencias y las auditorías de npm no reportaron vulnerabilidades al realizar la verificación.

## Evidencias

| Archivo | Resultado documentado |
|---|---|
| [01. Catálogo y peticiones](evidencias/01-catalogo-api.png) | Productos de la API, sobre de respuesta y consultas del montaje |
| [02. Pedido confirmado](evidencias/02-pedido-confirmado.png) | Folio, carrito vacío y existencia actualizada |
| [03. Existencia insuficiente](evidencias/03-error-existencia-409.png) | Mensaje del servidor y estado 409 en Network |
| [04. API apagada](evidencias/04-api-apagada.png) | Error de conexión y opción de reintento |
| [05. Reintento correcto](evidencias/05-reintento-correcto.png) | Recuperación del catálogo |
| [06. Validación del formulario](evidencias/06-validacion-formulario.png) | Rechazo del teléfono con menos de diez dígitos |
| [07. Verificación del backend](evidencias/07-verificacion-backend.png) | Esquema, migración, compilación y auditoría |
| [08. Verificación del frontend](evidencias/08-verificacion-frontend.png) | Compilación, revisión de código y auditoría |
| [09. Efecto sin dependencias](evidencias/09-efecto-sin-dependencias.png) | Solicitudes repetidas al actualizar el estado |

## Referencias

- [Estilos del catálogo proporcionados en clase](https://gist.github.com/CharlyCastrejon/946b900593d6c2f1ce272af2b915de69).
- Código de la tienda desarrollado en la práctica 13.
- Backend de productos y pedidos proporcionado para la práctica 14.

