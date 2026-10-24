import { test } from 'node:test';
import assert from 'node:assert/strict';

import { InMemoryPrestamoRepository } from '../src/infra/in-memory-prestamo.repository.js';
import { PrestamoService } from '../src/servicios/prestamo.service.js';
import { EjemplarPrestadoError } from '../src/errores/ejemplar-prestado.error.js';

test('crea y guarda un préstamo válido', async () => {
  const repo = new InMemoryPrestamoRepository();
  const servicio = new PrestamoService(repo);

  const prestamo = await servicio.crear({
    libroId: 'LIB-0417',
    socioId: 'S-001',
    ejemplares: [14, 15],
  });

  assert.equal(prestamo.libroId, 'LIB-0417');
  assert.equal(prestamo.socioId, 'S-001');
  assert.deepEqual(prestamo.ejemplares, [14, 15]);
  assert.equal(prestamo.estado, 'activo');

  const guardado = await repo.findById(prestamo.folio);
  assert.deepEqual(guardado, prestamo);
});

test('rechaza un ejemplar ya prestado sin guardar otro préstamo', async () => {
  const repo = new InMemoryPrestamoRepository();
  const servicio = new PrestamoService(repo);

  await servicio.crear({
    libroId: 'LIB-0417',
    socioId: 'S-001',
    ejemplares: [14, 15],
  });

  await assert.rejects(
    () =>
      servicio.crear({
        libroId: 'LIB-0417',
        socioId: 'S-002',
        ejemplares: [15, 16],
      }),
    (error: unknown) => {
      assert.ok(error instanceof EjemplarPrestadoError);
      assert.equal(error.ejemplar, 15);
      return true;
    }
  );

  const guardados = await repo.findAll();
  assert.equal(guardados.length, 1);
});

test('permite prestar nuevamente un ejemplar devuelto', async () => {
  const repo = new InMemoryPrestamoRepository();
  const servicio = new PrestamoService(repo);

  const primero = await servicio.crear({
    libroId: 'LIB-0417',
    socioId: 'S-001',
    ejemplares: [14],
  });

  await repo.save({
    ...primero,
    estado: 'devuelto',
  });

  const segundo = await servicio.crear({
    libroId: 'LIB-0417',
    socioId: 'S-002',
    ejemplares: [14],
  });

  assert.equal(segundo.estado, 'activo');
  assert.equal(segundo.socioId, 'S-002');
  assert.deepEqual(segundo.ejemplares, [14]);
  assert.notEqual(segundo.folio, primero.folio);

  const guardados = await repo.findAll();
  assert.equal(guardados.length, 2);
});