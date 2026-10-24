import express from 'express';

import { PrestamoService } from '../servicios/prestamo.service.js';
import { InMemoryPrestamoRepository } from '../infra/in-memory-prestamo.repository.js';
import { EjemplarPrestadoError } from '../errores/ejemplar-prestado.error.js';
import { ValidacionError } from './errores-http.js';
import { validarCrearPrestamoRequestDto } from './validar.js';
import { aResponseDto } from '../dto/prestamo-response.dto.js';
import type { ErrorResponseDto } from '../contratos/prestamo.dto.js';

const PUERTO = 3000;

const repositorio = new InMemoryPrestamoRepository();
const servicio = new PrestamoService(repositorio);

const app = express(); 

app.use(express.json());

app.use(express.static('publico'));
app.use(express.static('dist/cliente'));

app.get('/api/prestamos', async (req, res) => {
    const libroId = req.query.libroId as string | undefined;

    if (libroId === undefined || libroId.trim() === '') {
        const error: ErrorResponseDto = {
            error: 'PARAMETRO_FALTANTE',
            mensaje: 'Se requiere el parametro libroId',
        };
    res.status(400).json(error);
    return;
    }

    const prestamos = await servicio.listarPorLibro(libroId);

    res.status(200).json(prestamos.map(aResponseDto));

});

app.post('/api/prestamos', async (req, res) => {
    const dto = validarCrearPrestamoRequestDto(req.body);

    const prestamo = await servicio.crear(dto);
    
    res.status(201).location(`/api/prestamos/${prestamo.folio}`).json(aResponseDto(prestamo));
});

app.use((err: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof ValidacionError) {
        const error: ErrorResponseDto = {
            error: 'VALIDACION',
            mensaje: err.message,
            detalles: err.detalles,
        };
        res.status(400).json(error);
        return;
    }

    if (err instanceof EjemplarPrestadoError) {
        const error: ErrorResponseDto = {
            error: 'EJEMPLAR_PRESTADO',
            mensaje: err.message,
        };
        res.status(409).json(error);
        return;
    }

    console.error("Error no controlado",err);

    res.status(500).json({
        error: 'ERROR_INTERNO',
        mensaje: 'Error interno del servidor',
    });
});

app.listen(PUERTO, () => {
    console.log(
      `API -> http://localhost:${PUERTO}/api/prestamos?libroId=LIB-0417`
    );
    console.log(
      `Cliente -> http://localhost:${PUERTO}/index.html`
    );
  });