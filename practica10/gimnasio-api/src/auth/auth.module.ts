import 'dotenv/config';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { USUARIO_REPOSITORY } from './dominio/usuario.repository';
import { UsuarioPrismaRepository } from './infra/usuario-prisma.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
  throw new Error('JWT_SECRET debe tener al menos 32 caracteres');
}

@Module({
  imports: [
    PassportModule,
    JwtModule.register({ secret, signOptions: { expiresIn: '1h' } }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    {
      provide: USUARIO_REPOSITORY,
      useClass: UsuarioPrismaRepository,
    },
  ],
})
export class AuthModule {}