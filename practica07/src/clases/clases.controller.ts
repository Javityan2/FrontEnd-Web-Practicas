import { Body, Controller, Get, Post } from '@nestjs/common';
import { ClasesService } from './clases.service';

@Controller('clases')
export class ClasesController {
  constructor(private readonly clasesService: ClasesService) {}

  @Get()
  listar() {
    return this.clasesService.listar();
  }

  @Post()
  crear(@Body() nuevaClase: { id: number; nombre: string }) {
    const clase = this.clasesService.crear(nuevaClase);

    return {
      message: 'Clase agregada correctamente',
      clase,
    };
  }
}
