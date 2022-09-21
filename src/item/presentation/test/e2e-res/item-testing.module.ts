import { CqrsModule } from '@nestjs/cqrs';
import { FileModule } from '../../../../file/file.module';
import { itemSchema } from '../../../persistence/item-entity';
import { ItemTestingRepositoryImplement } from './item-testing-repo.implement';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestHelper } from '../../../../utils/test-helper';

@Module({
    imports: [
        CqrsModule,
        FileModule,
        ...TestHelper.buildDatabaseTestingModule(),
        MongooseModule.forFeature([{ name: 'Item', schema: itemSchema }]),
    ],
    providers: [ItemTestingRepositoryImplement],
})
export class ItemTestingModule {}
