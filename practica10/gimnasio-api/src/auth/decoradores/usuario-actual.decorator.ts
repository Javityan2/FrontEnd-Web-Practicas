import { createParamDecorator } from '@nestjs/common';
import type { ExecutionContext } from '@nestjs/common';
import type { PayloadJwt } from '../dominio/usuario';

export const UsuarioActual = createParamDecorator(
  (_dato: unknown, contexto: ExecutionContext): PayloadJwt => {
    const req = contexto.switchToHttp()
      .getRequest<{ user: PayloadJwt }>();
    return req.user;
  },
);