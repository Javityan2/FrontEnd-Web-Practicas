import { httpResource } from '@angular/common/http';
import { Service, computed, signal } from '@angular/core';
import { API_URL } from '../config';
import type { Categoria, Clase, Sobre } from '../modelos/clase';
import { mensajeDeApi } from './errores';

@Service()
export class Catalogo {
  // --- el estado -----------------------------------------------------------

  // La respuesta trae el sobre { data, meta } de la Práctica 9B. El tipo
  // entre <> es una PROMESA nuestra: Angular no revisa que el JSON sea así.
  private readonly recurso = httpResource<Sobre<Clase[]>>(() => `${API_URL}/clases`);

  /** Las clases, ya sin el sobre. Mientras carga, un arreglo vacío. */
  private readonly clases = computed(() =>
    this.recurso.hasValue() ? this.recurso.value().data : [],
  );

  readonly cargando = computed(() => this.recurso.isLoading());
  readonly error = computed(() => {
    const e = this.recurso.error();
    return e ? mensajeDeApi(e) : null;
  });

  /** La categoría del filtro. 'todas' es el valor de "sin filtro". */
  readonly categoria = signal<Categoria | 'todas'>('todas');

  /** La clase que se eligió con un clic. null = ninguna. */
  readonly seleccionada = signal<Clase | null>(null);

  // --- lo derivado (igual que en la Práctica 20) ---------------------------

  readonly visibles = computed(() => {
    const cat = this.categoria();
    const todas = this.clases();
    return cat === 'todas' ? todas : todas.filter((c) => c.categoria === cat);
  });

  readonly minutosTotales = computed(() =>
    this.visibles().reduce((suma, c) => suma + c.duracionMin, 0),
  );

  // --- las acciones (igual que en la Práctica 20) --------------------------

  filtrar(categoria: Categoria | 'todas'): void {
    this.categoria.set(categoria);
    const elegida = this.seleccionada();
    if (elegida && categoria !== 'todas' && elegida.categoria !== categoria) {
      this.seleccionada.set(null);
    }
  }

  seleccionar(clase: Clase): void {
    this.seleccionada.update((actual) => (actual?.id === clase.id ? null : clase));
  }
}
