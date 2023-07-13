import { Error } from '../../application/error';
import { FILE_SERVICE_TOKEN } from '../../file/application/file-service.provider';
import { HttpStatus, Inject } from '@nestjs/common';
import { ItemFileService } from '../../file/application/item-file-service.interface';
import { Item } from '../domain/item';
import { ItemRepository } from '../application/item-repository.interface';
import { Result } from '../../application/result';

export class ItemJsonRepository implements ItemRepository {
    constructor(
        @Inject(FILE_SERVICE_TOKEN)
        private readonly fileService: ItemFileService,
    ) {}

    async getAll(lang: string): Promise<Result<Item[]> | Error> {
        const itemEntities = this.fileService.getAllItemsFromJsonFile();

        const items = itemEntities.map<Item>((itemEntity) => {
            const targetItemName = itemEntity.names.find(
                (itemName) => itemName.lang === lang,
            );
            if (targetItemName) {
                return new Item(itemEntity.code, targetItemName.name);
            }
        });

        if (items.includes(undefined)) {
            return new Error(
                HttpStatus.NOT_FOUND,
                `Given lang "${lang}" didn't match at least one item's name language.`,
            );
        }

        return new Result(items);
    }
}
