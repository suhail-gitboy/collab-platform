import { DynamicModule, Global, Module } from '@nestjs/common';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { ConfigService } from '@nestjs/config';

import {
    SequelizeModule,
    SequelizeModuleOptions,
} from '@nestjs/sequelize';
@Global()
@Module({
    controllers: [AppController],
    providers: [AppService]
})
export class DatabaseModule {
    static forRootAsync(): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [
                SequelizeModule.forRootAsync({
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService): Promise<SequelizeModuleOptions> => {

                        return {

                            dialect: 'postgres',

                            host: configService.get('DB_HOST'),
                            port: configService.get('DB_PORT'),
                            username: configService.get('DB_USERNAME'),
                            password: configService.get('DB_PASSWORD'),
                            database: configService.get('DB_NAME'),
                            autoLoadModels: true,
                            logging: true,
                            synchronize: false
                        }
                    }
                })
            ]
        }
    }
}
