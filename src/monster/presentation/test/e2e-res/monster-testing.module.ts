import { categorySchema } from '../../../../category/persistence/category-entity';
import { CqrsModule } from '@nestjs/cqrs';
import { FileModule } from '../../../../file/file.module';
import { GetMonstersByCategoriesHandler } from '../../../application/queries/get-monsters-by-category.handler';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { monsterSchema } from '../../../persistence/entities/monster-entity';
import { MonsterController } from '../../monster.controller';
import { MonsterTestingRepoProvider } from './monster-testing-repo.provider';
import { TestHelper } from '../../../../utils/test-helper';

const queryHandlers = [GetMonstersByCategoriesHandler];

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
    ],
    providers: [MonsterTestingRepoProvider, ...queryHandlers],
})
export class MonsterTestingModule {}
