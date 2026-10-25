import 'dotenv/config';
import * as bcrypt from 'bcryptjs';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../src/generado/prisma/client';

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error('Falta DATABASE_URL');
}

const prisma = new PrismaClient({
  adapter: new PrismaMariaDb(url),
});

async function main() {
  await prisma.$transaction(async (db) => {
    const clase = await db.clase.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, nombre: 'Yoga' },
    });

    const miembro = await db.miembro.upsert({
      where: { correo: 'karla@itson.mx' },
      update: {},
      create: {
        id: 1,
        nombre: 'Karla Duarte',
        correo: 'karla@itson.mx',
        membresia: 'premium',
        activo: true,
      },
    });

    if (clase.nombre !== 'Yoga' || miembro.id !== 1) {
      throw new Error(
        'Los datos existentes no coinciden con los identificadores de las pruebas',
      );
    }

    const horario = await db.horario.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        claseId: clase.id,
        dia: 'lunes',
        horaInicio: '07:00',
        cupoMaximo: 2,
        entrenador: 'Ana Robles',
      },
    });

    if (horario.claseId !== clase.id) {
      throw new Error('El horario 1 pertenece a otra clase');
    }

    const passwordHash = await bcrypt.hash('gimnasio2026', 10);

    const cuentas = [
      {
        correo: 'karla@itson.mx',
        rol: 'miembro',
        miembroId: miembro.id,
      },
      {
        correo: 'ana@itson.mx',
        rol: 'entrenador',
        miembroId: null,
      },
      {
        correo: 'admin@itson.mx',
        rol: 'admin',
        miembroId: null,
      },
    ];

    for (const cuenta of cuentas) {
      const usuario = await db.usuario.upsert({
        where: { correo: cuenta.correo },
        update: {},
        create: {
          ...cuenta,
          passwordHash,
        },
      });

      if (
        usuario.rol !== cuenta.rol ||
        usuario.miembroId !== cuenta.miembroId
      ) {
        throw new Error(
          `Revisar el rol o miembro asociado de ${cuenta.correo}`,
        );
      }
    }
  });

  console.log('Datos iniciales preparados sin borrar registros existentes');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });