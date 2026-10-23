type EstadoPrestamo = "activo" | "devuelto" | "vencido";

interface Prestamo {
  multa: number;
  ejemplar: number;
  estado: EstadoPrestamo;
  socio?: string;
}

function calcularMulta(prestamo: Prestamo): number {
  const cargoFijo = 50;
  return prestamo.multa + cargoFijo;
}

const prestamo: Prestamo = {
  multa: 350,
  ejemplar: 14,
  estado: "activo",
};

function crearRecibo(prestamo: Prestamo): string {
  const nombreSocio = prestamo.socio?.toUpperCase() ?? "SIN SOCIO";

  return `Socio: ${nombreSocio} | Ejemplar: ${prestamo.ejemplar} | Estado: ${prestamo.estado}`;
}

console.log(crearRecibo(prestamo));
console.log(`Multa total: $${calcularMulta(prestamo)}`);
