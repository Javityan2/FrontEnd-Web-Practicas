# API de la tienda

Backend de productos y pedidos desarrollado con NestJS, Prisma y MySQL. Las respuestas exitosas utilizan el sobre `{ data, meta }`.

| Método | Ruta | Función |
|---|---|---|
| GET | `/productos` | Consulta el catálogo; admite el filtro `categoria` |
| GET | `/productos/:id` | Consulta un producto o responde 404 |
| POST | `/pedidos` | Valida el pedido, descuenta existencias y devuelve folio y total |

El cuerpo de un pedido contiene `correo`, `telefono` y un arreglo `productos` de identificadores. Un identificador repetido representa varias piezas. La API responde 400 ante datos inválidos y 409 cuando no hay existencia suficiente.

El pago es simulado y no realiza cargos. La instalación, las variables de entorno, las pruebas y las evidencias están documentadas en el [README de la práctica 14](../README.md).
