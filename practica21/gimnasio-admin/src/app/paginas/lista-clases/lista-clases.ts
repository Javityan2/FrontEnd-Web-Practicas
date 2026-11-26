import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FiltroCategoria } from '../../componentes/filtro-categoria/filtro-categoria';
import { TarjetaClase } from '../../componentes/tarjeta-clase/tarjeta-clase';
import { Catalogo } from '../../servicios/catalogo';
import { RouterLink } from '@angular/router';
import { API_URL } from '../../config';


@Component({
  selector: 'app-lista-clases',
  imports: [TarjetaClase, FiltroCategoria, TitleCasePipe, RouterLink],
  templateUrl: './lista-clases.html',
  styleUrl: './lista-clases.css',
})
export class ListaClases {
  protected readonly catalogo = inject(Catalogo);
  protected readonly apiUrl = API_URL;
}
