import { CategoryModule } from './category/category.module';
import { ConfigurationModule } from './infrastructure/configuration/configuration.module';
import { ItemModule } from './item/item.module';
import { Module } from '@nestjs/common';
import { MonsterModule } from './monster/monster.module';
import { RouterModule } from '@nestjs/core';
import { VersionModule } from './version/version.module';

@Module({
    imports: [
        CategoryModule,
        ConfigurationModule,
        ItemModule,
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
                    {
                        path: 'version',
                        module: VersionModule,
                    },
                ],
            },
        ]),
        VersionModule,
    ],
    controllers: [],
    providers: [],
})
export class AppModule {}
