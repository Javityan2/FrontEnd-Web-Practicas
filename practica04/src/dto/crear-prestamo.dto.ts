//  Un DTO (Data Transfer Object) es el CONTRATO con el exterior:
//  describe exactamente que puede mandar quien nos llama.
//
//  Lo que el cliente NO debe poder mandar:
//    - folio           -> lo genera el sistema
//    - creadoEn        -> lo pone el sistema
//    - estado          -> siempre nace en 'activo'
//    - costoReposicion -> es un dato interno de la biblioteca
//
//  TODO: declarar el tipo usando el utility type `Omit`, en lugar de
//  volver a escribir a mano los campos que si se aceptan.
//
//    export type CrearPrestamoDto = Omit<Prestamo, ...aqui las llaves...>;

import type { Prestamo } from '../dominio/prestamo.entity.js';

export type CrearPrestamoDto = Omit<
  Prestamo,
  'folio' | 'creadoEn' | 'estado' | 'costoReposicion'
>;
