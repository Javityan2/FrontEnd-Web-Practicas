// Es el mismo <Layout> de la tienda, con una diferencia: en lugar de
// {children} lleva <Outlet />. Outlet es el HUECO donde React Router pinta
// la ruta hija que coincide con la URL.
import { Outlet } from 'react-router';
import { Suspense } from 'react';
import { Cargando } from './Cargando';
import { Encabezado } from './Encabezado.tsx';
import { PiePagina } from './PiePagina.tsx';

export function Layout() {
  return (
    <div className="disposicion">
      <Encabezado />
      <main className="disposicion__contenido">
        <Suspense fallback={<Cargando />}>
          <Outlet />
        </Suspense>
      </main>
      <PiePagina />
    </div>
  );
}
