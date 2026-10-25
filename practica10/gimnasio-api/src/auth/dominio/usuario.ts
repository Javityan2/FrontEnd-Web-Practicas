export enum Rol {
    miembro = 'miembro',
    entrenador = 'entrenador',
    admin = 'admin',
  }
  
  export interface Usuario {
    id: number;
    correo: string;
    passwordHash: string;
    rol: Rol;
    miembroId: number | null;
    creadoEn: Date;
  }
  
  export type NuevoUsuario = Omit<Usuario, 'id' | 'creadoEn'>;
  
  export interface PayloadJwt {
    sub: number;
    correo: string;
    rol: Rol;
    miembroId: number | null;
  }