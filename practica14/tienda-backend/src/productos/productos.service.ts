import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductosService {
  constructor(private readonly prisma: PrismaService) {}

  // GET /productos y GET /productos?categoria=ropa
  listar(categoria?: string) {
    return this.prisma.producto.findMany({
      where: categoria ? { categoria } : undefined,
      orderBy: { id: 'asc' },
    });
  }

  // GET /productos/:id
  async buscar(id: string) {
    const producto = await this.prisma.producto.findUnique({ where: { id } });
    if (!producto) throw new NotFoundException(`No existe el producto ${id}`);
    return producto;
  }
}
