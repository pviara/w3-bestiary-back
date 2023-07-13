import { CqrsModule } from '@nestjs/cqrs';
import { FileModule } from '../file/file.module';
import { GetAllItemsHandler } from './application/queries/get-all-items.handler';
import { ItemController } from './presentation/item.controller';
import { ItemRepoProvider } from './persistence/item-repository.provider';
import { Module } from '@nestjs/common';

const queryHandlers = [GetAllItemsHandler];

@Module({
    controllers: [ItemController],
    exports: [],
    imports: [CqrsModule, FileModule],
    providers: [ItemRepoProvider, ...queryHandlers],
})
export class ItemModule {}
