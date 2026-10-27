import { Body, Controller, Post } from '@nestjs/common';
import { CrearPedidoDto } from './dto/crear-pedido.dto';
import { PedidosService } from './pedidos.service';

@Controller('pedidos')
export class PedidosController {
  constructor(private readonly pedidos: PedidosService) {}

  // POST /pedidos  { correo, telefono, productos: ["P-001", ...] }  ->  201 { folio, total }
  @Post()
  crear(@Body() dto: CrearPedidoDto) {
    return this.pedidos.crear(dto);
  }
}
