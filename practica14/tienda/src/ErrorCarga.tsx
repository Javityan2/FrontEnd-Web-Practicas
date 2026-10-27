interface ErrorCargaProps {
  mensaje: string;
  onReintentar: () => void;
}

export function ErrorCarga({ mensaje, onReintentar }: ErrorCargaProps) {
  return (
    <div className="error" role="alert">
      <p>{mensaje}</p>
      <button type="button" onClick={onReintentar}>Reintentar</button>
    </div>
  );
}
