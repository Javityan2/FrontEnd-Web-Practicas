-- CreateTable
CREATE TABLE `clases` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(80) NOT NULL,
    `descripcion` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `horarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `claseId` INTEGER NOT NULL,
    `dia` VARCHAR(20) NOT NULL,
    `horaInicio` VARCHAR(5) NOT NULL,
    `cupoMaximo` INTEGER NOT NULL,
    `entrenador` VARCHAR(80) NOT NULL,

    INDEX `horarios_claseId_idx`(`claseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `miembros` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(120) NOT NULL,
    `correo` VARCHAR(160) NOT NULL,
    `membresia` VARCHAR(20) NOT NULL,
    `activo` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `miembros_correo_key`(`correo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `inscripciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `horarioId` INTEGER NOT NULL,
    `miembroId` INTEGER NOT NULL,
    `estado` ENUM('confirmada', 'cancelada') NOT NULL DEFAULT 'confirmada',
    `creadaEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `inscripciones_miembroId_idx`(`miembroId`),
    UNIQUE INDEX `inscripciones_horarioId_miembroId_key`(`horarioId`, `miembroId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `horarios` ADD CONSTRAINT `horarios_claseId_fkey` FOREIGN KEY (`claseId`) REFERENCES `clases`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inscripciones` ADD CONSTRAINT `inscripciones_horarioId_fkey` FOREIGN KEY (`horarioId`) REFERENCES `horarios`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `inscripciones` ADD CONSTRAINT `inscripciones_miembroId_fkey` FOREIGN KEY (`miembroId`) REFERENCES `miembros`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
