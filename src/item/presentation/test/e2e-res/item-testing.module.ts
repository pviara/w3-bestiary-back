import { CqrsModule } from '@nestjs/cqrs';
import { FileModule } from '../../../../file/file.module';
import { GetAllItemsHandler } from '../../../application/queries/get-all-items.handler';
import { GetImageFileHandler } from '../../../../file/application/queries/get-image-file.handler';
import { ItemController } from '../../item.controller';
import { itemSchema } from '../../../persistence/item-entity';
import { ItemTestingRepoProvider } from './item-testing-repo.provider';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TestHelper } from '../../../../utils/test-helper';

const queryHandlers = [GetAllItemsHandler, GetImageFileHandler];

@Module({
    controllers: [ItemController],
    imports: [
        CqrsModule,
        FileModule,
        ...TestHelper.buildDatabaseTestingModule(),
        MongooseModule.forFeature([{ name: 'Item', schema: itemSchema }]),
    ],
    providers: [ItemTestingRepoProvider, ...queryHandlers],
})
export class ItemTestingModule {}
