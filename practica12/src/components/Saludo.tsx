interface SaludoProps {
    nombre: string;
  }
  
  export default function Saludo({ nombre }: SaludoProps) {
    return (
      <article className="tarjeta">
        <h2>Hola, {nombre}</h2>
        <p>Bienvenido a mi primera práctica con React.</p>
        <button type="button">Ver perfil</button>
      </article>
    );
  }