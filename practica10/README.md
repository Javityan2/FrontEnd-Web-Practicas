# Práctica 10 — Blindar la API, JWT y OpenAPI

## Objetivo

En esta práctica se trabajó en mejorar la seguridad y el manejo de respuestas de la API. Para ello, se implementó un manejo centralizado de errores, identificadores para las peticiones, registro de tiempos de respuesta, CORS, autenticación mediante JWT y permisos según el rol de cada usuario.

También se agregó la documentación con Swagger y se utilizó MySQL junto con Prisma para almacenar la información de las entidades y las cuentas de usuario.

## Organización del proyecto

- `gimnasio-api/`: contiene el proyecto desarrollado con NestJS y las migraciones de la base de datos.
- `gimnasio-api/peticiones.http`: archivo con las peticiones utilizadas para realizar las pruebas con REST Client.
- `gimnasio-api/.env.ejemplo`: ejemplo de las variables de entorno necesarias para ejecutar el proyecto.
- `evidencias/`: contiene las capturas de las pruebas y el diagrama del funcionamiento de JWT.

## Preguntas de reflexión

### 1. ¿Por qué el filtro atrapa la clase base y no cada error por separado?

Porque todos los errores de dominio se derivan de `ErrorDeDominio`, por lo que podemos manejarlos desde un mismo filtro sin necesidad de crear uno para cada tipo de error.

De esta manera, el filtro identifica qué error ocurrió y le asigna el código HTTP correspondiente. Esto también hace que el código esté mejor organizado y sea más sencillo de mantener.

### 2. ¿Por qué el middleware no debería decidir los permisos de una ruta?

Porque el middleware se ejecuta antes de que los guards validen la identidad del usuario, así que todavía no cuenta con la información necesaria para decidir si tiene permiso de acceder a una ruta.

Para eso están los guards, que pueden verificar el token JWT y consultar los roles permitidos en cada ruta.

En este caso, el middleware se utiliza para identificar las peticiones, mientras que los guards se encargan de revisar la autenticación y los permisos.

### 3. ¿Por qué la petición que responde 409 no aparece en el registro de tiempos?

Esto sucede porque el interceptor utiliza `tap` para registrar los tiempos de las respuestas exitosas.

Cuando ocurre un error, como el conflicto que genera el código 409, el servicio lanza una excepción y esa parte del interceptor ya no se ejecuta.

En su lugar, el filtro de errores se encarga de procesar la excepción y registrar la advertencia correspondiente.

### 4. ¿Por qué agregar el sobre rompe a un cliente que ya consumía la API?

Porque estamos modificando la estructura con la que la API entrega la información.

Por ejemplo, antes podíamos recibir directamente un arreglo y acceder a su primer elemento utilizando `respuesta[0]`. Ahora, al agregar el sobre con `data` y `meta`, tendríamos que utilizar `respuesta.data[0]`.

Aunque la información sea la misma, cualquier aplicación que consuma la API tendría que adaptarse a esta nueva estructura para seguir funcionando correctamente.

### 5. Si el servidor respondió a ambos orígenes, ¿quién bloquea y a quién protege CORS?

La restricción la aplica el navegador, no directamente el servidor.

Cuando una página intenta consultar la API desde un origen que no está autorizado, el navegador impide que su código JavaScript pueda leer la respuesta si no cuenta con el encabezado `Access-Control-Allow-Origin` correspondiente.

Esto ayuda a evitar que otras páginas web puedan consultar y leer información desde un origen no permitido.

Por otro lado, herramientas como curl no aplican estas restricciones, por eso podemos obtener una respuesta 200 en ambos casos.

Es importante mencionar que CORS no reemplaza la autenticación ni los permisos de los usuarios.

### 6. ¿Por qué el campo se llama passwordHash y no password?

Porque lo que almacenamos en la base de datos no es la contraseña original del usuario, sino el hash que se genera utilizando bcrypt.

Cuando alguien intenta iniciar sesión, utilizamos `bcrypt.compare` para verificar si la contraseña ingresada corresponde con el hash almacenado.

Esto permite validar las credenciales sin necesidad de guardar la contraseña en texto plano. Además, el hash tampoco debe incluirse en las respuestas que enviamos al cliente.

### 7. ¿Por qué los dos errores del login dicen lo mismo?

Principalmente por seguridad, ya que no queremos revelar si un correo electrónico está registrado en el sistema.

Si utilizáramos mensajes diferentes para un correo inexistente y una contraseña incorrecta, alguien podría aprovechar esa información para identificar qué cuentas existen.

Por eso, en ambos casos mostramos el mensaje "Credenciales inválidas", evitando proporcionar información adicional sobre los usuarios registrados.

### 8. Si el contenido del JWT puede leerse, ¿qué protege la firma?

La firma permite comprobar que el token es auténtico y que su contenido no fue modificado después de generarse.

El JWT no está cifrado, por lo que su contenido puede consultarse. Sin embargo, eso no significa que podamos modificarlo libremente y seguir utilizándolo.

