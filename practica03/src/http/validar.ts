import { CrearPrestamoRequestDto } from "../contratos/prestamo.dto.js";
import { ValidacionError } from "./errores-http.js";

export function validarCrearPrestamoRequestDto(cuerpo: unknown): CrearPrestamoRequestDto {
    const errores: string[] = [];

    if (typeof cuerpo !== 'object' || cuerpo === null) {
        throw new ValidacionError(['El cuerpo de la petición debe ser un objeto JSON']);
    }

    const c = cuerpo as Record<string, unknown>;

    if (typeof c.libroId !== 'string' || c.libroId.trim() === '') {
        errores.push('libroId debe ser un texto no vacío');
    }

    if (typeof c.socioId !== 'string' || c.socioId.trim() === '') {
        errores.push('socioId debe ser un texto no vacío');
    }

    if (!Array.isArray(c.ejemplares) || c.ejemplares.length === 0 ) {
        errores.push('ejemplares debe ser un arreglo con al menos un elemento');
    }else if (c.ejemplares.some((e) => typeof e !== 'number' || !Number.isInteger(e) || e <= 0)){
        errores.push('ejemplares solo admite numeros enteros positivos');
    }

    if (errores.length > 0) {
        throw new ValidacionError(errores);
    }

    return c as unknown as CrearPrestamoRequestDto;
}