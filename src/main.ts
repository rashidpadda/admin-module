import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from './utils/constants';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const sequelize: Sequelize = app.get(SEQUELIZE);
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
  });

  console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
  console.log(`Environment: ${process.env.NODE_ENV ?? 'development'}`);

  await sequelize.sync({ alter: true });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
