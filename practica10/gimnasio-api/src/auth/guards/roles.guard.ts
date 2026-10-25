import {
    CanActivate,
    ExecutionContext,
    Injectable,
  } from '@nestjs/common';
  import { Reflector } from '@nestjs/core';
  import type { Request } from 'express';
  import { ROLES_KEY } from '../decoradores/roles.decorator';
  import type { PayloadJwt, Rol } from '../dominio/usuario';
  
  @Injectable()
  export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}
  
    canActivate(contexto: ExecutionContext): boolean {
      const permitidos = this.reflector.getAllAndOverride<Rol[]>(
        ROLES_KEY,
        [contexto.getHandler(), contexto.getClass()],
      );
  
      if (!permitidos || permitidos.length === 0) {
        return true;
      }
  
      const peticion = contexto.switchToHttp().getRequest<
        Request & { user?: PayloadJwt }
      >();
  
      const usuario = peticion.user;
  
      return usuario !== undefined &&
        permitidos.includes(usuario.rol);
    }
  }
  