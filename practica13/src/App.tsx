import { useState } from "react";
import { Layout } from "./Layout.tsx";
import { Encabezado } from "./Encabezado.tsx";
import { PiePagina } from "./PiePagina.tsx";
import { productos, type Producto } from "./datos.ts";
import { Catalogo } from "./Catalogo.tsx";
import { Filtros } from "./Filtros.tsx";

const categorias = ["Todas", ...new Set(productos.map(p => p.categoria))];

export default function App() {
  // Estado para la categoría activa y el carrito de compras
  const [categoriaActiva, setCategoriaActiva] = useState("Todas");
  const [carrito, setCarrito] = useState<Producto[]>([]);

  //Derivados
  const visibles = categoriaActiva === "Todas" ? productos : productos.filter(p => p.categoria === categoriaActiva);
  const total = carrito.reduce((suma, p) => suma + p.precio, 0);

  //Evento
  function agregar(producto: Producto) {
    setCarrito((anterior) => [...anterior, producto]);
  }

  return (
    <Layout encabezado={<Encabezado piezas={carrito.length} />} pie={<PiePagina piezas={carrito.length} total={total} />}>
      <section className="portada">
        <h1>Catalogo de temporada</h1>
        <p>{visibles.length} productos disponibles</p>
        <Filtros categorias={categorias} activa={categoriaActiva} onCambiar={setCategoriaActiva} />
        <Catalogo productos={visibles} onAgregar={agregar} />
      </section>
    </Layout>
  );
}