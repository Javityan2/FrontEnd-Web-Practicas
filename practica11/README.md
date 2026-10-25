# Práctica 11 — Componentes con TypeScript puro

## Objetivo

En esta práctica se desarrolló un catálogo de productos deportivos utilizando TypeScript y Web Components, sin utilizar un framework. Para ello, se implementó un botón reutilizable y una tarjeta de producto con su propio contenido y estilos dentro del Shadow DOM.

También se trabajó con atributos, slots y eventos personalizados para comunicar los componentes con el resto de la página. El catálogo permite agregar productos a un contador y vaciarlo desde el encabezado.

## Organización del proyecto

- `catalogo/`: contiene el proyecto creado con Vite y la plantilla `vanilla-ts`.
- `catalogo/src/boton-app.ts`: componente del botón y manejo de sus atributos.
- `catalogo/src/tarjeta-producto.ts`: componente de la tarjeta y evento para agregar productos.
- `catalogo/src/tipos.ts`: interfaces de los productos y de los datos enviados en el evento.
- `catalogo/src/datos.ts`: información de los doce productos del catálogo.
- `catalogo/src/main.ts`: creación de las tarjetas y manejo del contador.
- `catalogo/public/img/`: imágenes utilizadas por los productos.
- `evidencias/`: capturas del funcionamiento y de la verificación del proyecto.

## Funcionamiento

### Botón reutilizable

El componente `boton-app` recibe su variante mediante un atributo y muestra el texto de su interior utilizando un `slot`. Se utiliza tanto en el encabezado, para vaciar el carrito, como dentro de cada tarjeta, para agregar productos.

Las variantes disponibles son `primario`, `secundario` y `peligro`. También se admite `danger` como equivalente de `peligro`. Para deshabilitar el botón se puede utilizar `deshabilitado` o `disabled`.

### Tarjetas de producto

Cada tarjeta recibe el identificador, nombre, precio, imagen y existencia mediante atributos. Como estos valores llegan en forma de texto, el precio y la existencia se convierten a número antes de utilizarlos.

Cuando la existencia es cero, la tarjeta muestra el texto **Agotado** en rojo y deshabilita el botón. Este comportamiento se puede observar en la licra de compresión y la chamarra rompeviento.

### Contador del carrito

Al agregar un producto, la tarjeta emite el evento `agregar` con su identificador, nombre y precio. El contenedor del catálogo escucha ese evento mediante un solo listener y actualiza el contador del encabezado.

El botón **Vaciar** regresa el contador a cero. El estado se mantiene en memoria, por lo que también se restablece al recargar la página. En esta práctica el contador representa las veces que se agrega un producto; no se descuenta la existencia del catálogo.

## Preguntas de reflexión

### 1. ¿Qué pasa al cambiar la variante del botón sin modificar TypeScript?

El aspecto del botón cambia porque el atributo `variante` está incluido en `observedAttributes`. Cuando lo modificamos, el navegador ejecuta `attributeChangedCallback` y se actualiza la clase del botón interno.

De esta manera, podemos pasar del botón con borde azul a uno con fondo rojo cambiando únicamente el atributo en el HTML. Al agregar el atributo de deshabilitado, el botón se muestra gris y deja de aceptar clics.

### 2. ¿Por qué el nombre de una etiqueta propia debe llevar guion?

Porque es un requisito para registrar un Custom Element. El guion permite distinguir nuestros componentes de las etiquetas que ya forman parte de HTML y evita conflictos con nombres que puedan agregarse al estándar en el futuro.

Por eso se utilizaron los nombres `boton-app` y `tarjeta-producto`.

### 3. ¿Cómo se utiliza el ciclo de vida de los componentes?

En el `constructor` se crea el Shadow DOM y se prepara el contenido interno. Después, `connectedCallback` permite actualizar el componente cuando entra al documento.

Por otro lado, `attributeChangedCallback` se ejecuta cuando cambia uno de los atributos observados. Esto permite que el componente refleje los nuevos valores sin tener que crearlo nuevamente desde fuera.

También existen `disconnectedCallback` y `adoptedCallback`. El primero permite liberar recursos cuando el elemento sale del documento y el segundo se ejecuta si se traslada a otro documento. En estos componentes no fue necesario implementarlos, ya que no se mantienen temporizadores ni suscripciones externas que requieran limpieza.

### 4. ¿Por qué se convierten a número el precio y la existencia?

