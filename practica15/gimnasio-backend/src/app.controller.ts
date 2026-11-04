import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Publico } from './auth/decoradores/publico.decorator';

@Publico() // la raiz es publica, sin token
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {} // Nest crea AppService y lo inyecta aqui

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
