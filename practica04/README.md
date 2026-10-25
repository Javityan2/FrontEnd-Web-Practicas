# Práctica 04 — De la capa de dominio a una API HTTP

## Objetivo

Exponer el sistema de préstamos de la práctica 03 mediante una API HTTP con Express, conservando sin modificaciones las carpetas `dominio`, `infra` y `servicios`.

## Entorno

La guía solicita Node.js 24 LTS. Esta implementación se ejecutó y verificó con Node.js 26.8.1.

Los préstamos se guardan en memoria y se pierden al reiniciar el servidor.

## Instalación y ejecución

Desde la carpeta `practica04`:

```powershell
npm install
npm run dev
```

El comando `dev` inicia la API con `tsx`. También se puede ejecutar `npm run servidor` para compilar e iniciar, o `npm run build` seguido de `npm start`.

Abrir el cliente:

```text
http://localhost:3000
```

Consultar los préstamos de un libro:

```text
http://localhost:3000/api/prestamos?libroId=LIB-0417
```

## Verificaciones

```powershell
npm run typecheck
npm test
npm run build
npm audit
```

Resultados obtenidos:

- Revisión de tipos sin errores.
- Tres pruebas del servicio aprobadas.
- Compilación sin errores.
- Auditoría con cero vulnerabilidades.

También se compararon las carpetas `dominio`, `infra` y `servicios` con las de la práctica 03, sin encontrar diferencias de contenido.

## Contrato público

El contrato incluye:

- `CrearPrestamoRequestDto`: datos enviados por el cliente.
- `PrestamoResponseDto`: datos públicos del préstamo.
- `ErrorResponseDto`: estructura de los errores.

La respuesta convierte `creadoEn` a texto ISO y deja fuera el campo interno `costoReposicion`.

Los tipos de TypeScript no validan por sí solos los datos recibidos durante la ejecución. Por eso el servidor revisa el cuerpo de la petición mediante una función que recibe `unknown`.

## Rutas y respuestas

| Método y ruta | Caso | Respuesta |
|---|---|---|
| GET `/api/prestamos?libroId=LIB-0417` | Consulta válida | 200 |
| GET `/api/prestamos` | Falta `libroId` | 400 |
| GET `/api/prestamos?libroId=` | Parámetro vacío | 400 |
| POST `/api/prestamos` | Préstamo válido | 201 |
| POST `/api/prestamos` | Ejemplar ocupado | 409 |
| POST `/api/prestamos` | Datos inválidos | 400 |

Al crear un préstamo, la respuesta incluye la cabecera `Location` con la ruta asignada al recurso, por ejemplo:

```text
Location: /api/prestamos/P-101
```

## Validación y errores

La validación comprueba que:

- `libroId` sea un texto no vacío.
- `socioId` sea un texto no vacío.
- `ejemplares` sea un arreglo no vacío con números enteros positivos.

Los errores de los campos se reúnen antes de rechazar la petición.

El middleware de errores tiene cuatro parámetros y traduce:

- `ValidacionError` a HTTP 400.
- `EjemplarPrestadoError` a HTTP 409.
- Otros errores no controlados a HTTP 500, con un mensaje general.

## Comprobaciones realizadas

### Préstamo válido: 201

Se registró un préstamo del libro `LIB-0417` para el socio `S-001`, con los ejemplares 14 y 15.

El servidor respondió 201 y devolvió el folio `P-101`, la cabecera `Location` y el DTO sin `costoReposicion`.

### Ejemplar ocupado: 409

Se intentó registrar otro préstamo del mismo libro para `S-002`, con los ejemplares 15 y 16.

El servidor respondió 409 porque el ejemplar 15 ya estaba prestado. La solicitud no agregó otro préstamo.

### Datos inválidos: 400

La petición con `libroId` vacío, sin `socioId` y con `ejemplares: "muchos"` respondió 400 con los tres errores reunidos en `detalles`.

## Peticiones de prueba

El archivo `peticiones.http` contiene los siete casos proporcionados por el profesor. Con el servidor iniciado mediante `npm run dev`, abrir el archivo con REST Client y ejecutar los bloques en orden.

| Caso | Resultado esperado |
|---|---|
| Consulta inicial del libro | 200 y un arreglo vacío |
| Creación del préstamo | 201 y cabecera Location |
| Ejemplar repetido | 409 |
| JSON que no cumple el contrato | 400 con detalles |
| Falta libroId | 400 |
| Ruta inexistente | 404 |
| Página del cliente | 200 y contenido HTML |

Reiniciar el servidor antes de repetir la secuencia completa para vaciar el repositorio en memoria.

## Preguntas de reflexión

### 1. Si Express no enviara automáticamente los rechazos de un handler async al middleware de errores, ¿qué habría que agregar en cada ruta?

Habría que capturar los errores con `try/catch` y enviarlos al middleware con `next(error)`, o utilizar una función envolvente que haga ese trabajo.

Así el error llegaría al manejador central, donde se decide la respuesta HTTP.

### 2. ¿Por qué el servicio no lanza directamente un 409 en lugar de EjemplarPrestadoError?

Porque el servicio contiene las reglas del negocio y no debe saber nada de la web, HTTP o REST.

`EjemplarPrestadoError` expresa que un ejemplar ya está ocupado. La capa HTTP decide representar ese problema con el código 409. Esto permite reutilizar el servicio desde otros contextos sin cambiar su lógica.

### 3. Si una app móvil también consumiera esta API, ¿qué archivos habría que tocar?

Si la app móvil utiliza las mismas operaciones y contratos, no sería necesario modificar el servicio, el repositorio ni las rutas.

Solo se tendría que desarrollar el cliente móvil para enviar las peticiones y procesar las respuestas. Para acceder desde otro dispositivo también sería necesario configurar la dirección y la disponibilidad del servidor.

## Evidencias

### Creación y cabecera Location
![Respuesta 201 y Location](evidencias/01-prestamo-201.png)

### Conflicto de ejemplar
![Respuesta 409](evidencias/02-prestamo-409.png)

### Validación del servidor
![Respuesta 400](evidencias/03-validacion-400.png)

### Errores reunidos
![Respuesta con tres errores de validación](evidencias/04-validacion-multiple.png)

### Verificación final
![Tipos, pruebas, compilación y auditoría](evidencias/05-verificacion-final.png)

### Ruta inexistente
![404 para una ruta no registrada](evidencias/06-ruta-inexistente-404.png)