Porque los atributos del HTML se reciben como texto, aunque contengan un valor numérico. Utilizamos `Number` para trabajar con esos datos como números y poder comparar correctamente la existencia con cero o aplicar el formato de moneda al precio.

Esto evita confundir una operación numérica con una operación sobre cadenas de texto.

### 5. ¿Qué ocurre si el evento no puede salir del Shadow DOM?

El contenedor del catálogo deja de recibirlo y el contador no aumenta. Esto no genera un error en consola, porque el evento sí se emite, pero su recorrido queda limitado al árbol de sombra.

Para permitir que llegue al contenedor se utilizan `bubbles: true` y `composed: true`. El primero permite que el evento suba por el árbol y el segundo permite que cruce el límite del Shadow DOM.

En esta implementación, el evento se emite desde el botón ubicado dentro de la sombra de la tarjeta. Durante la prueba con `composed: false`, el contador permaneció en cero. La versión final conserva `composed: true`.

### 6. ¿Qué aporta la encapsulación en esta práctica?

Permite utilizar los componentes mediante sus atributos, contenido y eventos, sin depender de cómo están organizados internamente.

Por ejemplo, la página puede recibir el aviso de que se agregó un producto sin tener que modificar el botón que está dentro de la tarjeta. Además, los selectores CSS de la página no seleccionan directamente los elementos del Shadow DOM, aunque pueden heredarse propiedades y variables CSS.

Se utiliza `mode: 'open'` para poder inspeccionar la estructura desde las herramientas del navegador. Esto facilita revisar el componente, pero no representa una barrera de seguridad.

## Instalación y ejecución

El proyecto utiliza Node.js y npm. Los comandos de ejecución, desde la raíz del repositorio, son los siguientes:

```powershell
cd practica11/catalogo
npm ci
npm run dev
```

El servidor de desarrollo muestra la dirección disponible en la terminal. El puerto habitual es `http://localhost:5173`.

La compilación y la revisión de dependencias se realizan con:

```powershell
npm run build
npm audit
```

`npm run build` comprueba los tipos de TypeScript y genera la versión de producción en `dist/`. Las carpetas `node_modules/` y `dist/` están excluidas del repositorio.

## Verificación de la práctica

Durante las pruebas se comprobaron los siguientes resultados:

- El catálogo muestra las doce tarjetas con sus imágenes.
- Los dos productos sin existencia muestran **Agotado** y su botón queda deshabilitado.
- Las variantes del botón cambian al modificar sus atributos.
- Agregar tres productos actualiza el contador de cero a tres.
- La consola muestra el nombre y el precio del producto agregado.
- El botón **Vaciar** restablece el contador a cero.
- Al desactivar `composed`, el evento no llega al contenedor y el contador no aumenta.
- El proyecto compila sin errores.
- La auditoría de npm no reportó vulnerabilidades al realizar la verificación.

## Evidencias

| Archivo | Resultado documentado |
|---|---|
| [01. Botón secundario](evidencias/01-boton-secundario.png) | Variante con borde azul en el encabezado |
| [02. Botón de peligro](evidencias/02-boton-peligro.png) | Variante roja mediante el atributo |
| [03. Botón deshabilitado](evidencias/03-boton-deshabilitado.png) | Estado deshabilitado del botón |
| [04. Catálogo](evidencias/04-catalogo-agotados.png) | Doce productos y tarjetas agotadas |
| [05. Productos agregados](evidencias/05-carrito-con-productos.png) | Contador con tres productos |
| [06. Carrito vacío](evidencias/06-carrito-vacio.png) | Contador después de vaciar el carrito |
| [07. Evento sin composed](evidencias/07-evento-sin-composed.png) | Contador sin cambios cuando el evento no cruza la sombra |
| [08. Verificación final](evidencias/08-verificacion-final.png) | Compilación y auditoría de dependencias |

## Referencias

Para el catálogo se utilizaron el HTML, los estilos, las imágenes, los tipos y los productos del código base proporcionado en clase. Los componentes toman como referencia los ejemplos de la práctica:

- [Botón reutilizable](https://gist.github.com/CharlyCastrejon/ab9b5953a14cefacb864f4bd0ef22be1)
- [Tarjeta de producto](https://gist.github.com/CharlyCastrejon/4ee2d178b960c125cc92c037192958be)
- [Montaje del catálogo y eventos](https://gist.github.com/CharlyCastrejon/e87d38a51f6403af0bb4d7361c1c145a)
