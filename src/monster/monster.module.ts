import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MonsterController } from './presentation/monster.controller';
import { MonsterRepoProvider } from './persistence/monster-repository.provider';
import { monsterSchema } from './persistence/monster-entity';

@Module({
    controllers: [MonsterController],
    exports: [],
    imports: [
        MongooseModule.forFeature([{
            name: 'Monster',
            schema: monsterSchema
        }])
    ],
    providers: [MonsterRepoProvider]
})
export class MonsterModule {}