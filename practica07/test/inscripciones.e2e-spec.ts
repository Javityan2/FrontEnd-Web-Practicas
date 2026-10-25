import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Inscripciones HTTP', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const modulo = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = modulo.createNestApplication();
    await app.init();
  });

  afterEach(async () => { await app.close(); });

  it('consulta por ID y libera cupo mediante DELETE', async () => {
    const servidor = app.getHttpServer();
    const primera = await request(servidor).post('/inscripciones')
      .send({ horarioId: 1, miembroId: 1 }).expect(201);
    const id = primera.body.id as number;
    expect(primera.headers.location).toBe(`/inscripciones/${id}`);
    await request(servidor).get(`/inscripciones/${id}`).expect(200)
      .expect(primera.body);
    await request(servidor).post('/inscripciones')
      .send({ horarioId: 1, miembroId: 1 }).expect(409);
    await request(servidor).post('/inscripciones')
      .send({ horarioId: 1, miembroId: 2 }).expect(201);
    await request(servidor).post('/inscripciones')
      .send({ horarioId: 1, miembroId: 3 }).expect(409);
    const cancelada = await request(servidor).delete(`/inscripciones/${id}`).expect(200);
    expect(cancelada.body.estado).toBe('cancelada');
    const consulta = await request(servidor).get(`/inscripciones/${id}`).expect(200);
    expect(consulta.body.estado).toBe('cancelada');
    await request(servidor).post('/inscripciones')
      .send({ horarioId: 1, miembroId: 3 }).expect(201);
  });

  it('responde 404 al buscar o cancelar una inscripción inexistente', async () => {
    await request(app.getHttpServer()).get('/inscripciones/999').expect(404);
    await request(app.getHttpServer()).delete('/inscripciones/999').expect(404);
  });

  it('responde 400 a identificadores inválidos', async () => {
    for (const id of ['texto', '0', '-1']) {
      await request(app.getHttpServer()).get(`/inscripciones/${id}`).expect(400);
      await request(app.getHttpServer()).delete(`/inscripciones/${id}`).expect(400);
    }
  });
});
