import { Injectable } from '@nestjs/common';
import type { NestMiddleware } from '@nestjs/common';
import type { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'node:crypto';

@Injectable()
export class PeticionIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const recibido = req.headers['x-request-id'];
    const id = typeof recibido === 'string' && recibido.trim()
      ? recibido
      : randomUUID();

    res.setHeader('X-Request-Id', id);
    next();
  }
}