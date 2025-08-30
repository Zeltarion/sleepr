import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from '@nestjs/core';

import { HealthModule, LoggerModule } from '@app/common';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RouterModule.register([
      {
        path: 'auth',
        children: [
          {
            path: 'health',
            module: HealthModule,
          },
          {
            path: '/',
            module: AuthModule,
          },
        ],
      },
    ]),
    HealthModule,
    AuthModule,
  ],
})
export class AppModule {}
