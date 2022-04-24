import { ItemRepositoryImplement } from './item-repository.implement';
import { Provider } from '@nestjs/common';

export const ItemRepoProvider: Provider = {
    provide: 'ItemRepo',
    useClass: ItemRepositoryImplement,
};
