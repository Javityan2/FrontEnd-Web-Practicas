// Rutas /auth/registro, /auth/login y /auth/yo.
import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegistroDto, TokenDto } from './dto/auth.dto';
import { Publico } from './decoradores/publico.decorator';
import { UsuarioActual } from './decoradores/usuario-actual.decorator';
import type { PayloadJwt } from './dominio/usuario';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  // @Publico(): sin esto haria falta un token para registrarse.
  @Publico()
  @Post('registro')
  @HttpCode(201)
  registro(@Body() dto: RegistroDto): Promise<TokenDto> {
    return this.auth.registrar(dto);
  }

  @Publico()
  @Post('login')
  @HttpCode(200) // un login no "crea" nada: 200, no 201
  login(@Body() dto: LoginDto): Promise<TokenDto> {
    return this.auth.login(dto);
  }

  // Protegida. Regresa los datos que vienen dentro del token.
  @Get('yo')
  yo(@UsuarioActual() usuario: PayloadJwt) {
    return usuario;
  }
}
