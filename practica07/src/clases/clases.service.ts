import { Injectable } from '@nestjs/common';

export interface ClaseCatalogo {
  id: number;
  nombre: string;
}

@Injectable()
export class ClasesService {
  private readonly catalogo: ClaseCatalogo[] = [
    { id: 1, nombre: 'MMA' },
    { id: 2, nombre: 'Boxeo' },
    { id: 3, nombre: 'Kickboxing' },
    { id: 4, nombre: 'Yoga' },
  ];

  listar(): ClaseCatalogo[] {
    return this.catalogo;
  }

  crear(nuevaClase: ClaseCatalogo): ClaseCatalogo {
    this.catalogo.push(nuevaClase);
    return nuevaClase;
  }
}