import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import * as cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';
import { applyGlobalPrefix } from '@app/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // applyGlobalPrefix(app);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [configService.getOrThrow('RABBITMQ_URI')],
      queue: 'auth',
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();

  await app.init();
  const adapter = app.getHttpAdapter();
  if (adapter.getType() === 'express') {
    const instance = adapter.getInstance();

    if (instance.router?.stack) {
      console.log('--- ROUTES ---');
      instance.router.stack
        .filter((layer) => layer.route)
        .forEach((layer) => {
          const methods = Object.keys(layer.route.methods)
            .join(',')
            .toUpperCase()
            .padEnd(6);
          console.log(`${methods} ${layer.route.path}`);
        });
    } else {
      console.warn('⚠️  _router.stack not found');
    }
  }
  await app.listen(configService.get('HTTP_PORT') as number, '0.0.0.0');
}
bootstrap();