Si cambiamos algún dato del payload, como el rol de un usuario, la firma original deja de ser válida y el servidor rechaza el token.

Esto lo comprobé durante las pruebas, ya que el token original respondió con un código 200, mientras que la copia con el rol modificado devolvió un 401.

### 9. ¿Por qué es más seguro proteger todo y abrir rutas explícitamente?

Porque de esta manera todas las rutas requieren autenticación por defecto, a menos que nosotros indiquemos lo contrario.

Por ejemplo, si necesitamos una ruta pública, podemos utilizar el decorador `@Publico()`.

Considero que este enfoque es más seguro porque, si agregamos una ruta nueva y olvidamos configurar sus permisos, esta permanecerá protegida.

En cambio, si tuviéramos que agregar la seguridad manualmente en cada ruta, podríamos olvidar hacerlo y dejar algún recurso disponible sin autorización.

### 10. ¿Cuál es la diferencia entre 401 y 403?

Aunque ambos códigos están relacionados con la seguridad, representan situaciones diferentes.

El código **401 Unauthorized** indica que el usuario no cuenta con una autenticación válida. Esto puede pasar cuando no enviamos un token o cuando el token es incorrecto o ya expiró.

Por otro lado, **403 Forbidden** significa que el usuario sí está autenticado, pero no cuenta con los permisos necesarios para realizar determinada acción.

Por ejemplo, un miembro puede iniciar sesión correctamente, pero eso no significa que tenga permiso para cancelar inscripciones o registrar a otros miembros.

### 11. ¿Cuántas líneas de AuthService cambiaron al pasar de memoria a MySQL? ¿Por qué?

No fue necesario modificar ninguna línea de `AuthService`.

Esto se debe a que el servicio trabaja mediante el contrato `UsuarioRepository`, que se inyecta utilizando `USUARIO_REPOSITORY`.

Para cambiar el almacenamiento en memoria por MySQL, se implementó `UsuarioPrismaRepository` y se actualizó el proveedor correspondiente en `AuthModule`.

Como las operaciones para buscar y guardar usuarios mantuvieron el mismo contrato, la lógica del registro y del inicio de sesión pudo seguir funcionando sin modificaciones.

Esto demuestra una de las ventajas de trabajar con interfaces y separar la lógica de negocio del acceso a los datos.

### 12. ¿Por qué tomar la identidad del token y no confiar en la URL o el cuerpo?

Porque los datos que enviamos desde el cliente, ya sea en la URL o en el cuerpo de una petición, pueden modificarse fácilmente.

Por eso, no podemos utilizarlos como prueba de la identidad de una persona.

Por ejemplo, si Karla tiene asignado el `miembroId: 1`, pero modifica una petición para enviar `miembroId: 3`, podría intentar realizar una inscripción a nombre de otro miembro si no existiera una validación.

Lo mismo sucede con una ruta como `GET /miembros/3/inscripciones`, donde necesitamos comprobar que el usuario realmente tiene permiso para consultar esa información.

Para evitarlo, utilizamos los datos del JWT. El claim `sub` identifica la cuenta del usuario, mientras que `miembroId` nos permite conocer al miembro que tiene asociado.

Cuando el usuario tiene el rol de `miembro`, comparamos ese identificador con el que llega en la petición para asegurarnos de que únicamente realice operaciones permitidas.

La ventaja es que estos datos se obtienen después de verificar la firma y la vigencia del token. Aunque alguien modifique su contenido, no podrá generar una firma válida sin conocer el `JWT_SECRET`.

## Permisos de cancelación

Para la ruta `DELETE /inscripciones/:id` se implementó la validación mediante JWT y un guard de roles, con el objetivo de permitir la cancelación únicamente a los usuarios autorizados.

Durante las pruebas obtuve los siguientes resultados:

| Tipo de acceso | Resultado |
|---|---|
| Sin token | 401 Unauthorized |
| Miembro | 403 Forbidden |
| Entrenador | 200, inscripción cancelada |
| Administrador | 200, inscripción cancelada |

Con estas pruebas pude comprobar que la ruta distingue correctamente entre un usuario que no ha iniciado sesión, uno que no tiene permisos y aquellos que sí pueden realizar la operación.

## Verificación de la práctica

Al finalizar la implementación, realicé las siguientes comprobaciones:

- Validé correctamente el esquema de Prisma.
- Apliqué dos migraciones y verifiqué que la base de datos estuviera sincronizada.
- Comprobé que el proyecto compilara sin errores.
- Ejecuté la auditoría de npm, sin que se reportaran vulnerabilidades.
- Probé 17 peticiones utilizando REST Client.
- Verifiqué que el inicio de sesión siguiera funcionando después de reiniciar el servidor.
- Comprobé que el servidor aceptara el JWT original y rechazara uno que había sido modificado.

## Instalación y ejecución

### Requisitos

