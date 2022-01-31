import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { ConfigurationModule } from './infrastructure/configuration/configuration.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { DatabaseService } from './infrastructure/database/database.service';
import { ItemModule } from './item/item.module';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MonsterModule } from './monster/monster.module';
import { RouterModule } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
    imports: [
        CategoryModule,
        ConfigurationModule,
        ItemModule,
        MongooseModule.forRootAsync({
            imports: [DatabaseModule],
            useFactory: (dbService: DatabaseService) => {
                const options: MongooseModuleOptions = {
                    uri: dbService.dbURI,
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                };
                return options;
            },
            inject: [DatabaseService],
        }),
        MonsterModule,
        RouterModule.register([
            {
                path: 'api',
                children: [
                    {
                        path: 'item',
                        module: ItemModule,
                    },
                    {
                        path: 'monster',
                        module: MonsterModule,
                    },
                ],
            },
        ]),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public')
        })
    ],
    controllers: [],
    providers: [AppService],
})
export class AppModule {}
