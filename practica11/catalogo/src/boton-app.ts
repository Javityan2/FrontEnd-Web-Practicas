import estilos from './boton-app.css?inline';

/** Entradas: variante y deshabilitado. Contenido: el slot del botón. */
export class BotonApp extends HTMLElement {
  static observedAttributes = ['variante', 'deshabilitado', 'disabled'];
  private readonly boton: HTMLButtonElement;

  constructor() {
    super();
    const sombra = this.attachShadow({ mode: 'open' });
    sombra.innerHTML = `<style>${estilos}</style><button type="button"><slot></slot></button>`;
    this.boton = sombra.querySelector('button')!;
  }

  // Al conectarse al documento ya se pueden leer los atributos.
  connectedCallback(): void { this.pintar(); }

  attributeChangedCallback(): void { this.pintar(); }

  // disconnectedCallback limpiaría suscripciones externas o temporizadores.
  // adoptedCallback se ejecutaría al trasladarlo a otro documento.
  // Este componente no necesita esos dos callbacks porque no deja tareas activas.
  private pintar(): void {
    const variante = this.getAttribute('variante') ?? 'primario';
    this.boton.className = variante === 'danger' ? 'peligro' : variante;
    this.boton.disabled = this.hasAttribute('deshabilitado') || this.hasAttribute('disabled');
  }
}

customElements.define('boton-app', BotonApp);
