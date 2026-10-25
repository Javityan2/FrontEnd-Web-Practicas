import { Injectable } from '@nestjs/common';
import type {
  CallHandler, ExecutionContext, NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Sobre<T> {
  data: T;
  meta: {
    ruta: string;
    duracionMs: number;
    timestamp: string;
  };
}

@Injectable()
export class SobreInterceptor implements NestInterceptor {
  intercept(
    contexto: ExecutionContext,
    siguiente: CallHandler,
  ): Observable<Sobre<unknown>> {
    const req = contexto.switchToHttp().getRequest<Request>();
    const inicio = Date.now();

    return siguiente.handle().pipe(
      map((data: unknown) => ({
        data,
        meta: {
          ruta: req.url,
          duracionMs: Date.now() - inicio,
          timestamp: new Date().toISOString(),
        },
      })),
    );
  }
}