import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegistroDto {
  @ApiProperty({
    example: 'nuevo@example.com',
    format: 'email',
    maxLength: 160,
  })
  @IsEmail({}, { message: 'correo no tiene un formato valido' })
  @MaxLength(160)
  correo!: string;

  @ApiProperty({
    example: 'gimnasio2026',
    format: 'password',
    minLength: 8,
    maxLength: 72,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password!: string;
}

export class LoginDto {
  @ApiProperty({
    example: 'karla@itson.mx',
    format: 'email',
    maxLength: 160,
  })
  @IsEmail({}, { message: 'correo no tiene un formato valido' })
  @MaxLength(160)
  correo!: string;

  @ApiProperty({
    example: 'gimnasio2026',
    format: 'password',
    minLength: 1,
  })
  @IsString()
  @MinLength(1)
  password!: string;
}

export class TokenDto {
  access_token!: string;
  token_type!: string;
  expires_in!: number;
}