// Retardo artificial para la Unidad IV (el buscador con RxJS).
// En localhost la API contesta en milisegundos y la cancelacion de peticiones
// no se alcanza a ver. Con RETARDO_MS=600 en el .env, cada respuesta tarda 600 ms
// y la pestana Red muestra las peticiones canceladas. Sin la variable, no hace nada.
import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class RetardoInterceptor implements NestInterceptor {
  private readonly ms = Number(process.env.RETARDO_MS ?? 0);

  intercept(_contexto: ExecutionContext, siguiente: CallHandler): Observable<unknown> {
    return this.ms > 0 ? siguiente.handle().pipe(delay(this.ms)) : siguiente.handle();
  }
}
