import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { get } from 'axios';

@Controller()
export class AppController {
  catalogo = [
    {id: 1, nombre: 'MMA'},
    {id: 2, nombre: 'Boxeo'},
    {id: 3, nombre: 'Kickboxing'},
    {id: 4, nombre: 'Yoga'}
  ];

  @Post('/clases')
  agregarClase(@Body() nuevaClase: { id: number; nombre: string }) {
    this.catalogo.push(nuevaClase);
    return { message: 'Clase agregada correctamente', clase: nuevaClase };
  }

  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('/clases')
  getCatalogo() {
    return this.catalogo;
  }
}
