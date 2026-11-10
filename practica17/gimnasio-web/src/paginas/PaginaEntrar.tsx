import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { mensajeDeError } from '../servicios/api';
import { useSesion } from '../sesion/useSesion';

export default function PaginaEntrar() {
  const { entrar } = useSesion();
  const navegar = useNavigate();
  const destino: unknown = useLocation().state?.desde;
  const desde = typeof destino === 'string' && /^\/(?![/\\])/.test(destino)
    ? destino
    : '/clases';
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setError(null);
    setEnviando(true);
    try {
      await entrar(correo, password);
      navegar(desde, { replace: true });
    } catch (fallo) {
      setError(mensajeDeError(fallo, 'No se pudo iniciar sesión.'));
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form className="formulario" onSubmit={enviar}>
      <h1>Entrar</h1>
      {error && <p className="aviso aviso--error" role="alert">{error}</p>}
      <label className="campo">
        <span className="campo__etiqueta">Correo</span>
        <input className="campo__control" type="email" autoComplete="email" required
          value={correo} onChange={evento => setCorreo(evento.target.value)} />
      </label>
      <label className="campo">
        <span className="campo__etiqueta">Contraseña</span>
        <input className="campo__control" type="password" autoComplete="current-password" required
          value={password} onChange={evento => setPassword(evento.target.value)} />
      </label>
      <button type="submit" className="boton boton--ancho" disabled={enviando}>
        {enviando ? 'Entrando…' : 'Entrar'}
      </button>
      <p className="formulario__pie">¿No tienes cuenta? <Link to="/registro">Crea una cuenta</Link></p>
    </form>
  );
}
