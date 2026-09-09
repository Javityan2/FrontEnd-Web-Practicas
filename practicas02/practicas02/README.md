# Práctica 02 — Mostrador de biblioteca (TypeScript)

Programa de consola que atiende el mostrador de una biblioteca: presta libros, muestra el catálogo con ejemplares disponibles y calcula la multa de un préstamo vencido.

El criterio de terminado **no** es que el programa corra: es que `npm run revisar` quede en silencio.

## Cómo ejecutar

```bash
npm install
npm run revisar    # verificación de tipos (tsc --noEmit)
npm run correr     # transpila y abre el menú
npm run construir  # transpila a dist/
npm run iniciar    # ejecuta el JS ya generado
```

## Estructura

```
practicas02/
├── datos/catalogo.json      # catálogo (incluye 2 registros mal formados)
├── evidencias/              # capturas pedidas por la rúbrica
├── src/
│   ├── main.ts              # menú y orquestación
│   ├── catalogo.ts          # aduana del archivo (unknown + type guard)
│   ├── entrada.ts           # envoltura de prompts con tipos honestos
│   └── dominio/
│       ├── tipos.ts         # Libro, Prestamo, EstadoPrestamo, errores
│       └── prestamos.ts     # reglas: disponibles, prestar, estado, multa
├── package.json
├── tsconfig.json            # strict: true
└── .gitignore               # node_modules/ y dist/
```

## Registros mal formados del catálogo

| Registro | Problema |
|----------|----------|
| `L-010` | `ejemplares` es el texto `"dos"` (debe ser `number`) |
| id `11` | el `id` es número, no `string` |

Ambos se descartan al cargar; el programa reporta cuántos se rechazaron.

---

## Preguntas de la práctica

### 1. ¿Por qué una unión de valores y no una enumeración?

Porque una **unión de literales** (`'activo' | 'devuelto' | 'vencido'`) existe solo en el sistema de tipos: no genera código en el `.js`, no crea un objeto en tiempo de ejecución y obliga a escribir exactamente esos textos. Un `enum` sí se emite a JavaScript (salvo `const enum`), admite comparación más laxa y puede usarse de formas que no queremos (por ejemplo valores numéricos). Con la unión, un estado en mayúsculas como `'ACTIVO'` **no compila**; con `readonly` en `id`/`folio` pasa lo mismo: el modificador se borra al transpilar y **no llega al `.js`**.

### 2. ¿Qué se gana con el tipo desconocido (`unknown`) en lugar del que acepta todo (`any`)?

Con `any`, leer una propiedad que no existe **sí pasa** la revisión de tipos: el compilador deja de protegerte. Con `unknown`, el resultado de `JSON.parse` (u otra entrada externa) no se puede usar hasta estrecharlo (por primitivo, por propiedad o descartando `null`). Eso convierte la “aduana” del archivo en una obligación del compilador, no en un acto de fe.

### 3. ¿Por qué la fecha entra como parámetro?

Para que las reglas (`prestar`, `estadoDe`, `diasDeRetraso`, `multaDe`) sean **deterministas y comprobables**. Si leyeran `new Date()` por dentro, un préstamo “vencido” dependería del reloj real y no se podría fijar “hoy” en una prueba. Al recibir `hoy` desde fuera, se puede simular cualquier día sin tocar el dominio.

---

## Notas de comprobaciones hechas en la práctica

- **Sólo lectura:** tras `npm run construir`, en `dist/dominio/tipos.js` no aparece `readonly` ni las interfaces; solo las clases de error.
- **Estado nuevo sin tocar `prestamos.ts`:** al agregar `'extraviado'` a la unión, el `default` con `never` falla (`Type '"extraviado"' is not assignable to type 'never'`). Evidencia: `evidencias/04_error_estado_nuevo_never.txt`.
- **Transpilar ≠ verificar:** si `MULTA_POR_DIA` pasa a texto, `revisar` falla, pero el programa aún puede ejecutarse sin chequear tipos. Apagar `strict` elimina errores de `any` implícito y de `null`; al reencenderlo vuelven. Evidencias `05`–`07`.

## Evidencias

| Archivo | Contenido |
|---------|-----------|
| `01_registros_descartados.txt` | Aviso de registros inválidos |
| `02_prestamo.txt` | Préstamo exitoso |
| `03_sin_ejemplares.txt` | Rechazo por falta de ejemplares |
| `04_error_estado_nuevo_never.txt` | Error del `never` al ampliar la unión |
| `05_paso6_revisar_falla.txt` | `tsc` con constante numérica cambiada a texto |
| `06_paso6_programa_corre.txt` | El programa igual se ejecuta |
| `07_paso6_strict_apagado.txt` | Errores que se van al apagar `strict` |
