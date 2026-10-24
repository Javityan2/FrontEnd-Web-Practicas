import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { InscripcionesController } from './inscripciones.controller';
import { InscripcionesService } from './inscripciones.service';

describe('InscripcionesController', () => {
  let controlador: InscripcionesController;

  const servicio = {
    listar: jest.fn(),
    cancelar: jest.fn(),
  };

  beforeEach(async () => {
    jest.resetAllMocks();

    const modulo = await Test.createTestingModule({
      controllers: [InscripcionesController],
      providers: [
        {
          provide: InscripcionesService,
          useValue: servicio,
        },
      ],
    }).compile();

    controlador = modulo.get(InscripcionesController);
  });

  it('convierte las fechas de la consulta a texto ISO', async () => {
    const fecha = new Date('2026-01-01T12:00:00.000Z');

    servicio.listar.mockResolvedValue([
      {
        id: 1,
        horarioId: 1,
        miembroId: 1,
        estado: 'confirmada',
        creadaEn: fecha,
      },
    ]);

    const resultado = await controlador.listar();

    expect(resultado).toEqual([
      {
        id: 1,
        horarioId: 1,
        miembroId: 1,
        estado: 'confirmada',
        creadaEn: fecha.toISOString(),
      },
    ]);
  });

  it('traduce una cancelación inexistente a NotFoundException', async () => {
    servicio.cancelar.mockResolvedValue(null);

    await expect(
      controlador.cancelar(999),
    ).rejects.toBeInstanceOf(NotFoundException);

    expect(servicio.cancelar).toHaveBeenCalledWith(999);
  });
});