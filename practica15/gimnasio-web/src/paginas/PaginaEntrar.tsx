import { Link } from 'react-router-dom';

export default function PaginaEntrar() {
  return (
    <section className="vacio">
      <h1>Acceso al gimnasio</h1>
      <p className="pagina__bajada">Para inscribirte a una clase necesitas iniciar sesión con tu cuenta.</p>
      <p>El acceso a cuentas estará disponible próximamente.</p>
      <Link to="/clases" className="boton">Volver a las clases</Link>
    </section>
  );
}
