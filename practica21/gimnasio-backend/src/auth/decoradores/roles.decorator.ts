// Como @Publico(), pero guarda la lista de roles permitidos.
import { SetMetadata } from '@nestjs/common';
import { Rol } from '../dominio/usuario';

export const ROLES_REQUERIDOS = 'rolesRequeridos';

// Uso: @Roles(Rol.entrenador, Rol.admin) encima del metodo.
export const Roles = (...roles: Rol[]) => SetMetadata(ROLES_REQUERIDOS, roles);
