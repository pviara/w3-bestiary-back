import { CqrsModule } from '@nestjs/cqrs';
import { FileModule } from 'src/file/file.module';
import { GetAllItemsHandler } from './application/queries/get-all-items.query';
import { GetItemThumbnailHandler } from './application/queries/get-item-thumbnail.handler';
import { ItemController } from './presentation/item.controller';
import { ItemRepoProvider } from './persistence/item-repository.provider';
import { itemSchema } from './persistence/item-entity';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

const queryHandlers = [GetAllItemsHandler, GetItemThumbnailHandler];

@Module({
    controllers: [ItemController],
    exports: [],
    imports: [
        CqrsModule,
        FileModule,
        MongooseModule.forFeature([
            {
                name: 'Item',
                schema: itemSchema,
            },
        ]),
    ],
    providers: [ItemRepoProvider, ...queryHandlers],
})
export class ItemModule {}
