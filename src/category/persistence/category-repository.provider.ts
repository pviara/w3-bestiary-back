import { CategoryJsonRepository } from './category-json-repository';
import { Provider } from '@nestjs/common';

export const CATEGORY_REPO_TOKEN = 'CategoryRepo';

export const CategoryRepoProvider: Provider = {
    provide: CATEGORY_REPO_TOKEN,
    useClass: CategoryJsonRepository,
};
