import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSesion } from '../sesion/useSesion';

export function RutaProtegida() {
  const { usuario } = useSesion();
  const { pathname, search, hash } = useLocation();

  if (!usuario) {
    return <Navigate to="/entrar" replace state={{ desde: pathname + search + hash }} />;
  }

  return <Outlet />;
}
