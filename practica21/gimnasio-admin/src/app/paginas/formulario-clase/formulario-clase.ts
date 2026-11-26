import { JsonPipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CATEGORIAS, type Categoria, type ClaseNueva } from '../../modelos/clase';
import { multiploDe } from '../../validadores/multiplo-de';
import { API_URL } from '../../config';


const IMAGENES = Array.from({ length: 8 }, (_, i) => `/img/clase-0${i + 1}.jpg`);

@Component({
  selector: 'app-formulario-clase',
  imports: [ReactiveFormsModule, RouterLink, JsonPipe],
  templateUrl: './formulario-clase.html',
  styleUrl: './formulario-clase.css',
})
export class FormularioClase {
  protected readonly apiUrl = API_URL;
  protected readonly categorias = CATEGORIAS;
  protected readonly imagenes = IMAGENES;

  protected readonly listo = signal<ClaseNueva | null>(null);


  protected readonly form = inject(FormBuilder).nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],

    categoria: ['fuerza' as Categoria, Validators.required],
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],

    duracionMin: [45, [Validators.required, Validators.min(10), multiploDe(5)]],
    imagen: [IMAGENES[0], Validators.required],
  });

  protected get f() {
    return this.form.controls;
  }
  
  protected guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.listo.set(null);
      return;
    }

    const datos = this.form.getRawValue();
    console.log('Esto se mandaría a la API:', datos);
    this.listo.set(datos);
  }
}
