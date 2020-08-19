import 'reflect-metadata';
import 'dotenv/config';

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { errors } from 'celebrate';
import 'express-async-errors';

import uploadConfig from '@config/upload';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import routes from './routes';

import '@shared/infra/typeorm';
import '@shared/container';

const server = express();

server.use(rateLimiter);
server.use(cors());
server.use(express.json());
server.use('/files', express.static(uploadConfig.uploadsFolder));
server.use(routes);

server.use(errors());

server.use(
  (err: Error, request: Request, response: Response, _: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.error(err); //eslint-disable-line

    return response.status(500).json({
      status: 'error',
      message: 'Internal server error.',
    });
  },
);

server.listen(3333, () => {
  console.log('Server running!'); //eslint-disable-line
});
