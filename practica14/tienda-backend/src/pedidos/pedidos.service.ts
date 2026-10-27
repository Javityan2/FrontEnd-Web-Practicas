// El pago es SIMULADO: no se cobra nada. Se valida la existencia, se guarda el pedido,
// se descuenta del inventario y se regresa un folio.
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CrearPedidoDto } from './dto/crear-pedido.dto';

@Injectable()
export class PedidosService {
  constructor(private readonly prisma: PrismaService) {}

  async crear(dto: CrearPedidoDto) {
    // ["P-001", "P-001", "P-005"] -> { "P-001": 2, "P-005": 1 }
    const cantidades = new Map<string, number>();
    for (const id of dto.productos) cantidades.set(id, (cantidades.get(id) ?? 0) + 1);

    const productos = await this.prisma.producto.findMany({
      where: { id: { in: [...cantidades.keys()] } },
    });

    // Las reglas de la tienda: que exista (404) y que alcance (409).
    for (const [id, cantidad] of cantidades) {
      const p = productos.find((x) => x.id === id);
      if (!p) throw new NotFoundException(`No existe el producto ${id}`);
      if (p.existencia < cantidad) {
        throw new ConflictException(`No hay suficientes piezas de ${p.nombre} (quedan ${p.existencia})`);
      }
    }

    const renglones = productos.map((p) => ({ productoId: p.id, cantidad: cantidades.get(p.id)!, precio: p.precio }));
    const total = renglones.reduce((suma, r) => suma + r.cantidad * r.precio, 0);

    // Todo o nada: el pedido y los descuentos de inventario van en una sola transacción.
    const pedido = await this.prisma.$transaction(async (tx) => {
      const creado = await tx.pedido.create({
        data: { correo: dto.correo, telefono: dto.telefono, total, renglones: { create: renglones } },
      });
      for (const r of renglones) {
        await tx.producto.update({ where: { id: r.productoId }, data: { existencia: { decrement: r.cantidad } } });
      }
      return creado;
    });

    return { folio: `PED-${String(pedido.id).padStart(4, '0')}`, total };
  }
}
