import { Routes } from '@angular/router';
import { ListaClases } from './paginas/lista-clases/lista-clases';
import { Horarios } from './paginas/horarios/horarios';
import { Miembros } from './paginas/miembros/miembros';
import { FormularioClase } from './paginas/formulario-clase/formulario-clase';

export const routes: Routes = [
  { path: 'clases', component: ListaClases, title: 'Clases · Admin' },
  { path: 'clases/nueva', component: FormularioClase, title: 'Nueva clase · Admin' },
  { path: 'horarios', component: Horarios, title: 'Horarios · Admin' },
  { path: 'miembros', component: Miembros, title: 'Miembros · Admin' },

  { path: '', redirectTo: 'clases', pathMatch: 'full' },
  { path: '**', redirectTo: 'clases' },
];
