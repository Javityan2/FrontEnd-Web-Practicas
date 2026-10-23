import { cargarCatalogo } from './catalogo.js';
import { pedirTexto, pedirOpcion } from './entrada.js';
import {
  disponiblesDe,
  prestar,
  estadoDe,
  multaDe,
  type Mostrador,
} from './dominio/prestamos.js';
import {
  LibroNoEncontradoError,
  SinEjemplaresError,
} from './dominio/tipos.js';

const OPCIONES = [
  { valor: 'prestar', etiqueta: 'Prestar libro' },
  { valor: 'catalogo', etiqueta: 'Ver catálogo' },
  { valor: 'prestamos', etiqueta: 'Ver préstamos' },
  { valor: 'salir', etiqueta: 'Salir' },
] as const;

type Opcion = (typeof OPCIONES)[number]['valor'];

function esOpcion(valor: string): valor is Opcion {
  return OPCIONES.some((o) => o.valor === valor);
}

const fecha = (d: Date) => d.toISOString().slice(0, 10);

function verCatalogo(m: Mostrador): void {
  console.log('\n Catálogo de libros:');

  for (const l of m.libros) {
    const anio = l.anio === undefined ? ' s/f' : ` (${l.anio})`;
    console.log(
      `- ${l.id} ${l.titulo}${anio} de ${l.autor} [${disponiblesDe(m, l)}/${l.ejemplares}]`,
    );
  }

  console.log('');
}

function verPrestamos(m: Mostrador, hoy: Date): void {
  if (m.prestamos.length === 0) {
    console.log('\n No hay préstamos registrados\n');
    return;
  }

  console.log('\n Préstamos:');

  for (const p of m.prestamos) {
    const estado = estadoDe(p, hoy);
    const multa = multaDe(p, estado, hoy);
    console.log(
      `- ${p.folio} ${p.socio} vence: ${fecha(p.venceEn)} estado: ${estado} multa: $${multa}`,
    );
  }
  console.log('');
}

async function hacerPrestamo(m: Mostrador, hoy: Date): Promise<void> {
  const libroId = await pedirTexto('ID del libro a prestar:');

  if (libroId === undefined) {
    console.log('No se proporcionó un ID de libro. Operación cancelada.');
    return;
  }

  const socio = await pedirTexto('Nombre del socio:');

  if (socio === undefined) {
    console.log('No se proporcionó un nombre de socio. Operación cancelada.');
    return;
  }

  try {
    const p = prestar(m, libroId.toUpperCase(), socio, hoy);
    console.log(
      `\n Préstamo realizado con éxito. Folio: ${p.folio}, vence: ${fecha(p.venceEn)}\n`,
    );
  } catch (error: unknown) {
    if (
      error instanceof LibroNoEncontradoError ||
      error instanceof SinEjemplaresError
    ) {
      console.log(`\n  No se pudo: ${error.message}\n`);
      return;
    }
    throw error;
  }
}

async function main(): Promise<void> {
  const { libros, descartados } = cargarCatalogo('datos/catalogo.json');

  console.log('\n ---- MOSTRADOR DE LIBROS ----');
  console.log(
    `\n Se cargaron ${libros.length} libros del catálogo. Se descartaron ${descartados} entradas inválidas.`,
  );

  const hoy = new Date();
  const m: Mostrador = { libros, prestamos: [] };

  for (;;) {
    const elegido = await pedirOpcion('Seleccione una opción:', OPCIONES);

    if (elegido === undefined || !esOpcion(elegido)) {
      console.log('No se seleccionó ninguna opción. Saliendo...');
      return;
    }

    switch (elegido) {
      case 'prestar':
        await hacerPrestamo(m, hoy);
        break;
      case 'catalogo':
        verCatalogo(m);
        break;
      case 'prestamos':
        verPrestamos(m, hoy);
        break;
      case 'salir':
        console.log('Saliendo...');
        return;
      default: {
        const _exhaustiveCheck: never = elegido;
        throw new Error(`Opción no manejada: ${_exhaustiveCheck}`);
      }
    }
  }
}

void main();
