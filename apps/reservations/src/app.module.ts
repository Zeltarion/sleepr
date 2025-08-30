import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

import { ReservationsModule } from './reservations/reservations.module';
import { HealthModule, LoggerModule } from '@app/common';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RouterModule.register([
      {
        path: 'reservations',
        children: [
          {
            path: 'health',
            module: HealthModule,
          },
          {
            path: '/',
            module: ReservationsModule,
          },
        ],
      },
    ]),
    HealthModule,
    ReservationsModule,
  ],
})
export class AppModule {}
