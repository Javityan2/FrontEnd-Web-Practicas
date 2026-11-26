// Lo que entra por /auth/registro y /auth/login.
// Sin @ApiProperty: el plugin de Swagger (nest-cli.json) lee los archivos
// .dto.ts y los documenta solo, incluidas estas reglas.
import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';
import { Rol } from '../dominio/usuario';

// El registro es publico: no acepta rol ni miembroId. Si los mandan,
// el ValidationPipe responde 400 (forbidNonWhitelisted).
export class RegistroDto {
  @IsString()
  @IsNotEmpty({ message: 'el nombre es obligatorio' })
  @MaxLength(120)
  nombre: string;

  @IsEmail({}, { message: 'el correo no tiene un formato válido' })
  correo: string;

  // El minimo va aqui, en la frontera. En el Service ya seria tarde.
  @MinLength(8, { message: 'la contraseña debe tener al menos 8 caracteres' })
  password: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'el correo no tiene un formato válido' })
  correo: string;

  @MinLength(1, { message: 'la contraseña es obligatoria' })
  password: string;
}

// Quien inicio sesion, para mostrarlo sin decodificar el token.
export class UsuarioSesionDto {
  correo: string;
  nombre: string;
  rol: Rol;
}

// Lo que regresa el login y el registro. Es de salida: no lleva validaciones.
export class TokenDto {
  access_token: string; // el JWT
  token_type: string;   // siempre "Bearer"
  expires_in: number;   // segundos de vigencia
  usuario: UsuarioSesionDto; // quien inicio sesion
}
