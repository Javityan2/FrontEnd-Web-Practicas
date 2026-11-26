// Decorador de PARAMETRO propio, como @Body o @Param.
// Evita usar @Req() y req.user (que viene sin tipo).
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { PayloadJwt } from '../dominio/usuario';

export const UsuarioActual = createParamDecorator(
  (_dato: unknown, contexto: ExecutionContext): PayloadJwt => {
    const req = contexto.switchToHttp().getRequest<{ user: PayloadJwt }>();
    return req.user; // lo dejo ahi el validate() de la JwtStrategy
  },
);
