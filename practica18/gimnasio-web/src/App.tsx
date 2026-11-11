import { lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './componentes/Layout';
import { RutaProtegida } from './componentes/RutaProtegida';

const PaginaClases = lazy(() => import('./paginas/PaginaClases'));
const PaginaClase = lazy(() => import('./paginas/PaginaClase'));
const PaginaEntrar = lazy(() => import('./paginas/PaginaEntrar'));
const PaginaRegistro = lazy(() => import('./paginas/PaginaRegistro'));
const PaginaMisInscripciones = lazy(() => import('./paginas/PaginaMisInscripciones'));
const NoEncontrado = lazy(() => import('./componentes/NoEncontrado'));

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/clases" replace />} />
        <Route path="clases">
          <Route index element={<PaginaClases />} />
          <Route path=":id" element={<PaginaClase />} />
        </Route>
        <Route path="entrar" element={<PaginaEntrar />} />
        <Route path="registro" element={<PaginaRegistro />} />
        <Route element={<RutaProtegida />}>
          <Route path="mis-inscripciones" element={<PaginaMisInscripciones />} />
        </Route>
        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}
