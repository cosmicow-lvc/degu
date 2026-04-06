import { Request, Response } from 'express';
import * as HolaService from '../services/hola.service';

export const getHelloWorld = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'Hello World con Express y TypeScript',
    status: 'success',
    timestamp: new Date().toISOString()
  });
};

export const getPersonalizedHola = (req: Request, res: Response) => {
  const { nombre } = req.params;
  const message = HolaService.getHolaMessage(nombre as string);
  res.send(message);
};