# Práctica 20 — Signals, servicios y filtro del catálogo

En esta práctica moví el estado del tablero a un servicio compartido. El catálogo usa Angular 22, componentes standalone y datos locales. El filtro cambia las clases visibles y el resumen, mientras que la selección de una tarjeta muestra su detalle en el panel lateral.

## Ejecución

El proyecto está en [gimnasio-admin](gimnasio-admin/).

```powershell
cd gimnasio-admin
npm ci
npm start
```

La aplicación se sirve en `http://localhost:4200/`. La compilación de producción se genera con `npm run build`.

## Estado compartido

`Catalogo` está registrado con `@Service()`. Tanto el componente raíz como el filtro obtienen la misma instancia mediante `inject(Catalogo)`. El servicio guarda las clases, la categoría y la selección con signals.

`visibles` deriva la lista filtrada y `minutosTotales` suma su duración mediante `computed()`. El catálogo completo tiene 8 clases y 380 minutos. Al elegir Cardio aparecen 4 clases que suman 175 minutos.

La tarjeta recibe su clase y su estado activo con `input()`. Al pulsarla emite la clase con `output<Clase>()`; el padre recibe `$event` y pide al servicio actualizar la selección. Al pulsar la misma tarjeta otra vez, se deselecciona. Si un filtro deja fuera la clase elegida, el servicio limpia la selección.

## ¿Qué diferencia hay entre un signal y un computed?

Un `signal` guarda un valor que puede cambiar con `.set()` o `.update()`. Al leerlo se usan paréntesis, por ejemplo `categoria()`. Se parece a `useState` porque representa estado modificable y permite actualizar la interfaz cuando cambia.

Un `computed` deriva un valor a partir de los signals que lee. Conserva el resultado y vuelve a calcularlo cuando cambian sus dependencias y se necesita el valor. Se parece a `useMemo` porque memoriza un cálculo, y Angular registra sus dependencias automáticamente. Así, el total de minutos se obtiene de las clases visibles.

## ¿Qué pasa si el filtro usa new Catalogo()?

`new Catalogo()` crea otra instancia con sus propios signals. El filtro modificaría esa instancia y el tablero seguiría leyendo la que recibió por inyección. Los botones podrían cambiar su apariencia mientras la lista y el resumen conservarían el filtro anterior.

Con `inject(Catalogo)`, el filtro y el tablero comparten el mismo estado a través del inyector de Angular.

## Aviso NG8109

NG8109 indica que se está interpolando una señal sin invocarla. Por ejemplo, `{{ catalogo.minutosTotales }}` deja la función en la plantilla. La expresión `{{ catalogo.minutosTotales() }}` lee el valor calculado.

## Verificación

La compilación de producción terminó correctamente y la instalación reportó cero vulnerabilidades. Comprobé la instancia compartida del servicio, los totales de las categorías, la selección y deselección de tarjetas, y la limpieza del detalle al cambiar a una categoría incompatible. También reproduje NG8109 con una variante temporal de la plantilla.

## Evidencias

- [Filtro Cardio](evidencias/01-filtro-cardio.png). El resumen muestra 4 clases y 175 minutos.
- [Clase seleccionada](evidencias/02-clase-seleccionada.png). Ciclismo indoor aparece marcada y el panel lateral muestra su descripción, categoría y duración.
- [Aviso NG8109](evidencias/03-aviso-ng8109.png). La interpolación de `minutosTotales` sin paréntesis provoca el diagnóstico. El código de entrega usa `minutosTotales()`.
