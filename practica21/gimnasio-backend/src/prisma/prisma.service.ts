// El puente entre NestJS y Prisma.
//
// Prisma 7 se conecta a MySQL con un "driver adapter". Dos detalles:
//   1. @prisma/adapter-mariadb SI sirve para MySQL (mismo protocolo).
//   2. Ese driver no acepta "mysql://", por eso la DATABASE_URL
//      se desarma con `new URL(...)`.
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generado/prisma/client';

function configDelDriver(databaseUrl: string) {
  const u = new URL(databaseUrl);
  return {
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.replace(/^\//, ''),
    // Obligatorio con MySQL 8: sin esta bandera el driver responde
    // ER_CANNOT_RETRIEVE_RSA_KEY y no conecta nunca.
    allowPublicKeyRetrieval: true,
    // Solo al desplegar (Aiven pide SSL). En local, DB_SSL no existe.
    ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
  };
}

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('Falta DATABASE_URL. Revisa el archivo .env');
    }
    super({ adapter: new PrismaMariaDb(configDelDriver(url)) });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
