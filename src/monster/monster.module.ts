import { CqrsModule } from '@nestjs/cqrs';
import { FileModule } from '../file/file.module';
import { GetMonsterByCodeHandler } from './application/queries/get-monster-by-code.handler';
import { GetMonstersByCategoriesHandler } from './application/queries/get-monsters-by-category.handler';
import { Module } from '@nestjs/common';
import { MonsterController } from './presentation/monster.controller';
import { MonsterRepoProvider } from './persistence/repositories/monster-repository.provider';

const queryHandlers = [GetMonstersByCategoriesHandler, GetMonsterByCodeHandler];

@Module({
    controllers: [MonsterController],
    exports: [],
    imports: [CqrsModule, FileModule],
    providers: [MonsterRepoProvider, ...queryHandlers],
})
export class MonsterModule {}
