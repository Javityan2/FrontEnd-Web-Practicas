import { useState, type FormEvent } from 'react';
import { pesos, type Producto } from './datos';
import { mensajeDeError } from './servicios/api';
import type { ContactoPago } from './servicios/pedidos';

interface FormularioPagoProps {
  carrito: Producto[];
  enviando: boolean;
  onPagar: (contacto: ContactoPago) => Promise<void>;
}

export function FormularioPago({ carrito, enviando, onPagar }: FormularioPagoProps) {
  const [correo, setCorreo] = useState('');
  const [telefono, setTelefono] = useState('');
  const [error, setError] = useState<string | null>(null);
  const total = carrito.reduce((suma, producto) => suma + producto.precio, 0);

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    if (enviando) return;
    setError(null);
    if (!correo.trim().includes('@')) {
      setError('El correo debe contener @.');
      return;
    }
    if (!/^\d{10}$/.test(telefono)) {
      setError('El teléfono debe tener exactamente 10 dígitos.');
      return;
    }
    if (carrito.length === 0) {
      setError('Agrega al menos un producto antes de pagar.');
      return;
    }
    try {
      await onPagar({ correo: correo.trim(), telefono });
    } catch (fallo) {
      setError(mensajeDeError(fallo));
    }
  }

  return (
    <form className="pago" onSubmit={enviar} noValidate aria-busy={enviando}>
      <h2>Pago simulado</h2>
      <p>{carrito.length} piezas · Total: {pesos.format(total)}</p>
      <p>No se realiza ningún cargo real.</p>
      <label htmlFor="correo">Correo
        <input id="correo" name="correo" type="email" autoComplete="email"
          value={correo} onChange={evento => setCorreo(evento.target.value)}
          disabled={enviando} required aria-describedby={error ? 'error-pago' : undefined} />
      </label>
      <label htmlFor="telefono">Teléfono
        <input id="telefono" name="telefono" type="tel" inputMode="numeric" autoComplete="tel-national"
          value={telefono} onChange={evento => setTelefono(evento.target.value)}
          disabled={enviando} required aria-describedby={error ? 'error-pago' : undefined} />
      </label>
      {error && <p id="error-pago" className="pago__error" role="alert">{error}</p>}
      <button type="submit" disabled={enviando || carrito.length === 0}>
        {enviando ? 'Enviando pedido…' : 'Pagar'}
      </button>
    </form>
  );
}
