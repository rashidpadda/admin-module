// src/database/database.providers.ts
import { Sequelize } from 'sequelize-typescript';
import databaseConfig from './database.config';
import { User } from 'src/users/entities/users.model';
import { SEQUELIZE } from 'src/utils/constants';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      const env = process.env.NODE_ENV || 'development';
      const config = databaseConfig[env];

      const sequelize = new Sequelize({
        dialect: config.dialect as any,
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        logging: config.logging,
        define: {
          underscored: true,
          timestamps: true,
          paranoid: true,
        },
      });

      sequelize.addModels([User]); // Register models
      await sequelize.sync({ alter: true }); // Use `force: true` for dev resets

      return sequelize;
    },
  },
];
