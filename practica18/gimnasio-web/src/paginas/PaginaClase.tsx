import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useClase } from '../hooks/useClase';
import { mensajeDeError, urlImagen } from '../servicios/api';
import { inscribirse } from '../servicios/gimnasio';
import { useSesion } from '../sesion/useSesion';
import { leerSesion } from '../sesion/almacenamiento';
import { useInscripciones } from '../estado/inscripciones';
import { Cargando } from '../componentes/Cargando';
import { MensajeError } from '../componentes/MensajeError';

export default function PaginaClase() {
  const { id } = useParams<{ id: string }>();
  return <DetalleClase key={id} id={Number(id)} />;
}

function DetalleClase({ id }: { id: number }) {
  const { clase, cargando, error, reintentar } = useClase(id);
  const navegar = useNavigate();
  const { pathname, search, hash } = useLocation();
  const { usuario } = useSesion();
  const misInscripciones = useInscripciones(estado => estado.lista);
  const cargandoInscripciones = useInscripciones(estado => estado.cargando);
  const cargarInscripciones = useInscripciones(estado => estado.cargar);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  async function inscribir(horarioId: number) {
    if (!usuario) {
      navegar('/entrar', { state: { desde: pathname + search + hash } });
      return;
    }

    setAviso(null);
    setEnviando(true);
    const token = leerSesion()?.token;
    try {
      await inscribirse(horarioId);
      if (leerSesion()?.token !== token) return;
      setAviso({ tipo: 'exito', texto: '¡Listo! Ya estás inscrito. Lo verás en Mis inscripciones.' });
      reintentar();
      await cargarInscripciones();
    } catch (fallo) {
      setAviso({ tipo: 'error', texto: mensajeDeError(fallo, 'No se pudo completar la inscripción.') });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <>
      <Link to="/clases" className="detalle__volver">← Todas las clases</Link>
      {aviso && (
        <p className={`aviso aviso--${aviso.tipo}`} role={aviso.tipo === 'error' ? 'alert' : 'status'}>
          {aviso.texto}
        </p>
      )}
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
                    {misInscripciones.some(inscripcion => inscripcion.horario.id === horario.id) ? (
                      <span className="horario__inscrito">✓ Inscrito</span>
                    ) : horario.disponibles <= 0 ? <span className="horario__lleno">Lleno</span> : (
                      <button type="button" className="boton boton--chico" disabled={enviando || cargandoInscripciones}
                        onClick={() => inscribir(horario.id)}>Inscribirme</button>
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
