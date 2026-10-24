import { Test } from '@nestjs/testing';
import { InscripcionesService } from './inscripciones.service';
import { InscripcionMemoriaRepository } from './infra/inscripcion-memoria.repository';
import { INSCRIPCION_REPOSITORY } from './dominio/inscripcion.repository';
import {
  CupoLlenoError,
  InscripcionDuplicadaError,
} from './dominio/errores';

describe('InscripcionesService', () => {
  let servicio: InscripcionesService;

  beforeEach(async () => {
    const modulo = await Test.createTestingModule({
      providers: [
        InscripcionesService,
        {
          provide: INSCRIPCION_REPOSITORY,
          useClass: InscripcionMemoriaRepository,
        },
      ],
    }).compile();

    servicio = modulo.get(InscripcionesService);
  });

  it('crea una inscripción confirmada', async () => {
    const creada = await servicio.crear({
      horarioId: 1,
      miembroId: 1,
    });

    expect(creada).toMatchObject({
      horarioId: 1,
      miembroId: 1,
      estado: 'confirmada',
    });

    expect(await servicio.listar()).toHaveLength(1);
  });

  it('rechaza una inscripción duplicada', async () => {
    await servicio.crear({ horarioId: 1, miembroId: 1 });

    await expect(
      servicio.crear({ horarioId: 1, miembroId: 1 }),
    ).rejects.toBeInstanceOf(InscripcionDuplicadaError);

    expect(await servicio.listar()).toHaveLength(1);
  });

  it('rechaza una inscripción cuando el cupo está lleno', async () => {
    await servicio.crear({ horarioId: 1, miembroId: 1 });
    await servicio.crear({ horarioId: 1, miembroId: 2 });

    await expect(
      servicio.crear({ horarioId: 1, miembroId: 3 }),
    ).rejects.toBeInstanceOf(CupoLlenoError);

    expect(await servicio.listar()).toHaveLength(2);
  });

  it('libera cupo al cancelar una inscripción', async () => {
    const primera = await servicio.crear({
      horarioId: 1,
      miembroId: 1,
    });

    await servicio.crear({ horarioId: 1, miembroId: 2 });

    const cancelada = await servicio.cancelar(primera.id);

    expect(cancelada?.estado).toBe('cancelada');

    const nueva = await servicio.crear({
      horarioId: 1,
      miembroId: 3,
    });

    expect(nueva.estado).toBe('confirmada');

    const todas = await servicio.listar();
    const confirmadas = todas.filter(
      (inscripcion) => inscripcion.estado === 'confirmada',
    );

    expect(confirmadas).toHaveLength(2);
  });
});