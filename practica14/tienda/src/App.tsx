import { useState } from 'react';
import { Layout } from './Layout';
import { Encabezado } from './Encabezado';
import { PiePagina } from './PiePagina';
import { Catalogo } from './Catalogo';
import { Filtros } from './Filtros';
import { FormularioPago } from './FormularioPago';
import { Cargando } from './Cargando';
import { ErrorCarga } from './ErrorCarga';
import { useProductos } from './hooks/useProductos';
import { crearPedido, type ContactoPago, type PedidoConfirmado } from './servicios/pedidos';
import { pesos, type Producto } from './datos';

export default function App() {
  const { productos, cargando, error, recargar } = useProductos();
  const [categoriaActiva, setCategoriaActiva] = useState('Todas');
  const [carrito, setCarrito] = useState<Producto[]>([]);
  const [enviando, setEnviando] = useState(false);
  const [confirmacion, setConfirmacion] = useState<PedidoConfirmado | null>(null);
  const categorias = ['Todas', ...new Set(productos.map(producto => producto.categoria))];
  const visibles = categoriaActiva === 'Todas'
    ? productos : productos.filter(producto => producto.categoria === categoriaActiva);
  const total = carrito.reduce((suma, producto) => suma + producto.precio, 0);

  function agregar(producto: Producto) {
    if (enviando) return;
    setConfirmacion(null);
    setCarrito(anterior => [...anterior, producto]);
  }

  async function pagar(contacto: ContactoPago): Promise<void> {
    setEnviando(true);
    try {
      const pedido = await crearPedido(contacto, carrito.map(producto => producto.id));
      setConfirmacion(pedido);
      setCarrito([]);
      recargar();
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Layout encabezado={<Encabezado piezas={carrito.length} />}
      pie={<PiePagina piezas={carrito.length} total={total} />}>
      <section className="portada">
        <h1>Catálogo de temporada</h1>
        <p>{cargando ? 'Consultando el catálogo' : `${visibles.length} productos disponibles`}</p>
      </section>
      {confirmacion && (
        <div className="confirmacion" role="status">
          Pedido confirmado: {confirmacion.folio} · Total: {pesos.format(confirmacion.total)}
        </div>
      )}
      {cargando ? <Cargando /> : error ? <ErrorCarga mensaje={error} onReintentar={recargar} /> : (
        <>
          <Filtros categorias={categorias} activa={categoriaActiva} onCambiar={setCategoriaActiva} />
          <Catalogo productos={visibles} onAgregar={agregar} />
        </>
      )}
      {carrito.length > 0 && (
        <FormularioPago carrito={carrito} enviando={enviando} onPagar={pagar} />
      )}
    </Layout>
  );
}
