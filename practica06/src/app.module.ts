import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClasesModule } from './clases/clases.module';
import { InscripcionesModule } from './inscripciones/inscripciones.module';

@Module({
  imports: [ClasesModule, InscripcionesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
