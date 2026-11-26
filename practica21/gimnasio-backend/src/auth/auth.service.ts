// Registro y login.
import { ConflictException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';     // firma los tokens (lo da JwtModule)
import * as bcrypt from 'bcryptjs';            // hash de contrasenas
import { PayloadJwt, Usuario } from './dominio/usuario';
import { USUARIO_REPOSITORY, type UsuarioRepository } from './dominio/usuario.repository';
import { LoginDto, RegistroDto, TokenDto } from './dto/auth.dto';

// 2^10 vueltas de bcrypt. Lento a proposito: es lo que hace caro probar
// un diccionario completo contra el hash.
const VUELTAS = 10;

@Injectable()
export class AuthService {
  constructor(
    @Inject(USUARIO_REPOSITORY) private readonly repo: UsuarioRepository, // se inyecta por token
    private readonly jwt: JwtService,                                    // se inyecta por su clase
  ) {}

  async registrar(dto: RegistroDto): Promise<TokenDto> {
    // En el registro SI se puede decir que el correo existe: la persona
    // necesita saberlo para iniciar sesion en su lugar.
    if (await this.repo.buscarPorCorreo(dto.correo)) {
      throw new ConflictException('Ese correo ya está registrado'); // 409
    }
    // Crea al miembro y a su usuario juntos.
    const usuario = await this.repo.registrarMiembro({
      nombre: dto.nombre,
      correo: dto.correo,
      passwordHash: await bcrypt.hash(dto.password, VUELTAS), // el hash, ANTES de guardar
    });
    return this.firmar(usuario); // quien se registra ya queda con sesion
  }

  async login(dto: LoginDto): Promise<TokenDto> {
    const usuario = await this.repo.buscarPorCorreo(dto.correo);
    // El MISMO mensaje en los dos casos. Si fueran distintos, cualquiera
    // averigua que correos existen probando uno por uno.
    const generico = new UnauthorizedException('Credenciales inválidas'); // 401
    if (!usuario) throw generico;
    // compare() no "descifra": vuelve a calcular el hash y lo compara.
    if (!(await bcrypt.compare(dto.password, usuario.passwordHash))) throw generico;
    return this.firmar(usuario);
  }

  // Arma el payload y lo firma con JWT_SECRET.
  private async firmar(usuario: Usuario): Promise<TokenDto> {
    const payload: PayloadJwt = {
      sub: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
      miembroId: usuario.miembroId,
    };
    return {
      access_token: await this.jwt.signAsync(payload), // header.payload.firma
      token_type: 'Bearer',
      expires_in: 3600, // 1 hora, igual que en auth.module.ts
      // Datos para el encabezado del frontend.
      usuario: { correo: usuario.correo, nombre: usuario.nombre, rol: usuario.rol },
    };
  }
}
