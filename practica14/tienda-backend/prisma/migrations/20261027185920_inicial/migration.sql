-- CreateTable
CREATE TABLE `productos` (
    `id` VARCHAR(10) NOT NULL,
    `nombre` VARCHAR(80) NOT NULL,
    `precio` INTEGER NOT NULL,
    `categoria` VARCHAR(30) NOT NULL,
    `imagen` VARCHAR(120) NOT NULL,
    `existencia` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pedidos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `correo` VARCHAR(120) NOT NULL,
    `telefono` VARCHAR(10) NOT NULL,
    `total` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `renglones_pedido` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pedidoId` INTEGER NOT NULL,
    `productoId` VARCHAR(10) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precio` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `renglones_pedido` ADD CONSTRAINT `renglones_pedido_pedidoId_fkey` FOREIGN KEY (`pedidoId`) REFERENCES `pedidos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `renglones_pedido` ADD CONSTRAINT `renglones_pedido_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `productos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
