import { categorySchema } from '../../../../category/persistence/category-entity';
import { CqrsModule } from '@nestjs/cqrs';
import { FileModule } from '../../../../file/file.module';
import { GetMonsterByCodeHandler } from '../../../application/queries/get-monster-by-code.handler';
import { GetMonstersByCategoriesHandler } from '../../../application/queries/get-monsters-by-category.handler';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { monsterSchema } from '../../../persistence/entities/monster-entity';
import { MonsterController } from '../../monster.controller';
import { MonsterTestingRepoProvider } from './monster-testing-repo.provider';
import { ReportTextTypoHandler } from '../../../application/commands/report-text-typo.handler';
import { TestHelper } from '../../../../utils/test-helper';
import { typoSchema } from '../../../persistence/entities/typo-entity';
import { TypoTestingRepoProvider } from './typo-testing-repo.provider';

const commandHandlers = [ReportTextTypoHandler];
const queryHandlers = [GetMonstersByCategoriesHandler, GetMonsterByCodeHandler];

@Module({
    controllers: [MonsterController],
    imports: [
        CqrsModule,
        FileModule,
        ...TestHelper.buildDatabaseTestingModule(),
        MongooseModule.forFeature([
            { name: 'Category', schema: categorySchema },
        ]),
        MongooseModule.forFeature([{ name: 'Monster', schema: monsterSchema }]),
        MongooseModule.forFeature([{ name: 'Typo', schema: typoSchema }]),
    ],
    providers: [
        ...commandHandlers,
        MonsterTestingRepoProvider,
        ...queryHandlers,
        TypoTestingRepoProvider,
    ],
})
export class MonsterTestingModule {}
