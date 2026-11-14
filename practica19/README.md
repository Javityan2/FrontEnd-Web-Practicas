# Práctica 19 — El tablero del gimnasio en Angular

En esta práctica desarrollé un panel de administración con Angular 22, componentes standalone y las ocho clases del catálogo local. El tablero muestra la cantidad de clases, la suma de su duración y cuántas duran al menos una hora. Con el catálogo completo, los valores son **8 clases, 380 minutos y 2 clases largas**. Los botones **Vaciar** y **Restaurar** actualizan el resumen y las tarjetas. La cuadrícula se adapta al ancho disponible y muestra hasta cuatro columnas.

## Ejecución

El proyecto está en [gimnasio-admin](gimnasio-admin/) y se ejecuta localmente en el puerto 4200.

```powershell
cd gimnasio-admin
npm ci
npx ng serve
```

La compilación de producción se genera con `npm run build`.

## ¿Qué archivos equivalen a main.tsx, App.tsx y vite.config.ts?

- **`src/main.ts`** arranca la aplicación con `bootstrapApplication(App, appConfig)`, como el punto de entrada `main.tsx` de React.
- **`src/app/app.ts`** define el componente raíz, como `App.tsx`. Su plantilla está en `app.html`. El decorador `@Component` enlaza la clase con el HTML y declara los componentes usados en él.
- **`angular.json`** define cómo el CLI compila y sirve el proyecto. Cumple un papel similar al de `vite.config.ts` y señala, entre otras cosas, la entrada `src/main.ts`, los estilos globales en `src/styles.css` y los archivos estáticos de `public/`.

## ¿Por qué clase() lleva paréntesis y para qué sirve track?

En la tarjeta, `input.required<Clase>()` declara una entrada obligatoria y devuelve una señal. La plantilla llama a `clase()` para leer su valor actual. Por ejemplo, `[src]="clase().imagen"` enlaza la imagen y `{{ clase().nombre }}` muestra el nombre. En el padre, `[clase]="clase"` pasa el objeto de la iteración a la tarjeta.

`@for (clase of clases; track clase.id)` identifica cada tarjeta por un ID estable. Angular puede conservar los elementos que siguen representando la misma clase cuando cambia la lista. `@empty` muestra el mensaje si no hay clases. En la tarjeta, `@if` muestra **Larga** cuando la duración es de 60 minutos o más.

## Diagnósticos de Angular

- **NG5002** aparece al quitar `track clase.id` de `@for`, porque el bloque necesita una expresión para identificar cada elemento.
- **NG8001** aparece al quitar `TarjetaClase` de `@Component.imports` en el padre, porque Angular deja de reconocer `<app-tarjeta-clase>` en ese template.

Reproduje ambos diagnósticos con cambios temporales. El código de entrega incluye `track clase.id` y registra `TarjetaClase` en los imports del componente raíz.

## Evidencias

- [Tablero completo](evidencias/01-tablero-completo.png). El resumen muestra 8 clases, 380 minutos y 2 clases largas.
- [Tablero vacío](evidencias/02-tablero-vacio.png). Los tres contadores quedan en cero y aparece el mensaje del catálogo vacío.
- [NG5002 al quitar `track`](evidencias/03-error-ng5002.png).
- [NG8001 al quitar `TarjetaClase` de los imports del componente raíz](evidencias/04-error-ng8001.png).
