import {
    BadRequestException, ConflictException, Inject,
    Injectable, UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcryptjs';
  import { Rol } from './dominio/usuario';
  import type { PayloadJwt, Usuario } from './dominio/usuario';
  import { USUARIO_REPOSITORY } from './dominio/usuario.repository';
  import type { UsuarioRepository } from './dominio/usuario.repository';
  import type { LoginDto, RegistroDto, TokenDto } from './dto/auth.dto';
  
  @Injectable()
  export class AuthService {
    constructor(
      @Inject(USUARIO_REPOSITORY)
      private readonly repo: UsuarioRepository,
      private readonly jwt: JwtService,
    ) {}
  
    async registrar(dto: RegistroDto): Promise<TokenDto> {
      if (Buffer.byteLength(dto.password, 'utf8') > 72) {
        throw new BadRequestException('La contrasena supera los 72 bytes');
      }
      if (await this.repo.buscarPorCorreo(dto.correo)) {
        throw new ConflictException('Ese correo ya esta registrado');
      }
      const usuario = await this.repo.guardar({
        correo: dto.correo,
        passwordHash: await bcrypt.hash(dto.password, 10),
        rol: Rol.miembro,
        miembroId: null,
      });
      return this.firmar(usuario);
    }
  
    async login(dto: LoginDto): Promise<TokenDto> {
      const usuario = await this.repo.buscarPorCorreo(dto.correo);
      if (!usuario || Buffer.byteLength(dto.password, 'utf8') > 72) {
        throw new UnauthorizedException('Credenciales invalidas');
      }
      if (!(await bcrypt.compare(dto.password, usuario.passwordHash))) {
        throw new UnauthorizedException('Credenciales invalidas');
      }
      return this.firmar(usuario);
    }
  
    private async firmar(usuario: Usuario): Promise<TokenDto> {
      const payload: PayloadJwt = {
        sub: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol,
        miembroId: usuario.miembroId,
      };
      return {
        access_token: await this.jwt.signAsync(payload),
        token_type: 'Bearer',
        expires_in: 3600,
      };
    }
  }