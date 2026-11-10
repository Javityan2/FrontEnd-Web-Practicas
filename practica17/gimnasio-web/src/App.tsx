import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './componentes/Layout';
import { NoEncontrado } from './componentes/NoEncontrado';
import PaginaClases from './paginas/PaginaClases';
import PaginaClase from './paginas/PaginaClase';
import PaginaEntrar from './paginas/PaginaEntrar';
import PaginaRegistro from './paginas/PaginaRegistro';
import PaginaMisInscripciones from './paginas/PaginaMisInscripciones';
import { RutaProtegida } from './componentes/RutaProtegida';

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
