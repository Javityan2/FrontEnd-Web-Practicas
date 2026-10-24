import { Test } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  it('devuelve el saludo proporcionado por el servicio', async () => {
    const appService = {
      getHello: jest.fn().mockReturnValue('Saludo de prueba'),
    };

    const modulo = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: appService,
        },
      ],
    }).compile();

    const controlador = modulo.get(AppController);

    expect(controlador.getHello()).toBe('Saludo de prueba');
    expect(appService.getHello).toHaveBeenCalledTimes(1);
  });
});