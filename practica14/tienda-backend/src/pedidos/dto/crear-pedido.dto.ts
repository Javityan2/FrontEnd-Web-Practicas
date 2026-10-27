// El contrato de entrada de POST /pedidos. El ValidationPipe responde 400 si no se cumple.
import { ArrayNotEmpty, IsArray, IsEmail, IsString, Matches } from 'class-validator';

export class CrearPedidoDto {
  @IsEmail({}, { message: 'El correo no es válido' })
  correo!: string;

  @Matches(/^\d{10}$/, { message: 'El teléfono debe tener 10 dígitos' })
  telefono!: string;

  // Los ids de lo que hay en el carrito. Si un id se repite, son dos piezas.
  @IsArray()
  @ArrayNotEmpty({ message: 'El carrito está vacío' })
  @IsString({ each: true })
  productos!: string[];
}
