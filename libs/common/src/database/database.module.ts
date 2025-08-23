import { Logger, Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        const isProd = configService.get<string>('NODE_ENV') === 'production';
        const logger = new Logger('Mongoose');

        return {
          uri,
          connectionFactory: (connection: Connection) => {
            if (!isProd) {
              connection.set('debug', (collection, method, query, doc) => {
                try {
                  logger.debug(
                    `${collection}.${method} ${JSON.stringify(query)} ${doc ? JSON.stringify(doc) : ''}`,
                  );
                } catch {
                  logger.debug(`${collection}.${method} (unable to stringify)`);
                }
              });
            }
            return connection;
          },
        };

        // return {
        //   uri: `mongodb://${user}:${password}@${host}:${port}/${db}?authSource=admin`,
        // };
      },
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {
  static forFeature(models: ModelDefinition[]) {
    return MongooseModule.forFeature(models);
  }
}
