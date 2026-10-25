import { Injectable, Logger } from '@nestjs/common';
import type {
  CallHandler, ExecutionContext, NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(
    contexto: ExecutionContext,
    siguiente: CallHandler,
  ): Observable<unknown> {
    const req = contexto.switchToHttp().getRequest<Request>();
    const inicio = Date.now();

    return siguiente.handle().pipe(
      tap(() => {
        const ms = Date.now() - inicio;
        this.logger.log(`${req.method} ${req.url} - ${ms}ms`);
      }),
    );
  }
}