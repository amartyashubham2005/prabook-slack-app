import * as pg from 'pg';
import { Sequelize, SequelizeOptions } from 'sequelize-typescript';
import EnvService from '../../services/env.service';
import logger from '../../utils/logger';

logger.info(`Connecting to ${EnvService.env().PGDATABASE}`);

const params: SequelizeOptions = {
  host: EnvService.env().PGHOST,
  port: Number(EnvService.env().PGPORT),
  dialect: 'postgres',
  models: [__dirname + '/**/*.model.*'],
  repositoryMode: true,
  ...(process.env.NODE_ENV === 'development'
    ? {}
    : {
        dialectOptions: {
          decimalNumbers: true,
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        },
      }),
};

const sequelize = new Sequelize(
  EnvService.env().PGDATABASE,
  EnvService.env().PGUSER,
  EnvService.env().PGPASSWORD,
  params
);

pg.types.setTypeParser(1700, parseFloat);

export { sequelize };
