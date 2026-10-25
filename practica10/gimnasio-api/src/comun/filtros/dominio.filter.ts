import { ArgumentsHost, Catch, Logger } from '@nestjs/common';
import type { ExceptionFilter } from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ErrorDeDominio, CupoLlenoError, InscripcionDuplicadaError,
  HorarioNoEncontradoError, MiembroNoEncontradoError,
} from '../../inscripciones/dominio/errores';

@Catch(ErrorDeDominio)
export class DominioExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger('Dominio');

  catch(error: ErrorDeDominio, host: ArgumentsHost) {
    const contexto = host.switchToHttp();
    const req = contexto.getRequest<Request>();
    const res = contexto.getResponse<Response>();
    let estado = 500;

    if (error instanceof HorarioNoEncontradoError ||
        error instanceof MiembroNoEncontradoError) {
      estado = 404;
    } else if (error instanceof CupoLlenoError ||
               error instanceof InscripcionDuplicadaError) {
      estado = 409;
    }

    this.logger.warn(
      `${req.method} ${req.url} -> ${estado} ${error.constructor.name}`,
    );
    res.status(estado).json({
      statusCode: estado,
      error: error.constructor.name,
      message: error.message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}