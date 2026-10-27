import type { Producto } from "./datos";
import { TarjetaProducto } from "./TarjetaProducto";

interface CatalogoProps {
    productos: Producto[];
    onAgregar: (producto: Producto) => void;
}

export function Catalogo({ productos, onAgregar }: CatalogoProps) {
    return (
        <section className="catalogo">
            {productos.map(p => (
                <TarjetaProducto key={p.id} producto={p} onAgregar={onAgregar} />
            ))}
        </section>
    );
}