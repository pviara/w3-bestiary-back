import { CategoryRepositoryImplement } from './category-repository.implement';
import { Provider } from '@nestjs/common';

export const CategoryRepoProvider: Provider = {
    provide: 'CategoryRepo',
    useClass: CategoryRepositoryImplement,
};
