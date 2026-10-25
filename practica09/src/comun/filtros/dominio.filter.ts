import { Catch, HttpStatus } from '@nestjs/common';
import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { Request, Response } from 'express';
import {
  ErrorDominio,
  HorarioNoEncontradoError,
  MiembroNoEncontradoError,
} from '../../inscripciones/dominio/errores';

@Catch(ErrorDominio)
export class DominioFilter implements ExceptionFilter {
  catch(error: ErrorDominio, host: ArgumentsHost): void {
    const contexto = host.switchToHttp();
    const respuesta = contexto.getResponse<Response>();
    const peticion = contexto.getRequest<Request>();

    const noEncontrado =
      error instanceof HorarioNoEncontradoError ||
      error instanceof MiembroNoEncontradoError;

    const statusCode = noEncontrado
      ? HttpStatus.NOT_FOUND
      : HttpStatus.CONFLICT;

    respuesta.status(statusCode).json({
      statusCode,
      error: error.name,
      message: error.message,
      path: peticion.originalUrl,
      timestamp: new Date().toISOString(),
    });
  }
}