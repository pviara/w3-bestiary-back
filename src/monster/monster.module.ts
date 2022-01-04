import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonsterController } from './presentation/monster.controller';
import { MonsterRepoProvider } from './persistence/monster-repository.provider';
import { monsterSchema } from './persistence/monster-entity';
import { CqrsModule } from '@nestjs/cqrs';
import { GetAllMonstersHandler } from './application/queries/get-all-monsters.query';

const queryHandlers = [GetAllMonstersHandler];

@Module({
    controllers: [MonsterController],
    exports: [],
    imports: [
        CqrsModule,
        MongooseModule.forFeature([{
            name: 'Monster',
            schema: monsterSchema
        }])
    ],
    providers: [
        MonsterRepoProvider,
        ...queryHandlers
    ]
})
export class MonsterModule {}