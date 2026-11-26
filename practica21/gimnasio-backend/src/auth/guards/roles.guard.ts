// Segundo guardia. 401 = no se quien eres (JwtAuthGuard);
// 403 = se quien eres, pero tu rol no alcanza (este).
import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PayloadJwt, Rol } from '../dominio/usuario';
import { ROLES_REQUERIDOS } from '../decoradores/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(contexto: ExecutionContext): boolean {
    // Que roles pide la ruta (lo que puso @Roles). Puede no pedir ninguno.
    const requeridos = this.reflector.getAllAndOverride<Rol[]>(ROLES_REQUERIDOS, [
      contexto.getHandler(),
      contexto.getClass(),
    ]);
    if (!requeridos || requeridos.length === 0) {
      return true; // sin @Roles: basta con haber pasado el JwtAuthGuard
    }

    // El usuario lo dejo la JwtStrategy en req.user.
    const usuario = contexto.switchToHttp().getRequest<{ user?: PayloadJwt }>().user;
    if (!usuario || !requeridos.includes(usuario.rol)) {
      throw new ForbiddenException(`Esta operacion requiere el rol: ${requeridos.join(' o ')}`);
    }
    return true;
  }
}
