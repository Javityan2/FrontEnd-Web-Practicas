import { Link } from 'react-router-dom';
import { useClases } from '../hooks/useClases';
import { urlImagen } from '../servicios/api';
import { Cargando } from '../componentes/Cargando';
import { MensajeError } from '../componentes/MensajeError';

export default function PaginaClases() {
  const { clases, cargando, error, reintentar } = useClases();

  return (
    <>
      <section className="pagina__encabezado">
        <h1>Clases</h1>
        <p className="pagina__bajada">Elige una clase para ver sus horarios e inscribirte.</p>
      </section>
      {cargando ? <Cargando /> : error ? (
        <MensajeError mensaje={error} onReintentar={reintentar} />
      ) : (
        <div className="rejilla">
          {clases.map(clase => (
            <Link key={clase.id} to={`/clases/${clase.id}`} className="tarjeta-clase">
              <img className="tarjeta-clase__imagen" src={urlImagen(clase.imagen)} alt={clase.nombre} loading="lazy" />
              <div className="tarjeta-clase__cuerpo">
                <span className={`etiqueta etiqueta--${clase.categoria}`}>{clase.categoria}</span>
                <span className="tarjeta-clase__titulo">{clase.nombre}</span>
                <span className="tarjeta-clase__meta">{clase.duracionMin} min</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
