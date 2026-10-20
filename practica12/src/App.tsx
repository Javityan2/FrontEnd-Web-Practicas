import Saludo from './components/Saludo';

export default function App() {
  return (
    <main>
      <h1>Práctica 12: Hola React</h1>

      <section className="tarjetas">
        <Saludo nombre="Javi" />
        <Saludo nombre="Ana" />
        <Saludo nombre="Luis" />
      </section>
    </main>
  );
}