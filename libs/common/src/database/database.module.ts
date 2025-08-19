import { Logger, Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Connection } from 'mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        const user = configService.get<string>('MONGO_USER');
        const password = configService.get<string>('MONGO_PASSWORD');
        const host = configService.get<string>('MONGO_HOST');
        const port = configService.get<string>('MONGO_PORT');
        const db = configService.get<string>('MONGO_DB');

        const uri = `mongodb://${user}:${password}@${host}:${port}/${db}?authSource=admin`;
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
