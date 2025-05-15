import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from './utils/constants';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   const sequelize: Sequelize = app.get(SEQUELIZE);
//   app.enableCors({
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     preflightContinue: false,
//   });

//   console.log(`Server is running on port ${process.env.PORT ?? 3000}`);
//   console.log(`Environment: ${process.env.NODE_ENV ?? 'development'}`);

//   await sequelize.sync({ alter: true });

//   await app.listen(process.env.PORT ?? 3000);
// }
// bootstrap();

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
        },
        consumer: {
          groupId: 'admin-consumer-group',
        },
      },
    },
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  console.log('kafka microservice is running');
  await app.listen();
}

bootstrap();
