import { Injectable } from '@nestjs/common';

@Injectable()               // Nest puede crear esta clase e inyectarla donde se pida
export class AppService {   // la logica vive en el Service, no en el Controller
  getHello(): string {
    return 'Hello World!';
  }
}
