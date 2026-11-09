import { Link, useNavigate, useParams } from 'react-router-dom';
import { useClase } from '../hooks/useClase';
import { urlImagen } from '../servicios/api';
import { Cargando } from '../componentes/Cargando';
import { MensajeError } from '../componentes/MensajeError';

export default function PaginaClase() {
  const { id } = useParams<{ id: string }>();
  const { clase, cargando, error, reintentar } = useClase(Number(id));
  const navegar = useNavigate();

  return (
    <>
      <Link to="/clases" className="detalle__volver">← Todas las clases</Link>
      {cargando ? <Cargando /> : error ? (
        <MensajeError mensaje={error} onReintentar={reintentar} />
      ) : clase && (
        <article className="detalle">
          <img className="detalle__imagen" src={urlImagen(clase.imagen)} alt={clase.nombre} />
          <div className="detalle__datos">
            <span className={`etiqueta etiqueta--${clase.categoria}`}>{clase.categoria}</span>
            <h1>{clase.nombre}</h1>
            <p className="pagina__bajada">{clase.descripcion} · {clase.duracionMin} min</p>
            <h2>Horarios</h2>
            {clase.horarios.length === 0 ? <p>No hay horarios disponibles para esta clase.</p> : (
              <ul className="horarios">
                {clase.horarios.map(horario => (
                  <li className="horario" key={horario.id}>
                    <div>
                      <div className="horario__dia">{horario.dia} · {horario.horaInicio}</div>
                      <div className="horario__meta">
                        {horario.entrenador} · {horario.disponibles} de {horario.cupoMaximo} lugares
                      </div>
                    </div>
                    {horario.disponibles <= 0 ? <span className="horario__lleno">Lleno</span> : (
                      <button type="button" className="boton boton--chico"
                        onClick={() => navegar('/entrar')}>Inscribirme</button>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </article>
      )}
    </>
  );
}
