import { ItemJsonRepository } from './item-json-repository';
import { Provider } from '@nestjs/common';

export const ITEM_REPOSITORY_TOKEN = 'ItemRepo';

export const ItemRepoProvider: Provider = {
    provide: ITEM_REPOSITORY_TOKEN,
    useClass: ItemJsonRepository,
};
