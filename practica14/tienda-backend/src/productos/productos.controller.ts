import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductosService } from './productos.service';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productos: ProductosService) {}

  @Get()
  listar(@Query('categoria') categoria?: string) {
    return this.productos.listar(categoria);
  }

  @Get(':id')
  buscar(@Param('id') id: string) {
    return this.productos.buscar(id);
  }
}
