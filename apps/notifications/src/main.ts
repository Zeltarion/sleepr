import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications/notifications.module';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';
import { Logger } from 'nestjs-pino';
import { applyGlobalPrefix } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  applyGlobalPrefix(app);
  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('PORT') as number,
    },
  });
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
}
bootstrap();
