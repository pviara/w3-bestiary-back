import { ItemTestingRepositoryImplement } from './item-testing-repo.implement';
import { Provider } from '@nestjs/common';

export const ItemTestingRepoProvider: Provider = {
    provide: 'ItemRepo',
    useClass: ItemTestingRepositoryImplement,
};
