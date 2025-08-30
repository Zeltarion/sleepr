import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

import { HealthModule, LoggerModule } from '@app/common';
import { PaymentsModule } from './payments/payments.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RouterModule.register([
      {
        path: 'payments',
        children: [
          {
            path: 'health',
            module: HealthModule,
          },
          {
            path: '/',
            module: PaymentsModule,
          },
        ],
      },
    ]),
    HealthModule,
    PaymentsModule,
  ],
})
export class AppModule {}
