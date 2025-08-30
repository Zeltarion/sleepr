import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

import { HealthModule, LoggerModule } from '@app/common';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RouterModule.register([
      {
        path: 'notifications',
        children: [
          {
            path: 'health',
            module: HealthModule,
          },
          {
            path: '/',
            module: NotificationsModule,
          },
        ],
      },
    ]),
    HealthModule,
    NotificationsModule,
  ],
})
export class AppModule {}
