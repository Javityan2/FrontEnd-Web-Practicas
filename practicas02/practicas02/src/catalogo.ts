import { readFileSync } from 'node:fs';
import type { Libro } from './dominio/tipos.js';

/**
 * Type guard: comprueba en tiempo de ejecución si un valor cualquiera
 * tiene la forma de un libro.
 *
 * Estrechamiento en tres formas:
 * 1. Por primitivo (`typeof ... === 'string' | 'number'`)
 * 2. Por propiedad (`'anio' in o`)
 * 3. Descartando el nulo (`valor === null`)
 *
 * Anotar `JSON.parse` como `unknown` (y no `any`) obliga a revisar
 * antes de usar el valor: con `any`, leer una propiedad que no existe
 * SÍ pasa la revisión de tipos.
 */
function esLibro(valor: unknown): valor is Libro {
  // 3) descartar nulo + no-objeto
  if (typeof valor !== 'object' || valor === null) {
    return false;
  }

  const o = valor as Record<string, unknown>;

  // 1) por primitivo
  if (typeof o.id !== 'string') return false;
  if (typeof o.titulo !== 'string') return false;
  if (typeof o.autor !== 'string') return false;
  if (typeof o.ejemplares !== 'number') return false;

  // 2) por propiedad (anio es opcional, pero si viene debe ser number)
  if ('anio' in o && o.anio !== undefined && typeof o.anio !== 'number') {
    return false;
  }

  return true;
}

export interface CatalogoCargado {
  libros: Libro[];
  descartados: number;
}

export function cargarCatalogo(ruta: string): CatalogoCargado {
  const texto = readFileSync(ruta, 'utf8');

  // unknown: el compilador obliga a validar antes de tratarlo como Libro[]
  const crudo: unknown = JSON.parse(texto);

  if (typeof crudo !== 'object' || crudo === null) {
    throw new Error('El catálogo debe ser un objeto JSON');
  }

  const posibles = (crudo as Record<string, unknown>).libros;

  if (!Array.isArray(posibles)) {
    throw new Error('El catálogo debe contener un arreglo de libros');
  }

  const libros = posibles.filter(esLibro);

  return { libros, descartados: posibles.length - libros.length };
}