- Node.js y npm.
- MySQL en ejecución.
- Una cuenta de MySQL con permisos para crear la base y aplicar las migraciones.
- La extensión REST Client de VS Code para ejecutar `peticiones.http`.

### Configuración

Desde la carpeta del repositorio:

```powershell
cd practica10/gimnasio-api
npm ci
Copy-Item .env.ejemplo .env
```

Editar `.env` con las credenciales locales:

```dotenv
DATABASE_URL="mysql://USUARIO:CONTRASENA@localhost:3306/gimnasio_practica10"
JWT_SECRET="REEMPLAZAR_CON_UN_SECRETO_ALEATORIO_DE_AL_MENOS_32_CARACTERES"
```

El archivo `.env` es privado y no se incluye en el repositorio.
`.env.ejemplo` contiene únicamente valores de referencia.

Aplicar las migraciones y generar el cliente:

```powershell
npx prisma migrate deploy
npx prisma generate
npx prisma db seed
npm run build
npm run start:dev
```

Las migraciones crean las tablas. El comando `npx prisma db seed`
prepara la clase Yoga, el horario 1, el miembro Karla y las cuentas
de prueba de miembro, entrenador y administrador.

El script conserva los registros existentes y no crea inscripciones.
En una base nueva, las cuentas utilizan la contraseña de prueba
`gimnasio2026`. Si una cuenta ya existe, conserva su contraseña.

### Direcciones

- API: `http://localhost:3000`
- Documentación Swagger: `http://localhost:3000/docs`

### Cuentas de prueba

Las siguientes cuentas se prepararon en la base de desarrollo:

| Correo | Contraseña de prueba | Rol | Miembro asociado |
|---|---|---|---|
| karla@itson.mx | gimnasio2026 | miembro | Karla Duarte |
| ana@itson.mx | gimnasio2026 | entrenador | Ninguno |
| admin@itson.mx | gimnasio2026 | admin | Ninguno |

El registro público asigna el rol `miembro`. Los roles de entrenador
y administrador se configuraron directamente en la base de desarrollo.

Después de modificar un rol o la asociación con un miembro, es
necesario iniciar sesión nuevamente para obtener un token actualizado.

### Pruebas con REST Client

Abrir `gimnasio-api/peticiones.http` y ejecutar los bloques en orden
mediante **Send Request**.

Los bloques de login guardan sus respuestas para que las siguientes
peticiones reutilicen el token automáticamente. Si vence, ejecutar
nuevamente el login correspondiente.

Las pruebas de inscripción requieren los miembros y horarios
indicados en el archivo. Los identificadores deben coincidir con
los registros de la base utilizada.

## Evidencias

| Archivo | Comprobación |
|---|---|
| [01](evidencias/01-catalogo-publico.png) | Catálogo público y respuesta con sobre |
| [02](evidencias/02-inscripciones-sin-token-401.png) | Ruta protegida sin token: 401 |
| [03](evidencias/03-identificador-peticion.png) | Identificador de petición |
| [04](evidencias/04-registro-http.png) | Registro de tiempos en consola |
| [05](evidencias/05-login-200.png) | Inicio de sesión correcto |
| [06](evidencias/06-usuario-autenticado.png) | Identidad obtenida del JWT |
| [07](evidencias/07-inscripcion-ajena-403.png) | Inscripción ajena rechazada: 403 |
| [08](evidencias/08-error-dominio-409.png) | Error de dominio: 409 |
| [09](evidencias/09-registro-error-dominio.png) | Advertencia del filtro |
| [10](evidencias/10-cors-permitido.png) | Origen permitido por CORS |
| [11](evidencias/11-cors-no-permitido.png) | Origen sin autorización CORS |
| [12](evidencias/12-swagger-no-autorizado.png) | Swagger sin token |
| [13](evidencias/13-swagger-autorizado.png) | Swagger con token |
| [14](evidencias/14-migracion-usuarios.png) | Migración de usuarios |
| [15](evidencias/15-registro-usuario-mysql.png) | Registro de una cuenta |
| [16](evidencias/16-login-tras-reinicio.png) | Persistencia después del reinicio |
| [17](evidencias/17-usuarios-mysql.png) | Cuentas y roles en MySQL |
| [18](evidencias/18-cancelacion-miembro-403.png) | Miembro sin permiso para cancelar |
| [19](evidencias/19-cancelacion-entrenador-200.png) | Cancelación como entrenador |
| [20](evidencias/20-cancelacion-admin-200.png) | Cancelación como administrador |
| [21](evidencias/21-identificador-invalido-400.png) | Identificador inválido: 400 |
| [22](evidencias/22-token-alterado-401.png) | JWT alterado rechazado |
| [23](evidencias/23-flujo-jwt.png) | Diagrama del flujo JWT |
| [24](evidencias/24-verificacion-final.png) | Validación, migraciones, compilación y auditoría |
| [25](evidencias/25-datos-iniciales.png) | Ejecución repetida del seed y compilación |