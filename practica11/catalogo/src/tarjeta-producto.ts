import estilos from './tarjeta-producto.css?inline';
import type { DetalleAgregar } from './tipos';
import './boton-app';

const pesos = new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' });

export class TarjetaProducto extends HTMLElement {
  static observedAttributes = ['producto-id', 'nombre', 'precio', 'imagen', 'existencia'];

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback(): void { this.pintar(); }

  attributeChangedCallback(): void {
    if (this.isConnected) this.pintar();
  }

  private pintar(): void {
    const id = this.getAttribute('producto-id') ?? '';
    const nombre = this.getAttribute('nombre') ?? '';
    const precio = Number(this.getAttribute('precio'));
    const imagen = this.getAttribute('imagen') ?? '';
    const existencia = Number(this.getAttribute('existencia'));
    const agotado = existencia <= 0;
    this.shadowRoot!.innerHTML = `
      <style>${estilos}</style>
      <article class="tarjeta">
        <img>
        <div class="cuerpo">
          <h3></h3>
          <p class="precio"></p>
          <p class="existencia ${agotado ? 'agotado' : ''}"></p>
          <boton-app ${agotado ? 'deshabilitado' : ''}>Agregar al carrito</boton-app>
        </div>
      </article>`;

    const sombra = this.shadowRoot!;
    const foto = sombra.querySelector('img')!;
    foto.src = imagen;
    foto.alt = nombre;
    foto.loading = 'lazy';
    sombra.querySelector('h3')!.textContent = nombre;
    sombra.querySelector('.precio')!.textContent = pesos.format(precio);
    sombra.querySelector('.existencia')!.textContent = agotado ? 'Agotado' : `${existencia} disponibles`;
    const boton = sombra.querySelector('boton-app')!;
    boton.addEventListener('click', () => {
      if (agotado) return;
      const detalle: DetalleAgregar = { id, nombre, precio };
      // Nace dentro de la sombra: composed permite cruzar su frontera.
      boton.dispatchEvent(new CustomEvent<DetalleAgregar>('agregar', {
        detail: detalle,
        bubbles: true,
        composed: true,
      }));
    });
  }
}

customElements.define('tarjeta-producto', TarjetaProducto);


