import { Body, Controller, HttpCode, Post, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegistroDto } from './dto/auth.dto';
import { Publico } from './decoradores/publico.decorator';
import { UsuarioActual } from './decoradores/usuario-actual.decorator';
import type { PayloadJwt } from './dominio/usuario';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Publico()
  @Post('registro')
  @HttpCode(201)
  registro(@Body() dto: RegistroDto) {
    return this.auth.registrar(dto);
  }

  @Publico()
  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @ApiBearerAuth()
  @Get('yo')
  yo(@UsuarioActual() usuario: PayloadJwt) {
    return usuario;
  }
}