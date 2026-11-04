// Se corre con: npx prisma db seed
// Se puede correr las veces que sea: primero borra y luego vuelve a crear.
// OJO: en Prisma 7 ya no se dispara solo despues de `migrate reset`.
import 'dotenv/config';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../src/generado/prisma/client';
import * as bcrypt from 'bcryptjs';

const u = new URL(process.env.DATABASE_URL!);
const adapter = new PrismaMariaDb({
  host: u.hostname,
  port: Number(u.port || 3306),
  user: decodeURIComponent(u.username),
  password: decodeURIComponent(u.password),
  database: u.pathname.replace(/^\//, ''),
  allowPublicKeyRetrieval: true,
  // Solo al desplegar (Aiven pide SSL). En local, DB_SSL no existe.
  ...(process.env.DB_SSL === 'true' ? { ssl: { rejectUnauthorized: false } } : {}),
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // Orden inverso a las dependencias: primero lo que apunta, al final lo apuntado.
  await prisma.usuario.deleteMany();
  await prisma.inscripcion.deleteMany();
  await prisma.horario.deleteMany();
  await prisma.miembro.deleteMany();
  await prisma.clase.deleteMany();

  // Las 8 clases. La imagen la sirve esta misma API desde public/img.
  await prisma.clase.createMany({
    data: [
      { id: 1, nombre: 'Fuerza total', categoria: 'fuerza', duracionMin: 60, imagen: '/img/clase-01.jpg',
        descripcion: 'Circuito con mancuernas y barra para trabajar el cuerpo completo. La carga se ajusta a la experiencia de cada persona.' },
      { id: 2, nombre: 'Ciclismo indoor', categoria: 'cardio', duracionMin: 45, imagen: '/img/clase-02.jpg',
        descripcion: 'Cuarenta y cinco minutos sobre la bicicleta con música y series de intensidad marcadas por el entrenador.' },
      { id: 3, nombre: 'Yoga y movilidad', categoria: 'flexibilidad', duracionMin: 50, imagen: '/img/clase-03.jpg',
        descripcion: 'Secuencias suaves de respiración y estiramiento. Recomendada para quien pasa el día sentado.' },
      { id: 4, nombre: 'Boxeo recreativo', categoria: 'cardio', duracionMin: 60, imagen: '/img/clase-04.jpg',
        descripcion: 'Técnica básica de golpeo, trabajo de guardia y acondicionamiento. No hay contacto entre alumnos.' },
      { id: 5, nombre: 'Kettlebell', categoria: 'fuerza', duracionMin: 45, imagen: '/img/clase-05.jpg',
        descripcion: 'Balanceos, cargadas y sentadillas con pesa rusa. Se enseña la técnica antes de subir el peso.' },
      { id: 6, nombre: 'Salto y coordinación', categoria: 'cardio', duracionMin: 40, imagen: '/img/clase-06.jpg',
        descripcion: 'Cuerda, escalera de agilidad y desplazamientos. Sube el pulso rápido y es más divertida de lo que parece.' },
      { id: 7, nombre: 'Caminadora guiada', categoria: 'cardio', duracionMin: 30, imagen: '/img/clase-07.jpg',
        descripcion: 'Treinta minutos con cambios de inclinación y velocidad marcados por el entrenador.' },
      { id: 8, nombre: 'Rehabilitación activa', categoria: 'flexibilidad', duracionMin: 50, imagen: '/img/clase-08.jpg',
        descripcion: 'Trabajo de bajo impacto para volver a la actividad después de una lesión. Requiere valoración previa.' },
    ],
  });

  // Dos o tres horarios por clase. El 3 tiene cupo de 1 y ya esta lleno:
  // sirve para ver el 409 desde el frontend.
  await prisma.horario.createMany({
    data: [
      { id: 1, claseId: 1, dia: 'lunes', horaInicio: '07:00', cupoMaximo: 20, entrenador: 'Ana Robles' },
      { id: 2, claseId: 1, dia: 'miércoles', horaInicio: '07:00', cupoMaximo: 20, entrenador: 'Ana Robles' },
      { id: 3, claseId: 1, dia: 'viernes', horaInicio: '18:00', cupoMaximo: 1, entrenador: 'Ana Robles' },
      { id: 4, claseId: 2, dia: 'martes', horaInicio: '06:30', cupoMaximo: 24, entrenador: 'Luis Fierro' },
      { id: 5, claseId: 2, dia: 'jueves', horaInicio: '06:30', cupoMaximo: 24, entrenador: 'Luis Fierro' },
      { id: 6, claseId: 3, dia: 'lunes', horaInicio: '19:00', cupoMaximo: 18, entrenador: 'Marisol Peña' },
      { id: 7, claseId: 3, dia: 'miércoles', horaInicio: '19:00', cupoMaximo: 18, entrenador: 'Marisol Peña' },
      { id: 8, claseId: 4, dia: 'martes', horaInicio: '20:00', cupoMaximo: 16, entrenador: 'Raúl Acosta' },
      { id: 9, claseId: 4, dia: 'jueves', horaInicio: '20:00', cupoMaximo: 16, entrenador: 'Raúl Acosta' },
      { id: 10, claseId: 5, dia: 'miércoles', horaInicio: '18:00', cupoMaximo: 14, entrenador: 'Ana Robles' },
      { id: 11, claseId: 5, dia: 'viernes', horaInicio: '07:00', cupoMaximo: 14, entrenador: 'Ana Robles' },
      { id: 12, claseId: 6, dia: 'sábado', horaInicio: '09:00', cupoMaximo: 22, entrenador: 'Daniela Soto' },
      { id: 13, claseId: 7, dia: 'lunes', horaInicio: '06:00', cupoMaximo: 12, entrenador: 'Luis Fierro' },
      { id: 14, claseId: 7, dia: 'jueves', horaInicio: '06:00', cupoMaximo: 12, entrenador: 'Luis Fierro' },
      { id: 15, claseId: 8, dia: 'martes', horaInicio: '11:00', cupoMaximo: 10, entrenador: 'Jorge Lara' },
      { id: 16, claseId: 8, dia: 'jueves', horaInicio: '11:00', cupoMaximo: 10, entrenador: 'Jorge Lara' },
    ],
  });

  await prisma.miembro.createMany({
    data: [
      { id: 1, nombre: 'Karla Duarte', correo: 'karla@itson.mx', membresia: 'premium', activo: true },
      { id: 2, nombre: 'Omar Valdez', correo: 'omar@itson.mx', membresia: 'plus', activo: true },
      { id: 3, nombre: 'Sofía Ibarra', correo: 'sofia@itson.mx', membresia: 'basica', activo: true },
    ],
  });

  // Karla ya tiene una clase, y Omar ocupa el unico lugar del horario 3.
  await prisma.inscripcion.createMany({
    data: [
      { horarioId: 6, miembroId: 1, estado: 'confirmada' },
      { horarioId: 3, miembroId: 2, estado: 'confirmada' },
    ],
  });

  // Las cuentas de prueba. Todas usan la contrasena "gimnasio2026".
  const passwordHash = await bcrypt.hash('gimnasio2026', 10);
  await prisma.usuario.createMany({
    data: [
      { correo: 'karla@itson.mx', nombre: 'Karla Duarte', passwordHash, rol: 'miembro', miembroId: 1 },
      { correo: 'omar@itson.mx', nombre: 'Omar Valdez', passwordHash, rol: 'miembro', miembroId: 2 },
      { correo: 'ana@itson.mx', nombre: 'Ana Robles', passwordHash, rol: 'entrenador' },
      { correo: 'admin@itson.mx', nombre: 'Administración', passwordHash, rol: 'admin' },
    ],
  });

  console.log(
    `Seed listo: ${await prisma.clase.count()} clases, ` +
    `${await prisma.horario.count()} horarios, ` +
    `${await prisma.miembro.count()} miembros, ` +
    `${await prisma.usuario.count()} usuarios.`,
  );
}

main()
  .catch((e) => {
    console.error('El seed fallo:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
